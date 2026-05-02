import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.querySelector("meta[name='theme-color']")?.setAttribute("content", dark ? "#0B0908" : "#EDE7DD");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
      className="relative inline-flex h-9 items-center gap-2 rounded-full border border-[var(--line-strong)] px-3 mono text-[10px] tracking-[0.18em] uppercase"
    >
      <motion.span
        layout
        className="relative h-4 w-8 rounded-full"
        style={{ background: "var(--line-strong)" }}
      >
        <motion.span
          layout
          className="absolute top-0.5 h-3 w-3 rounded-full"
          style={{ background: "var(--fg)", left: dark ? "calc(100% - 14px)" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.span>
      <span className="hidden sm:inline">{dark ? "Nocturne" : "Diurne"}</span>
    </button>
  );
}
