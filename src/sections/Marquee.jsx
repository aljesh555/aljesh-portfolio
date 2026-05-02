import { CAPABILITIES } from "../lib/data";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Marquee() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <section
      ref={ref}
      className="relative py-5 sm:py-6 overflow-hidden border-y border-[var(--line)]"
      style={{ background: "var(--bg-2)" }}
    >
      <motion.div style={{ x }} className="marquee-pause">
        <div className="marquee-track marquee-track--slow mono text-[11px] sm:text-[12px] uppercase tracking-[0.28em] whitespace-nowrap opacity-75">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-8 sm:gap-10">
              {CAPABILITIES.map((c, i) => (
                <span key={`${k}-${i}`} className="flex items-center gap-8 sm:gap-10">
                  <span className="font-light">{c}</span>
                  <span
                    className="star opacity-50"
                    style={{ width: 9, height: 9, color: "var(--accent)" }}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
