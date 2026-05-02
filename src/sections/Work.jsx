import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { WORK } from "../lib/data";
import { Mask } from "../components/Reveal";
import { ArrowUpRight } from "lucide-react";

const COVERS = [
  { bg: "linear-gradient(135deg, #7A1F2B 0%, #14110E 60%, #C8A85C 100%)", label: "NORTHFIELD / CAFE", grid: true },
  { bg: "linear-gradient(160deg, #14110E 0%, #2A241D 50%, #B8542B 100%)", label: "ATLANTIC / SEAFOOD", grid: false },
  { bg: "linear-gradient(135deg, #1F1B16 0%, #7A1F2B 60%, #EDE7DD 100%)", label: "ROADHOUSE / CAFE", grid: true },
  { bg: "radial-gradient(60% 80% at 30% 70%, #C8A85C 0%, #7A1F2B 50%, #14110E 100%)", label: "NEPALI / CHULO", grid: false },
  { bg: "linear-gradient(135deg, #14110E 0%, #5A1620 45%, #C8A85C 100%)", label: "ATHLETE / LAND", grid: true },
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
              <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Live</span>
            </Mask>{" "}
            <Mask delay={0.08}>
              <span className="font-italic" style={{ color: "var(--accent)" }}>commissions.</span>
            </Mask>
          </h2>
          <p className="mt-4 max-w-xl text-[14px] leading-[1.55] text-[var(--fg-soft)]">
            Each card opens the deployed site in a new tab. A short selection from {WORK.length}+ shipped products.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-7">
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
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.04]);

  const hasImage = Boolean(item.image);

  return (
    <motion.article
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${item.client} in a new tab`}
        className="block"
        data-cursor="hover"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-[var(--line)]">
          <motion.div style={{ scale }} className="absolute inset-0">
            {hasImage ? (
              <img
                src={item.image}
                alt={`${item.client} — ${item.type}`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0" style={{ background: cover.bg }} />
            )}
            {!hasImage && cover.grid && (
              <div
                className="absolute inset-0 opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            )}
            <div
              className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-100 opacity-60"
              style={{
                background: hasImage
                  ? "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05) 60%, transparent)"
                  : "radial-gradient(40% 50% at 50% 50%, rgba(255,255,255,0.18), transparent 70%)",
              }}
            />
            {!hasImage && (
              <div className="absolute inset-0 grid place-items-center">
                <span
                  className="font-display text-[5vw] sm:text-[2.4vw] lg:text-[1.6vw] xl:text-[1.3vw] text-white/90 text-center px-4 leading-[1]"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}
                >
                  {cover.label}
                </span>
              </div>
            )}
          </motion.div>

          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 mono text-[9px] uppercase tracking-[0.18em] text-white/85">
            <span className="px-1.5 py-0.5 rounded-full border border-white/40 backdrop-blur">/{item.num}</span>
            <span className="px-1.5 py-0.5 rounded-full border border-white/40 backdrop-blur">{item.year}</span>
            <span className="px-1.5 py-0.5 rounded-full border border-white/40 backdrop-blur" style={{ background: "color-mix(in oklab, var(--accent), transparent 30%)" }}>Live</span>
          </div>

          <motion.div
            className="absolute bottom-2.5 right-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-black"
            whileHover={{ scale: 1.08, rotate: 45 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            aria-hidden
          >
            <ArrowUpRight size={14} />
          </motion.div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg sm:text-xl link-underline truncate">{item.client}</h3>
            <p className="mono text-[9px] uppercase tracking-[0.18em] opacity-60 mt-0.5">{item.type}</p>
          </div>
          <span className="mono text-[9px] uppercase tracking-[0.18em] opacity-60 shrink-0 inline-flex items-center gap-1">
            Visit <ArrowUpRight size={10} />
          </span>
        </div>
        <p className="mt-2 text-[12.5px] leading-[1.5] text-[var(--fg-soft)] line-clamp-2">{item.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.stack.slice(0, 3).map((s) => (
            <span key={s} className="chip" style={{ fontSize: "0.6rem", padding: "0.2rem 0.55rem" }}>{s}</span>
          ))}
        </div>
      </a>
    </motion.article>
  );
}
