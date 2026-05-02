import { CAPABILITIES } from "../lib/data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Marquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  return (
    <section ref={ref} className="relative py-10 overflow-hidden border-y border-[var(--line)]" style={{ background: "var(--bg-2)" }}>
      <motion.div style={{ x }} className="marquee-pause">
        <div className="marquee-track text-4xl md:text-6xl lg:text-7xl font-display whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12">
              {CAPABILITIES.map((c, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-12">
                  <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>{c}</span>
                  <span className="star opacity-60" style={{ width: 28, height: 28, color: "var(--accent)" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
