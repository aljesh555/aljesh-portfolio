import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mask, FadeUp } from "../components/Reveal";
import { STATS } from "../lib/data";

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section ref={ref} id="about" className="relative px-4 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40 border-t border-[var(--line)]">
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-3">
          <span className="sec-num">⌗ 04 — Atelier</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6.4vw] leading-[0.92]">
            <Mask><span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>The man at</span></Mask>
            <br />
            <Mask delay={0.08}><span className="font-italic">the workbench.</span></Mask>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
        {/* Portrait */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4">
          <div className="relative overflow-hidden rounded-md border border-[var(--line)] aspect-[3/4]" data-cursor="hover">
            <motion.div style={{ y: portraitY, scale: portraitScale }} className="absolute inset-0">
              <img
                src="/portrait.jpg"
                alt="Aljesh Raut, photographed in Bharatpur"
                className="h-full w-full object-cover duotone"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, color-mix(in oklab, var(--bg), transparent 30%) 0%, transparent 35%)"
              }} />
            </motion.div>
            <div className="absolute top-3 left-3 chip" style={{ background: "color-mix(in oklab, #000, transparent 40%)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              <span className="star" style={{ width: 10, height: 10, color: "var(--color-ochre)" }} /> Bharatpur · MMXXIV
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between mono text-[10px] uppercase tracking-[0.2em] text-white/90">
              <span>Pl. 01</span>
              <span>fig — solo practice</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <FadeUp key={s.label} className="border border-[var(--line)] rounded-md p-4">
                <div className="stat-num text-3xl sm:text-4xl">{s.num}</div>
                <div className="mt-2 mono text-[9px] tracking-[0.2em] uppercase opacity-70">{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="col-span-12 md:col-span-7 lg:col-span-7 lg:col-start-6">
          <FadeUp>
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}>
              I'm <span className="font-italic" style={{ color: "var(--accent)" }}>Aljesh Raut</span> — currently completing a B.Sc. in Computer Science at <span className="font-italic">Tribhuvan University</span>, and running an independent software practice from Bharatpur, Nepal.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="mt-8 max-w-2xl text-[15px] sm:text-base leading-[1.6] text-[var(--fg-soft)]">
              I work alone, on purpose. The products that shaped my taste — the editor I write in, the database my apps depend on, the deployment platform I ship to — were each, for a long time, the work of one or two people who could hold the whole machine in their head. I'm trying to do work in that lineage.
            </p>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mt-6 max-w-2xl text-[15px] sm:text-base leading-[1.6] text-[var(--fg-soft)]">
              Most of my recent work runs on <span className="text-[var(--fg)]">Cloudflare</span> — Pages, Workers, D1, R2, KV — because deploying to the edge in 2026 is no longer a flex; it's just hygiene. I pair that with React, TypeScript, and a quiet obsession with motion design.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
              {[
                ["Lives in", "Bharatpur, NP"],
                ["Reads in", "EN · NE · HI"],
                ["Ships from", "UTC+5:45"],
                ["Stack", "TS · React · CF"],
                ["Practice", "Solo, since 2022"],
                ["Status", "Open · Apr→Jun"],
              ].map(([k, v]) => (
                <div key={k} className="border border-[var(--line)] rounded-md p-3">
                  <div className="mono text-[9px] tracking-[0.2em] uppercase opacity-60">{k}</div>
                  <div className="mt-1 text-sm">{v}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
