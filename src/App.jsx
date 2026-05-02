import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Marquee from "./sections/Marquee";
import Services from "./sections/Services";
import Manifesto from "./sections/Manifesto";
import Process from "./sections/Process";
import Work from "./sections/Work";
import About from "./sections/About";
import Faq from "./sections/Faq";
import Contact from "./sections/Contact";

function Loader({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[120] grid place-items-center"
          style={{ background: "var(--bg)" }}
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.0, ease: [0.87, 0, 0.13, 1] }}
        >
          <div className="text-center">
            <motion.div
              className="grid place-items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="spin-slow inline-grid place-items-center h-20 w-20 rounded-full border"
                style={{ borderColor: "var(--line-strong)" }}
              >
                <span
                  className="star"
                  style={{
                    width: 44,
                    height: 44,
                    color: "var(--accent)",
                    filter: "drop-shadow(0 0 10px color-mix(in oklab, var(--accent), transparent 55%))",
                  }}
                />
              </span>
            </motion.div>
            <motion.div
              className="mono text-[10px] uppercase tracking-[0.3em] opacity-70 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              setting the table…
            </motion.div>
            <motion.div
              className="relative mx-auto mt-6 h-px w-40 overflow-hidden"
              style={{ background: "var(--line)" }}
            >
              <motion.span
                className="absolute inset-y-0 left-0 w-full"
                style={{ background: "var(--accent)", originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const minHold = new Promise((r) => setTimeout(r, 1400));
    const ready = new Promise((r) => {
      if (document.readyState === "complete") return r();
      window.addEventListener("load", r, { once: true });
    });
    const safety = new Promise((r) => setTimeout(r, 3500));
    Promise.race([Promise.all([minHold, ready]), safety]).then(() => setDone(true));
  }, []);

  return (
    <div className="grain relative">
      <Loader done={done} />
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Manifesto />
        <Process />
        <Work />
        <About />
        <Faq />
        <Contact />
      </main>
    </div>
  );
}
