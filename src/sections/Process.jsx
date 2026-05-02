import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROCESS } from "../lib/data";
import { Mask, FadeUp } from "../components/Reveal";

export default function Process() {
  return (
    <section id="process" className="relative px-4 sm:px-8 lg:px-12 py-24 sm:py-32 border-t border-[var(--line)]" style={{ background: "var(--bg-2)" }}>
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-3">
          <span className="sec-num">⌗ 02 — Method</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display text-[10vw] sm:text-[7vw] md:text-[5.4vw] leading-[0.95]">
            <Mask><span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}>Five movements,</span></Mask>
            <br />
            <Mask delay={0.08}><span className="font-italic">one composition.</span></Mask>
          </h2>
          <FadeUp delay={0.1} className="max-w-xl mt-6 text-[15px] leading-[1.55] text-[var(--fg-soft)]">
            How I move from a half-formed idea to a product your customers can quote. Not a template — a tempo.
          </FadeUp>
        </div>
      </div>

      <ProcessTimeline />
    </section>
  );
}

function ProcessTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 30%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative grid grid-cols-12 gap-6">
      {/* progress rail */}
      <div className="hidden md:block col-span-1 relative">
        <div className="sticky top-32 h-[60vh] w-px mx-auto bg-[var(--line)] relative overflow-hidden">
          <motion.div style={{ height: lineHeight }} className="absolute inset-x-0 top-0 w-px" >
            <div className="h-full w-full" style={{ background: "var(--accent)" }} />
          </motion.div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-11 flex flex-col">
        {PROCESS.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-12 gap-4 py-8 border-t border-[var(--line)] first:border-t-0"
          >
            <div className="col-span-2 md:col-span-1 mono text-[12px] tracking-[0.2em] opacity-70">{p.num}.</div>
            <div className="col-span-10 md:col-span-4 font-display text-3xl sm:text-4xl lg:text-5xl" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}>
              {p.label}
            </div>
            <div className="col-span-12 md:col-span-7 text-[15px] leading-[1.55] text-[var(--fg-soft)] max-w-xl">
              {p.body}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
