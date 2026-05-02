import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WORK } from "../lib/data";
import { Mask } from "../components/Reveal";
import { ArrowUpRight } from "lucide-react";

const COVERS = [
  // Editorial poster-style abstract gradients (no images required) — each is a visual ID for the case study.
  {
    bg: "linear-gradient(135deg, #7A1F2B 0%, #14110E 60%, #C8A85C 100%)",
    label: "ANIS / FOLIO",
    grid: true,
  },
  {
    bg: "linear-gradient(160deg, #14110E 0%, #2A241D 50%, #B8542B 100%)",
    label: "ATLANTIC / SEAFOOD",
    grid: false,
  },
  {
    bg: "linear-gradient(135deg, #1F1B16 0%, #7A1F2B 60%, #EDE7DD 100%)",
    label: "ATHLETE / LAND",
    grid: true,
  },
  {
    bg: "radial-gradient(60% 80% at 30% 70%, #C8A85C 0%, #7A1F2B 50%, #14110E 100%)",
    label: "NEPALI / CHULO",
    grid: false,
  },
];

export default function Work() {
  return (
    <section id="work" className="relative px-4 sm:px-8 lg:px-12 py-24 sm:py-32 lg:py-40">
      <div className="grid grid-cols-12 gap-6 mb-16">
        <div className="col-span-12 md:col-span-3">
          <span className="sec-num">⌗ 03 — Selected</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display text-[12vw] sm:text-[9vw] md:text-[7vw] lg:text-[6.4vw] leading-[0.92]">
            <Mask>
              <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Recent</span>
            </Mask>{" "}
            <Mask delay={0.08}>
              <span className="font-italic" style={{ color: "var(--accent)" }}>commissions.</span>
            </Mask>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-20 lg:gap-y-28">
        {WORK.map((w, i) => (
          <WorkCard key={w.num} item={w} cover={COVERS[i % COVERS.length]} index={i} />
        ))}
      </div>
    </section>
  );
}

function WorkCard({ item, cover, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);

  return (
    <motion.article
      ref={ref}
      className={`group relative ${index % 2 === 1 ? "md:mt-24" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/5] sm:aspect-[5/6] overflow-hidden rounded-md border border-[var(--line)]" data-cursor="hover">
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: cover.bg }} />
          {cover.grid && (
            <div
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
          )}
          {/* radial spotlight */}
          <div
            className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-100 opacity-60"
            style={{
              background: "radial-gradient(40% 50% at 50% 50%, rgba(255,255,255,0.18), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-display text-[8vw] sm:text-[5vw] md:text-[3.6vw] text-white/90 text-center px-6 leading-[0.95]" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>
              {cover.label}
            </span>
          </div>
        </motion.div>

        <div className="absolute top-3 left-3 flex items-center gap-2 mono text-[10px] uppercase tracking-[0.2em] text-white/85">
          <span className="px-2 py-1 rounded-full border border-white/40 backdrop-blur">/{item.num}</span>
          <span className="px-2 py-1 rounded-full border border-white/40 backdrop-blur">{item.year}</span>
        </div>

        <motion.div
          className="absolute bottom-3 right-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black"
          whileHover={{ scale: 1.08, rotate: 45 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ArrowUpRight size={18} />
        </motion.div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl">{item.client}</h3>
          <p className="mono text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">{item.type}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.stack.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      </div>
      <p className="mt-4 max-w-lg text-[14px] leading-[1.55] text-[var(--fg-soft)]">{item.summary}</p>
    </motion.article>
  );
}
