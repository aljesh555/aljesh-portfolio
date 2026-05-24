import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SERVICES } from "../lib/data";
import { Mask, FadeUp } from "../components/Reveal";
import { ArrowUpRight } from "lucide-react";

export default function Services() {
  return (
    <section id="services" className="relative px-4 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40">
      <div className="grid grid-cols-12 gap-6 mb-16 sm:mb-24">
        <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
          <span className="sec-num">⌗ 01 — The Practice</span>
          <span className="mono text-[10px] tracking-[0.18em] uppercase opacity-60">Seven disciplines</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display text-[12vw] sm:text-[10vw] md:text-[7vw] lg:text-[6.4vw] leading-[0.92]">
            <Mask delay={0}>
              <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>I build the things</span>
            </Mask>
            <br />
            <Mask delay={0.08}>
              <span className="font-italic" style={{ color: "var(--accent)" }}>businesses run on.</span>
            </Mask>
          </h2>
          <FadeUp delay={0.12} className="max-w-2xl mt-8 text-[15px] sm:text-base leading-[1.55] text-[var(--fg-soft)]">
            I take on most kinds of web work. These are the seven I do most often.
          </FadeUp>
        </div>
      </div>

      <div role="list">
        {SERVICES.map((s, i) => (
          <ServiceRow key={s.num} service={s} index={i} />
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
        <p className="mono text-[11px] uppercase tracking-[0.2em] opacity-70">
          + Anything else worth solving — ask.
        </p>
        <a href="#contact" className="mono text-[11px] uppercase tracking-[0.2em] inline-flex items-center gap-2 link-underline">
          Outline a brief <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}

function ServiceRow({ service, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <motion.div
      ref={ref}
      className="service-row group"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="reveal" />
      <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center py-6 sm:py-8 lg:py-10 px-1 sm:px-2">
        <div className="col-span-2 md:col-span-1 col mono text-[11px] tracking-[0.2em] opacity-70">
          /{service.num}
        </div>
        <div className="col-span-10 md:col-span-5 col">
          <div className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[0.95]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}>
            {service.title}
          </div>
          <div className="mt-2 mono text-[10px] uppercase tracking-[0.2em] opacity-60">{service.tag}</div>
        </div>
        <motion.div style={{ x }} className="hidden md:block md:col-span-5 col text-[14px] leading-[1.55] text-[var(--fg-soft)] group-hover:text-[color:var(--bg)]">
          <p className="max-w-md">{service.summary}</p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 mono text-[10px] uppercase tracking-[0.18em] opacity-80">
            {service.deliverables.map((d) => (
              <li key={d} className="before:content-['·'] before:mr-2 first:before:hidden">{d}</li>
            ))}
          </ul>
        </motion.div>
        <div className="col-span-12 md:hidden col text-[14px] leading-[1.55] text-[var(--fg-soft)]">
          {service.summary}
        </div>
        <div className="col-span-12 md:col-span-1 col flex md:justify-end">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
