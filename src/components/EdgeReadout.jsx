import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HOME } from "../lib/edges";
import { ArrowRight, Globe } from "lucide-react";

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
            ? "cloudflare"
            : source === "ipapi"
            ? "geo · ipapi"
            : "fallback"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* You */}
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

        {/* Arrow with traveling dot */}
        <div className="relative h-6 w-16 sm:w-24 self-center">
          <div
            className="absolute left-0 right-0 top-1/2 h-px"
            style={{ background: "var(--line-strong)" }}
          />
          <motion.span
            className="absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--accent)" }}
            animate={{ left: ["-2%", "102%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <ArrowRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-70" />
        </div>

        {/* Bharatpur */}
        <div className="text-right">
          <div className="mono text-[9px] uppercase tracking-[0.22em] opacity-60">Atelier · here</div>
          <div
            className="font-display text-2xl sm:text-3xl mt-1"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
          >
            {HOME.name}
          </div>
          <div className="mono text-[10px] opacity-70 mt-0.5 tabular-nums">
            NPL · {time}
          </div>
        </div>
      </div>

      <hr className="dotted-rule my-4" />

      <p className="mono text-[10px] uppercase tracking-[0.18em] opacity-70 leading-[1.7]">
        Built from a Kathmandu studio · delivered through <span style={{ color: "var(--accent)" }}>320+ Cloudflare edge cities</span> — the same local-to-global pipeline I'll use to ship yours, whether it's a one-city launch or a worldwide rollout.
      </p>
    </motion.div>
  );
}
