import { buildSystemInstruction } from "../_lib/prompt.js";
import { rateLimit } from "../_lib/ratelimit.js";

const ALLOWED_MIME = /^(image\/(png|jpe?g|webp|gif|heic|heif)|application\/pdf|audio\/(webm|ogg|mp3|mpeg|wav|x-wav|aac|mp4|m4a|flac|aiff))$/i;
const MAX_ATTACH_PER_MSG = 5;
const MAX_B64_LEN = 6_000_000; // ~4.4 MB per attachment (base64)

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers },
  });
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";

  const burst = await rateLimit(env.RATE_LIMIT, { key: `chat:min:${ip}`, limit: 12, windowSeconds: 60 });
  if (!burst.ok) return json({ error: "rate_limited" }, 429, { "Retry-After": String(burst.retryAfter || 30) });
  const daily = await rateLimit(env.RATE_LIMIT, { key: `chat:day:${ip}`, limit: 120, windowSeconds: 86400 });
  if (!daily.ok) return json({ error: "daily_limit" }, 429);

  if (!env.GEMINI_API_KEY) return json({ error: "server_misconfigured" }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "bad_request" }, 400);
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const contents = [];
  for (const m of history.slice(-14)) {
    if (!m) continue;
    const role = m.role === "assistant" || m.role === "model" ? "model" : "user";
    const parts = [];
    if (typeof m.text === "string" && m.text.trim()) parts.push({ text: m.text.slice(0, 2000) });
    // Attachments (images / PDF / audio) only make sense on user turns.
    if (role === "user" && Array.isArray(m.attachments)) {
      for (const a of m.attachments.slice(0, MAX_ATTACH_PER_MSG)) {
        if (
          a && typeof a.mimeType === "string" && ALLOWED_MIME.test(a.mimeType) &&
          typeof a.data === "string" && a.data.length > 0 && a.data.length <= MAX_B64_LEN
        ) {
          parts.push({ inline_data: { mime_type: a.mimeType, data: a.data } });
        }
      }
    }
    if (parts.length) contents.push({ role, parts });
  }

  while (contents.length && contents[0].role !== "user") contents.shift();
  if (!contents.length || contents[contents.length - 1].role !== "user") {
    return json({ error: "empty" }, 400);
  }

  const model = env.GEMINI_MODEL || "gemini-3.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${env.GEMINI_API_KEY}`;

  const payload = {
    systemInstruction: { parts: [{ text: buildSystemInstruction() }] },
    contents,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 900,
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  let upstream;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return json({ error: "upstream_unreachable" }, 502);
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return json({ error: "upstream", detail: detail.slice(0, 300) }, 502);
  }

  return new Response(toTextStream(upstream.body), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function toTextStream(readable) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return new ReadableStream({
    async start(controller) {
      const reader = readable.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx;
          while ((idx = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 1);
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const parts = parsed?.candidates?.[0]?.content?.parts || [];
              for (const p of parts) {
                if (p?.text) controller.enqueue(encoder.encode(p.text));
              }
            } catch {
              // partial JSON line spanning chunks — ignore
            }
          }
        }
      } catch {
        // upstream aborted mid-stream
      } finally {
        controller.close();
      }
    },
  });
}
