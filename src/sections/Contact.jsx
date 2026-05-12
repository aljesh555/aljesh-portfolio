import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Magnetic from "../components/Magnetic";

import { PROFILE } from "../lib/data";
import { Mail, MessageCircle, CalendarClock, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-15%", "10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);

  const timeRef = useRef(null);
  useEffect(() => {
    const tick = () => {
      if (!timeRef.current) return;
      const t = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kathmandu" });
      timeRef.current.textContent = t;
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative overflow-hidden border-t border-[var(--line)]"
      style={{ background: "var(--fg)", color: "var(--bg)" }}
    >
      <div className="py-12 sm:py-16 lg:py-20">
        <motion.div
          style={{ x: x1 }}
          className="font-display text-[18vw] sm:text-[16vw] md:text-[14vw] leading-[0.9] whitespace-nowrap"
        >
          <span style={{ fontVariationSettings: '"opsz" 144, "SOFT" 60, "WONK" 1' }}>Have a brief?</span>
        </motion.div>
        <motion.div
          style={{ x: x2 }}
          className="font-display text-[18vw] sm:text-[16vw] md:text-[14vw] leading-[0.9] whitespace-nowrap font-italic"
        >
          Let's <span style={{ color: "var(--accent-2)" }}>begin →</span>
        </motion.div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
        {/* Status strip */}
        <div className="grid grid-cols-12 gap-4 mb-10 mono text-[10px] uppercase tracking-[0.22em] opacity-80">
          <div className="col-span-6 md:col-span-3 flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent-2)" }}>
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: "var(--accent-2)" }} />
            </span>
            <span ref={timeRef}>—</span>
            <span className="opacity-60">· UTC+5:45</span>
          </div>
          <div className="col-span-6 md:col-span-3">
            <span className="opacity-60">From</span> Kathmandu, NP
          </div>
          <div className="hidden md:block md:col-span-3">
            <span className="opacity-60">Reply within</span> hours
          </div>
          <div className="hidden md:block md:col-span-3">
            <span className="opacity-60">Status</span> Open · 24/7
          </div>
        </div>

        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-5">
            <span className="mono text-[10px] uppercase tracking-[0.22em] opacity-70">⌗ 06 — Commission</span>
            <h3
              className="font-display text-4xl sm:text-5xl mt-3 leading-[1]"
              style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
            >
              Three <span className="font-italic">doors</span>.
              <br />
              Same room.
            </h3>
            <p className="mt-5 max-w-sm text-[14px] leading-[1.6] opacity-80">
              Pick the channel that matches your urgency. A short reply is guaranteed within 24 hours,
              usually within an hour during Kathmandu daytime.
            </p>
          </div>

          {/* Channels */}
          <div className="col-span-12 md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ChannelCard
              icon={<MessageCircle size={18} />}
              label="WhatsApp"
              sub="Fastest · daytime"
              value={`+977 ${PROFILE.phone}`}
              hint="Voice & text · async briefs"
              href={`https://wa.me/${PROFILE.whatsapp}`}
            />
            <ChannelCard
              icon={<Mail size={18} />}
              label="Email"
              sub="Briefs & files"
              value={PROFILE.email}
              hint="Detailed scopes · attachments"
              href={`mailto:${PROFILE.email}?subject=Project%20commission`}
            />
            <ChannelCard
              icon={<CalendarClock size={18} />}
              label="Book a Call"
              sub="30 min · WhatsApp video"
              value="Request a slot →"
              hint="Discovery · free · no pitch"
              href={`https://wa.me/${PROFILE.whatsapp}?text=${encodeURIComponent("Hi Anis, I'd like to book a 30-min discovery call.")}`}
              primary
            />
          </div>
        </div>

        {/* Engagement strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-white/10 pt-8">
          {[
            ["Discovery call", "Free · 30 min"],
            ["Proposal", "Within 48 hrs"],
            ["Payment split", "50 / 50 or milestones"],
            ["Handover", "Docs · runbook · keys"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-md p-4 border border-white/10">
              <div className="mono text-[9px] tracking-[0.22em] uppercase opacity-60">{k}</div>
              <div className="mt-1.5 text-sm">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 px-4 sm:px-8 lg:px-12 py-6 flex flex-wrap items-center justify-between gap-3 mono text-[10px] uppercase tracking-[0.22em] opacity-70">
        <span>© MMXXVI · Anis Raut (Aljesh) · Atelier of Code</span>
        <span className="flex items-center gap-2">
          <span className="star" style={{ width: 10, height: 10, color: "var(--accent-2)" }} />
          Crafted in Kathmandu · Edged from Cloudflare
        </span>
      </div>
    </section>
  );
}

function ChannelCard({ icon, label, sub, value, hint, href, primary }) {
  return (
    <Magnetic strength={0.12} className="block">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="group relative flex h-full flex-col justify-between gap-8 p-5 sm:p-6 rounded-md border overflow-hidden transition-colors duration-500"
        style={{
          borderColor: "rgba(237,231,221,0.18)",
          background: primary ? "var(--accent)" : "transparent",
          color: "inherit",
        }}
        data-cursor="hover"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30">
            {icon}
          </span>
          <ArrowUpRight
            size={16}
            className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.22em] opacity-70">{sub}</div>
          <div
            className="font-display text-3xl sm:text-4xl mt-1"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0' }}
          >
            {label}
          </div>
          <div className="mt-3 mono text-xs opacity-90 break-all">{value}</div>
          {hint && (
            <div className="mt-2 mono text-[9px] uppercase tracking-[0.22em] opacity-60">{hint}</div>
          )}
        </div>
      </a>
    </Magnetic>
  );
}
