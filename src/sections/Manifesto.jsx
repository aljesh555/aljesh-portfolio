import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TEXT = "Most of the value in a project hides in the last ten percent. Error messages, empty states, what happens when the network drops. That's the part users actually feel, and I spend disproportionate time there.";

export default function Manifesto() {
  const ref = useRef(null);
  const words = TEXT.split(" ");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });

  return (
    <section ref={ref} className="relative px-4 sm:px-8 lg:px-12 py-24 sm:py-32 border-t border-[var(--line)]">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 mono text-[10px] uppercase tracking-[0.22em] opacity-70">
          <div>⌗ A note —</div>
          <div className="mt-2">on practice</div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <p className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.04]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}>
            {words.map((w, i) => (
              <Word key={i} progress={scrollYProgress} start={i / words.length} end={i / words.length + 1.2 / words.length}>
                {w}
              </Word>
            ))}
          </p>
          <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-60 mt-8">— A.R., 2026</p>
        </div>
      </div>
    </section>
  );
}

function Word({ progress, start, end, children }) {
  const opacity = useTransform(progress, [start, end], [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.22em]">
      {children}
    </motion.span>
  );
}
