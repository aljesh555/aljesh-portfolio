import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "../lib/data";
import { Mask } from "../components/Reveal";
import { Plus } from "lucide-react";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="relative px-4 sm:px-8 lg:px-12 py-24 sm:py-32 border-t border-[var(--line)]" style={{ background: "var(--bg-2)" }}>
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-3">
          <span className="sec-num">⌗ 05 — Notes</span>
        </div>
        <div className="col-span-12 md:col-span-9">
          <h2 className="font-display text-[10vw] sm:text-[7vw] md:text-[5.4vw] leading-[0.95]">
            <Mask><span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Things people ask,</span></Mask>
            <br />
            <Mask delay={0.08}><span className="font-italic">answered honestly.</span></Mask>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-start-4 md:col-span-9">
          <ul>
            {FAQS.map((f, i) => (
              <li key={f.q} className="border-t border-[var(--line)] last:border-b">
                <button
                  className="w-full flex items-center justify-between gap-6 py-5 sm:py-6 text-left"
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <span className="font-display text-2xl sm:text-3xl lg:text-4xl pr-4" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}>
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line-strong)] flex-shrink-0"
                  >
                    <Plus size={16} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className="pb-6 max-w-2xl text-[15px] leading-[1.6] text-[var(--fg-soft)]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
