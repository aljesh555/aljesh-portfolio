import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EDGES, HOME } from "../lib/edges";
import { ArrowRight, Globe } from "lucide-react";

// A small curated set of globally-distributed edges for the rotating demo.
// We exclude HOME (Kathmandu) so the rotation always shows somewhere different.
const SHOWCASE_CODES = ["NRT", "ICN", "SIN", "DXB", "FRA", "LHR", "CDG", "EWR", "LAX", "SYD", "GRU"];

export default function EdgeReadout({ visitor, latency, source, loading }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kathmandu",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const showcase = useMemo(
    () =>
      SHOWCASE_CODES.map((code) => EDGES.find((e) => e.code === code)).filter(Boolean),
    []
  );

  const [demoIndex, setDemoIndex] = useState(0);
  useEffect(() => {
    if (showcase.length === 0) return;
    const id = setInterval(() => setDemoIndex((i) => (i + 1) % showcase.length), 1800);
    return () => clearInterval(id);
  }, [showcase.length]);

  const isHomeVisitor = visitor && visitor.code === HOME.code;
  const demoEdge = showcase[demoIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-md border border-[var(--line-strong)] backdrop-blur-md p-4 sm:p-5 relative overflow-hidden"
      style={{ background: "color-mix(in oklab, var(--bg-2), transparent 25%)" }}
    >
      <div className="flex items-center justify-between mono text-[9px] uppercase tracking-[0.22em] opacity-80">
        <span className="inline-flex items-center gap-2">
          <Globe size={11} /> Edge · live trace
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }}>
            {!loading && (
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "var(--accent)" }}
              />
            )}
          </span>
          {loading
            ? "tracing"
            : source === "cloudflare"
            ? "cloudflare · cdn-cgi"
            : source === "ipapi"
            ? "geo · ipapi"
            : "fallback"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* You — real visitor edge */}
        <div>
          <div className="mono text-[9px] uppercase tracking-[0.22em] opacity-60">You · served from</div>
          <div
            className="font-display text-2xl sm:text-3xl mt-1 truncate"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
          >
            {visitor ? visitor.name : "…"}
          </div>
          <div className="mono text-[10px] opacity-70 mt-0.5 tabular-nums">
            {visitor ? visitor.code : "—"}
            {latency != null ? ` · ${latency}ms` : ""}
          </div>
        </div>

        <div className="relative h-6 w-16 sm:w-24 self-center">
          <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: "var(--line-strong)" }} />
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
            animate={{ left: ["-2%", "102%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <ArrowRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-70" />
        </div>

        {/* Atelier */}
        <div className="text-right">
          <div className="mono text-[9px] uppercase tracking-[0.22em] opacity-60">Atelier · here</div>
          <div
            className="font-display text-2xl sm:text-3xl mt-1"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
          >
            {HOME.name}
          </div>
          <div className="mono text-[10px] opacity-70 mt-0.5 tabular-nums">NPL · {time}</div>
        </div>
      </div>

      {/* Same-city contextual note */}
      {isHomeVisitor && !loading && (
        <div className="mt-3 rounded-md px-3 py-2 mono text-[9px] uppercase tracking-[0.22em] leading-[1.6] opacity-80"
             style={{ background: "color-mix(in oklab, var(--accent), transparent 88%)", border: "1px dashed color-mix(in oklab, var(--accent), transparent 60%)" }}>
          You're in <span className="opacity-100" style={{ color: "var(--accent)" }}>Kathmandu</span> — same edge as the atelier. This panel reads your location live; visitors elsewhere see <span className="opacity-100">their own city</span>.
        </div>
      )}

      <hr className="dotted-rule my-4" />

      {/* Rotating "same pipeline also serves" — demonstrates the local→global story */}
      <div className="flex items-center justify-between gap-3">
        <span className="mono text-[9px] uppercase tracking-[0.22em] opacity-60 shrink-0">
          Same pipeline also serves
        </span>
        <div className="relative h-6 flex-1 overflow-hidden text-right">
          <AnimatePresence mode="wait">
            {demoEdge && (
              <motion.div
                key={demoEdge.code}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-end gap-2"
              >
                <span
                  className="font-display text-base sm:text-lg"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
                >
                  {demoEdge.name}
                </span>
                <span className="mono text-[10px] opacity-70 tabular-nums">{demoEdge.code}</span>
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--accent)" }}
                  aria-hidden
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-3 mono text-[10px] uppercase tracking-[0.18em] opacity-70 leading-[1.7]">
        Built from a Kathmandu studio · delivered through{" "}
        <span style={{ color: "var(--accent)" }}>320+ Cloudflare edge cities</span> — the same local-to-global
        pipeline I'll use to ship yours, whether it's a one-city launch or a worldwide rollout.
      </p>
    </motion.div>
  );
}
