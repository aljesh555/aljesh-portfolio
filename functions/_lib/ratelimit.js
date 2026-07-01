// Minimal fixed-window rate limiter backed by Workers KV.
// KV is eventually consistent so this isn't perfectly atomic, but it's plenty to
// throttle abuse on a low-traffic site. Fails OPEN when no KV binding is present,
// so a missing/misconfigured namespace never takes the whole endpoint down.
export async function rateLimit(kv, { key, limit, windowSeconds }) {
  if (!kv) return { ok: true };
  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / windowSeconds);
  const k = `rl:${key}:${bucket}`;

  let count = 0;
  try {
    count = parseInt((await kv.get(k)) || "0", 10) || 0;
  } catch {
    return { ok: true }; // read failure -> don't block
  }

  if (count >= limit) {
    return { ok: false, retryAfter: (bucket + 1) * windowSeconds - now };
  }

  try {
    await kv.put(k, String(count + 1), { expirationTtl: windowSeconds + 60 });
  } catch {
    // write failure -> allow anyway
  }
  return { ok: true };
}
