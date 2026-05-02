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
                alt="Aljesh Raut, photographed in Kathmandu"
                className="h-full w-full object-cover duotone"
                loading="lazy"
              />
              <div className="absolute inset-0" style={{
                background: "linear-gradient(to top, color-mix(in oklab, var(--bg), transparent 30%) 0%, transparent 35%)"
              }} />
            </motion.div>
            <div className="absolute top-3 left-3 chip" style={{ background: "color-mix(in oklab, #000, transparent 40%)", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              <span className="star" style={{ width: 10, height: 10, color: "var(--color-ochre)" }} /> Kathmandu · MMXXVI
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between mono text-[10px] uppercase tracking-[0.2em] text-white/90">
              <span>Pl. 01</span>
              <span>fig — freelance & team</span>
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
            <p
              className="font-display text-[clamp(1.65rem,3.6vw,3rem)] leading-[1.08] tracking-[-0.025em]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
            >
              I'm{" "}
              <span
                className="font-italic"
                style={{
                  color: "var(--accent)",
                  fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1',
                }}
              >
                Aljesh Raut
              </span>{" "}
              — a{" "}
              <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>
                full-stack developer
              </span>{" "}
              <span className="opacity-60">&amp;</span>{" "}
              <span className="font-italic">digital craftsman</span> from{" "}
              <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>
                Kathmandu, Nepal
              </span>
              . I ship{" "}
              <span className="font-italic" style={{ color: "var(--accent)" }}>
                production web products
              </span>{" "}
              for founders and growing teams —{" "}
              <span className="opacity-70">locally and globally.</span>
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <p className="mt-8 max-w-2xl text-[15px] sm:text-base leading-[1.65] text-[var(--fg-soft)] body-justify">
              I freelance independently <span className="text-[var(--fg)]">and</span> as part of <a href="https://bitmicrosys.com" target="_blank" rel="noopener noreferrer" className="text-[var(--fg)] link-underline">Bitmicrosys LLC</a> — taking on engineering, SEO, AEO, GEO and technical-blog work for international clients. SEO, AEO, GEO and content writing are my own craft; I'm the person doing the keyword research, the schema markup and the long-form pieces, not handing it off. You can read the live output at <a href="https://1kreach.com" target="_blank" rel="noopener noreferrer" className="text-[var(--fg)] link-underline">1kReach.com</a> — original blogs, primarily SEO-driven, published on the open web.
            </p>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mt-6 max-w-2xl text-[15px] sm:text-base leading-[1.65] text-[var(--fg-soft)] body-justify">
              I started freelancing in <span className="text-[var(--fg)]">2026</span> — only a few months in, but the shipping list isn't short. <span className="text-[var(--fg)]">12+ projects deployed and live</span>: cafe, bar and restaurant sites, premium gym, heritage dining, skincare brand, salon booking, plus the content/SEO work at 1kReach. I move fast, learn faster, and finish what I start.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-6 max-w-2xl text-[15px] sm:text-base leading-[1.65] text-[var(--fg-soft)] body-justify">
              I'm equally comfortable <span className="text-[var(--fg)]">leading a project end-to-end</span> as I am <span className="text-[var(--fg)]">embedding into your team</span> as the dev who actually ships. The studio work runs that way — async, accountable, weekly demos. I'm not a lone-wolf; I just believe a small accountable team beats a big committee, every time.
            </p>
          </FadeUp>

          <FadeUp delay={0.26}>
            <p className="mt-6 max-w-2xl text-[15px] sm:text-base leading-[1.65] text-[var(--fg-soft)] body-justify">
              Stack is <span className="text-[var(--fg)]">React, TypeScript, Cloudflare</span> (Pages, Workers, D1, R2, KV) — paired with motion design that earns its keep, and SEO baked in from the first commit, not bolted on later. If you want a developer who treats <span className="font-italic">discoverability</span> and <span className="font-italic">performance</span> as part of the build — not a phase 2 — we'll get along.
          </p>
          </FadeUp>

          <FadeUp delay={0.32}>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
              {[
                ["Lives in", "Kathmandu, NP"],
                ["Studies", "BCA · TU"],
                ["Freelances at", "Bitmicrosys LLC"],
                ["Writes at", "1kReach.com"],
                ["Reads in", "EN · NE · HI"],
                ["Ships from", "UTC+5:45"],
                ["Stack", "TS · React · CF"],
                ["Started", "2026"],
                ["Status", "Open · 24/7"],
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
