import { motion } from "framer-motion";

export function Mask({ children, delay = 0, duration = 1.0, className = "" }) {
  return (
    <span className={`mask-line ${className}`}>
      <motion.span
        initial={{ y: "105%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Stagger({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial="h"
      whileInView="s"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={{ h: { y: 24, opacity: 0 }, s: { y: 0, opacity: 1 } }}
    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export function FadeUp({ children, delay = 0, y = 28, duration = 0.9, className = "" }) {
  return (
    <motion.div
      initial={{ y, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
