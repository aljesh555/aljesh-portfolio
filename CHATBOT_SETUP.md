# AI Chatbot — Setup & Deploy

The site now has an AI chat assistant (Google Gemini) with lead capture
(Google Sheet + Brevo email). All server logic lives in `functions/`, which
Cloudflare Pages deploys alongside the static site.

## Files
- `functions/api/chat.js` — Gemini streaming proxy (keeps the API key server-side)
- `functions/api/lead.js` — saves a lead to the Google Sheet + emails you via Brevo
- `functions/_lib/prompt.js` — builds the bot's knowledge from `src/lib/data.js`
- `functions/_lib/ratelimit.js` — per-visitor rate limiting (Workers KV)
- `src/components/ChatWidget.jsx` — the floating chat UI (wired into `src/App.jsx`)

## 1. Secrets (never committed)
Set these in Cloudflare for production:

    wrangler pages secret put GEMINI_API_KEY
    wrangler pages secret put BREVO_API_KEY
    wrangler pages secret put SHEET_WEBHOOK_URL
    wrangler pages secret put SHEET_SECRET

Non-secret config lives in `wrangler.toml [vars]` (`BREVO_SENDER_EMAIL`, `LEAD_NOTIFY_EMAIL`).

## 2. Local testing
1. `cp .dev.vars.example .dev.vars` and fill in the 4 secrets. (`.dev.vars` is gitignored.)
2. `npm run build`
3. `npx wrangler pages dev dist`
4. Open the printed URL — chat button is bottom-right.

> Plain `npm run dev` (Vite) serves the UI but NOT the `functions/` API, so the
> bot won't respond there. Use `wrangler pages dev` to test the whole thing.

## 3. Rate limiting (do before going public)
    wrangler kv namespace create RATE_LIMIT
Copy the returned `id`, then uncomment the `[[kv_namespaces]]` block in
`wrangler.toml` and paste it in. Without KV the endpoints still work — just
unthrottled, which leaves your Gemini free quota exposed to abuse.

## 4. Deploy
    npm run build
    wrangler pages deploy dist

Same command you already use — Wrangler bundles `functions/` automatically.

## Rotating a secret later
- **Gemini / Brevo:** regenerate in the provider, then re-run `wrangler pages secret put ...`.
- **Sheet secret:** change `SECRET` in the Apps Script, redeploy the web app, and
  update the `SHEET_SECRET` Cloudflare secret to match.

## How lead capture triggers
When a visitor shows hiring intent, the bot ends its reply with a hidden
`[[SHOW_LEAD_FORM]]` marker. The widget strips the marker and reveals the
inline name/email/message form, which POSTs to `/api/lead`.
