import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV, PROFILE } from "../lib/data";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className="mx-auto flex items-center justify-between gap-4 px-4 sm:px-8 lg:px-12 py-4 transition-all duration-500"
          style={{
            backdropFilter: scrolled ? "blur(14px)" : "blur(0px)",
            background: scrolled ? "color-mix(in oklab, var(--bg), transparent 28%)" : "transparent",
            borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
          }}
        >
          <a href="#hero" className="group flex items-center gap-4" data-cursor="hover">
            <span
              className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[var(--line-strong)] mono text-[13px] tracking-[0.16em]"
              style={{ background: "var(--bg-2)" }}
            >
              <span className="spin-slow absolute inset-0 grid place-items-center">
                <span className="star" style={{ width: 22, height: 22, color: "var(--accent)" }} />
              </span>
              <span className="relative font-semibold">{PROFILE.initials}</span>
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span
                className="font-display text-[20px]"
                style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 1' }}
              >
                Aljesh Raut
              </span>
              <span className="mono text-[9px] tracking-[0.22em] uppercase opacity-70">
                Software Atelier · Local → Global
              </span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.slice(1, -1).map((n) => (
              <a key={n.to} href={n.to} className="group relative mono text-[11px] uppercase tracking-[0.2em]" data-cursor="hover">
                <span className="opacity-50 mr-1">/{n.num}</span>
                <span className="link-underline">{n.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="hidden sm:inline-flex h-9 items-center rounded-full px-4 mono text-[10px] uppercase tracking-[0.18em]"
              style={{ background: "var(--fg)", color: "var(--bg)" }}
              data-cursor="hover"
            >
              Commission →
            </a>
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)]"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <span className="block h-px w-4 bg-current relative before:absolute before:left-0 before:-top-1.5 before:h-px before:w-4 before:bg-current after:absolute after:left-0 after:top-1.5 after:h-px after:w-4 after:bg-current"></span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.87, 0, 0.13, 1] }}
            className="fixed inset-0 z-[60] flex flex-col"
            style={{ background: "var(--bg)" }}
          >
            <div className="flex items-center justify-between p-4 sm:p-8 hairline" style={{ borderBottomWidth: 1 }}>
              <span className="mono text-[10px] uppercase tracking-[0.2em] opacity-70">Index</span>
              <button onClick={() => setOpen(false)} className="mono text-[11px] uppercase tracking-[0.2em]">
                Close ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto px-4 sm:px-8 py-12">
              <ul className="space-y-2">
                {NAV.map((n, i) => (
                  <motion.li
                    key={n.to}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-[var(--line)] py-3"
                  >
                    <a href={n.to} onClick={() => setOpen(false)} className="flex items-baseline justify-between">
                      <span className="font-display text-5xl sm:text-6xl">{n.label}</span>
                      <span className="mono text-[10px] uppercase tracking-[0.2em] opacity-60">/{n.num}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-12 flex flex-col gap-3">
                <a href={`mailto:${PROFILE.email}`} className="mono text-xs uppercase tracking-[0.2em] opacity-80">
                  ✉ {PROFILE.email}
                </a>
                <a href={`https://wa.me/${PROFILE.whatsapp}`} className="mono text-xs uppercase tracking-[0.2em] opacity-80">
                  ⌖ WhatsApp · +977 {PROFILE.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
