import { useEffect, useState } from "react";
import { EDGES, HOME, findEdgeByCode, findNearestEdge } from "./edges";

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
      // 1. Cloudflare trace (works on Cloudflare Pages / Workers)
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

      // 2. ipapi.co fallback (CORS-enabled, free tier)
      try {
        const t0 = performance.now();
        const res = await fetch("https://ipapi.co/json/");
        const ms = Math.round(performance.now() - t0);
        const data = await res.json();
        if (cancelled) return;
        const edge = findNearestEdge(data.latitude, data.longitude);
        if (edge) {
          setState({
            visitor: edge,
            latency: ms,
            source: "ipapi",
            country: data.country_code || null,
            loading: false,
          });
          return;
        }
      } catch { /* geolocation unavailable */ }

      // 3. Final fallback: pick a sensible default so UI is never empty
      if (cancelled) return;
      setState({
        visitor: EDGES.find((e) => e.code === "SIN") || HOME,
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
