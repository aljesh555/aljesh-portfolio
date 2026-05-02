import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, lazy, Suspense } from "react";
import Magnetic from "../components/Magnetic";
import { Mask } from "../components/Reveal";
import EdgeReadout from "../components/EdgeReadout";
import useEdgeVisitor from "../lib/useEdgeVisitor";
import { PROFILE } from "../lib/data";

const EdgeGlobe = lazy(() => import("../components/EdgeGlobe"));

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const { visitor, latency, source, loading } = useEdgeVisitor();

  return (
    <section ref={ref} id="hero" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Soft aurora wash behind everything */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none">
        <div className="aurora" />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--bg))",
          }}
        />
      </motion.div>

      {/* Top status strip */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28">
        <div className="flex flex-wrap items-center justify-between gap-3 mono text-[10px] uppercase tracking-[0.22em] opacity-80">
          <span>Independent Practice · Est. 2026</span>
          <span className="hidden sm:inline">{PROFILE.region}</span>
          <span className="flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }}>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--accent)" }} />
            </span>
            Open · 24 / 7
          </span>
        </div>
      </div>

      {/* Main split */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14 lg:pt-16 pb-12 lg:pb-20">
        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* LEFT: title + bio + ctas */}
          <motion.div style={{ y: titleY }} className="col-span-12 lg:col-span-6 flex flex-col">
            <h1 className="font-display text-[18vw] sm:text-[14vw] lg:text-[10.5vw] leading-[0.86]">
              <Mask delay={0.0}>
                <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Atelier</span>
              </Mask>
              <br />
              <span className="flex items-baseline gap-[0.18em] flex-wrap">
                <Mask delay={0.1}>
                  <span className="font-italic">of</span>
                </Mask>
                <Mask delay={0.18}>
                  <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0', color: "var(--accent)" }}>
                    Code
                  </span>
                </Mask>
              </span>
            </h1>

            <Mask delay={0.3} className="mt-6">
              <span className="mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] opacity-70">
                — a freelance practice · est. MMXXVI
              </span>
            </Mask>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-12 gap-6 max-w-3xl">
              <p className="sm:col-span-7 text-[15px] sm:text-base leading-[1.55] text-[var(--fg-soft)]">
                <span className="text-[var(--fg)]">Aljesh Raut</span> — full-stack developer from Kathmandu, building SaaS, dashboards, automation, e-commerce and bespoke web products for founders worldwide. Freelance practice <span className="text-[var(--fg)]">+</span> partner at <span className="text-[var(--fg)]">Bitmicrosys LLC (US)</span> for SEO, AEO, GEO and growth engineering. <span className="text-[var(--fg)]">Built locally · delivered globally</span> — engineered with intent, finished with care.
              </p>
              <div className="sm:col-span-5 flex flex-col gap-2 mono text-[10px] uppercase tracking-[0.2em] opacity-80">
                <span>Practising in</span>
                <span className="text-[var(--fg)]">SaaS · Dashboards · Automation</span>
                <span className="text-[var(--fg)]">Commerce · Apps · APIs</span>
                <span className="text-[var(--fg)]">SEO · AEO · GEO · Content</span>
                <span className="opacity-60 normal-case tracking-[0.18em]">Local → National → Global</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic strength={0.25}>
                <a href="#contact" className="btn-magnet" data-cursor="hover">
                  <span className="label">
                    Begin a Commission <span aria-hidden>→</span>
                  </span>
                </a>
              </Magnetic>
              <Magnetic strength={0.25}>
                <a href="#work" className="btn-magnet ghost" data-cursor="hover">
                  <span className="label">Selected Work</span>
                </a>
              </Magnetic>
            </div>
          </motion.div>

          {/* RIGHT: globe + readout */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-square max-h-[60vh] sm:max-h-[68vh] lg:max-h-[72vh] mx-auto"
            >
              {/* Hard circular clip — guaranteed no square frame, no outer glow. */}
              <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(circle at 50% 50%, #000 92%, rgba(0,0,0,0.7) 98%, transparent 100%)",
                  maskImage:
                    "radial-gradient(circle at 50% 50%, #000 92%, rgba(0,0,0,0.7) 98%, transparent 100%)",
                  isolation: "isolate",
                }}
              >
                <Suspense
                  fallback={
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "radial-gradient(60% 60% at 50% 45%, color-mix(in oklab, var(--accent), transparent 60%), transparent 70%)",
                        filter: "blur(20px)",
                      }}
                    />
                  }
                >
                  <EdgeGlobe visitor={visitor} />
                </Suspense>
              </div>

              {/* Editorial labels along the circle's visible top/bottom — sit outside the clip so they remain crisp */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 -translate-x-1/2 -top-3 mono text-[9px] tracking-[0.32em] uppercase opacity-55">
                  ⌗ Local Studio · Global Reach
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 mono text-[9px] tracking-[0.32em] uppercase opacity-55">
                  N·27.71° / E·85.32° — KTM
                </div>
              </div>
            </motion.div>

            <EdgeReadout visitor={visitor} latency={latency} source={source} loading={loading} />
          </div>
        </div>
      </div>

      {/* Continue indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-none absolute right-4 lg:right-8 bottom-6 z-10 flex items-center gap-3 mono text-[10px] tracking-[0.22em] uppercase opacity-80"
      >
        <span className="h-10 w-px bg-[var(--line-strong)] relative overflow-hidden">
          <motion.span
            className="absolute inset-0"
            style={{ background: "var(--accent)" }}
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
        Continue
      </motion.div>
    </section>
  );
}
