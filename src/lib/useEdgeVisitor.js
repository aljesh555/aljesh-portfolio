import { useEffect, useState } from "react";
import { HOME, findEdgeByCode } from "./edges";

function parseTrace(text) {
  const out = {};
  for (const line of text.trim().split("\n")) {
    const i = line.indexOf("=");
    if (i > 0) out[line.slice(0, i)] = line.slice(i + 1);
  }
  return out;
}

export default function useEdgeVisitor() {
  const [state, setState] = useState({
    visitor: null,
    latency: null,
    source: null,
    country: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function detect() {
      // Cloudflare trace — works on Cloudflare Pages / Workers (production).
      // Off-platform (local dev, other hosts) falls through to HOME without
      // calling any third-party geolocation service.
      try {
        const t0 = performance.now();
        const res = await fetch("/cdn-cgi/trace", { cache: "no-store" });
        const ms = Math.round(performance.now() - t0);
        if (!res.ok) throw new Error("trace not available");
        const data = parseTrace(await res.text());
        const edge = findEdgeByCode(data.colo);
        if (cancelled) return;
        if (edge) {
          setState({
            visitor: edge,
            latency: ms,
            source: "cloudflare",
            country: data.loc || null,
            loading: false,
          });
          return;
        }
      } catch { /* trace unavailable */ }

      if (cancelled) return;
      setState({
        visitor: HOME,
        latency: null,
        source: "fallback",
        country: null,
        loading: false,
      });
    }

    detect();
    return () => { cancelled = true; };
  }, []);

  return state;
}
