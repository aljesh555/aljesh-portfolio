import { rateLimit } from "../_lib/ratelimit.js";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (v) =>
  String(v).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const rl = await rateLimit(env.RATE_LIMIT, { key: `lead:${ip}`, limit: 6, windowSeconds: 3600 });
  if (!rl.ok) return json({ ok: false, error: "rate_limited" }, 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // Honeypot — real users never fill this hidden field. Pretend success, save nothing.
  if (clean(body.company, 100)) return json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const message = clean(body.message, 2000);

  if (!name || !isEmail(email)) return json({ ok: false, error: "invalid" }, 400);

  let sheetOk = false;
  let mailOk = false;

  // 1) Append a row to the Google Sheet (via the Apps Script web app).
  if (env.SHEET_WEBHOOK_URL && env.SHEET_SECRET) {
    try {
      const r = await fetch(env.SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: env.SHEET_SECRET, name, email, phone, message }),
      });
      const data = await r.json().catch(() => ({}));
      sheetOk = data?.ok === true;
    } catch {
      /* fall through to email */
    }
  }

  // 2) Email notification via Brevo (reply-to is the lead, so replies reach them).
  if (env.BREVO_API_KEY && env.BREVO_SENDER_EMAIL && env.LEAD_NOTIFY_EMAIL) {
    try {
      const r = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Portfolio Chatbot", email: env.BREVO_SENDER_EMAIL },
          to: [{ email: env.LEAD_NOTIFY_EMAIL }],
          replyTo: { email, name },
          subject: `New lead from your portfolio — ${name}`,
          htmlContent:
            `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">` +
            `<h2 style="margin:0 0 12px">New lead from the chatbot</h2>` +
            `<p><strong>Name:</strong> ${esc(name)}</p>` +
            `<p><strong>Email:</strong> ${esc(email)}</p>` +
            `<p><strong>Phone:</strong> ${phone ? esc(phone) : "—"}</p>` +
            `<p><strong>Message:</strong><br>${message ? esc(message) : "—"}</p>` +
            `<hr style="border:none;border-top:1px solid #ddd;margin:16px 0">` +
            `<p style="color:#888;font-size:13px">Reply directly to this email to reach them.</p>` +
            `</div>`,
        }),
      });
      mailOk = r.ok;
    } catch {
      /* already tried the sheet */
    }
  }

  if (!sheetOk && !mailOk) return json({ ok: false, error: "delivery_failed" }, 502);
  return json({ ok: true });
}
