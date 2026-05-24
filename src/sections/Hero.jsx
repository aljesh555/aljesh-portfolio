import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Magnetic from "../components/Magnetic";
import { FadeUp } from "../components/Reveal";

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col"
    >
      {/* Aurora background */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="aurora" />
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--bg))",
          }}
        />
      </motion.div>

      {/* TOP META STRIP */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3 mono text-[10px] uppercase tracking-[0.22em] opacity-75">
          <span>00 — Index</span>
          <span className="hidden sm:inline">Kathmandu · UTC+5:45</span>
          <span className="flex items-center gap-2">
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--accent)" }}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: "var(--accent)" }}
              />
            </span>
            Open for commissions
          </span>
        </div>
      </div>

      {/* MAIN — centered horizontally + vertically */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        {/* BIO */}
        <FadeUp delay={0.28} className="max-w-2xl mx-auto">
          <p className="text-[15px] sm:text-base lg:text-[17px] leading-[1.7] text-[var(--fg-soft)]">
            <span className="text-[var(--fg)]">Anis Raut</span>{" "}
            <span className="opacity-55">(Aljesh)</span> — independent
            software craftsman from Kathmandu. I design and build{" "}
            <span className="text-[var(--fg)]">
              SaaS platforms, business dashboards, e-commerce and APIs
            </span>{" "}
            for founders and small teams. Contracting at{" "}
            <a
              href="https://bitmicrosys.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg)] link-underline"
            >
              Bitmicrosys LLC
            </a>
            ; writing at{" "}
            <a
              href="https://1kreach.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--fg)] link-underline"
            >
              1kReach.com
            </a>
            .
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={0.4} className="mt-5 sm:mt-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Magnetic strength={0.25}>
              <a href="#contact" className="btn-magnet" data-cursor="hover">
                <span className="label">
                  Commission a build <span aria-hidden>→</span>
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a href="#work" className="btn-magnet ghost" data-cursor="hover">
                <span className="label">See selected work</span>
              </a>
            </Magnetic>
          </div>
        </FadeUp>
      </div>

      {/* BOTTOM COLOPHON */}
      <FadeUp delay={0.55}>
        <div className="relative z-10 px-4 sm:px-8 lg:px-12 pb-8 sm:pb-10">
          <div className="border-t border-[var(--line)] pt-4 sm:pt-5">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 mono text-[10px] uppercase tracking-[0.18em] text-center md:text-left">
              <Fact term="Shipped" value="12+ projects live" />
              <Fact term="Practising" value="Since MMXXVI" />
              <Fact term="Reading" value="BCA · Tribhuvan Univ." />
              <Fact term="Response" value="Within hours" />
            </dl>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}

function Fact({ term, value }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="opacity-50">{term}</dt>
      <dd className="text-[var(--fg)] normal-case tracking-normal font-italic text-[13px] sm:text-[14px]">
        {value}
      </dd>
    </div>
  );
}
