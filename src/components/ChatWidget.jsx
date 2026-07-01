import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ArrowUp, ArrowRight, Check } from "lucide-react";

const GREETING =
  "Hello — I'm Aljesh's studio assistant. Ask about his work, services, or how to start a project.";

const SUGGESTIONS = [
  "What can Aljesh build?",
  "How does a project start?",
  "What does it cost?",
];

const LEAD_TOKEN = "[[SHOW_LEAD_FORM]]";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: GREETING, local: true }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showLead, setShowLead] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  const rm = useReducedMotion();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, showLead, leadSent, error]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 260);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text) {
    const clean = (text || "").trim();
    if (!clean || busy) return;
    setError("");
    setInput("");

    const next = [...messages, { role: "user", text: clean }];
    setMessages([...next, { role: "assistant", text: "" }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => !m.local).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      if (res.status === 429) throw new Error("You're going a little fast — give it a few seconds and try again.");
      if (!res.ok || !res.body) throw new Error("Couldn't reach the assistant. Please try again in a moment.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const display = acc.replace(LEAD_TOKEN, "").trimEnd();
        setMessages((cur) => {
          const copy = cur.slice();
          copy[copy.length - 1] = { role: "assistant", text: display };
          return copy;
        });
      }

      if (acc.includes(LEAD_TOKEN)) {
        setLeadSent(false);
        setShowLead(true);
      }
    } catch (e) {
      setMessages((cur) => cur.slice(0, -1));
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const noUserYet = messages.filter((m) => m.role === "user").length === 0;
  const spring = rm ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 24 };

  return (
    <>
      {/* ---------- Launcher ---------- */}
      <div className="fixed bottom-5 right-5 z-[110] flex items-center gap-3">
        <AnimatePresence>
          {!open && (
            <motion.span
              key="hint"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="mono hidden select-none sm:block"
              style={{
                fontSize: "0.62rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--fg-soft)",
                background: "color-mix(in oklab, var(--bg-2), transparent 15%)",
                border: "1px solid var(--line)",
                borderRadius: 999,
                padding: "0.4rem 0.7rem",
                backdropFilter: "blur(8px)",
              }}
            >
              Ask Aljesh
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          aria-label={open ? "Close chat" : "Ask Aljesh — open chat"}
          onClick={() => setOpen((v) => !v)}
          className="relative grid h-14 w-14 place-items-center rounded-full"
          style={{
            background: "var(--fg)",
            color: "var(--bg)",
            border: "1px solid var(--line-strong)",
            boxShadow: "0 12px 34px color-mix(in oklab, var(--fg), transparent 78%)",
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.93 }}
        >
          {!rm && !open && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ border: "1.5px solid var(--accent)" }}
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} strokeWidth={1.75} />
              </motion.span>
            ) : (
              <motion.span key="star" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.2 }}>
                <span className="star" style={{ width: 24, height: 24, color: "var(--bg)", display: "block" }} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ---------- Panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Aljesh's studio assistant"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={spring}
            style={{
              transformOrigin: "bottom right",
              height: "min(620px, calc(100vh - 7.5rem))",
              background: "var(--bg-2)",
              border: "1px solid var(--line-strong)",
              borderTop: "3px solid var(--accent)",
              boxShadow: "0 30px 70px color-mix(in oklab, var(--fg), transparent 74%)",
            }}
            className="fixed bottom-24 right-5 z-[110] flex w-[calc(100vw-2.5rem)] max-w-[392px] flex-col overflow-hidden rounded-[18px]"
          >
            {/* Header — the signature nameplate */}
            <div className="flex items-center gap-3 px-4 pb-3 pt-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full"
                style={{ border: "1px solid var(--line-strong)", background: "var(--bg-3)" }}
              >
                <span className="star" style={{ width: 20, height: 20, color: "var(--accent)", display: "block" }} />
              </span>
              <div className="min-w-0 leading-tight">
                <div className="font-display" style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                  Ask Aljesh
                </div>
                <div className="mono flex items-center gap-1.5" style={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fog)" }}>
                  <motion.span
                    className="inline-block rounded-full"
                    style={{ width: 6, height: 6, background: "var(--accent)" }}
                    animate={rm ? {} : { opacity: [1, 0.35, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  Online · replies in seconds
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="ml-auto grid h-8 w-8 place-items-center rounded-full opacity-55 transition-opacity hover:opacity-100" style={{ color: "var(--fg)" }}>
                <X size={17} strokeWidth={1.75} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
              {messages.map((m, i) => {
                const streaming = busy && i === messages.length - 1 && m.role === "assistant";
                return <Bubble key={i} role={m.role} text={m.text} streaming={streaming} rm={rm} />;
              })}
              {busy && messages[messages.length - 1]?.text === "" && <TypingDots rm={rm} />}

              {noUserYet && !busy && (
                <motion.div
                  className="pt-1"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
                >
                  <motion.div
                    variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                    className="mono pb-1.5"
                    style={{ fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fog)" }}
                  >
                    Try asking
                  </motion.div>
                  <div style={{ borderTop: "1px solid var(--line)" }}>
                    {SUGGESTIONS.map((s) => (
                      <motion.button
                        key={s}
                        variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                        onClick={() => send(s)}
                        className="group flex w-full items-center justify-between gap-3 py-2.5 text-left"
                        style={{ borderBottom: "1px solid var(--line)", color: "var(--fg)" }}
                      >
                        <span style={{ fontSize: "0.88rem" }}>{s}</span>
                        <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--accent)" }} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {showLead && <LeadForm sent={leadSent} onSent={() => setLeadSent(true)} onError={(msg) => setError(msg)} rm={rm} />}

              {error && (
                <div className="mono" style={{ fontSize: "0.72rem", lineHeight: 1.5, color: "var(--accent)" }}>
                  {error}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2 px-3 pb-2.5 pt-2.5"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <div className="flex flex-1 items-end rounded-2xl" style={{ background: "var(--bg-3)", border: "1px solid var(--line)" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 800))}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                  rows={1}
                  placeholder="Ask a question…"
                  className="max-h-28 flex-1 resize-none bg-transparent px-3 py-2.5 outline-none"
                  style={{ color: "var(--fg)", fontSize: "0.9rem" }}
                />
              </div>
              <motion.button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                whileTap={{ scale: 0.9 }}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-35"
                style={{ background: input.trim() && !busy ? "var(--accent)" : "var(--fg)", color: "var(--bg)" }}
              >
                <ArrowUp size={18} strokeWidth={2} />
              </motion.button>
            </form>
            <div className="mono pb-2 text-center" style={{ fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fog)" }}>
              AI assistant · answers may be imperfect
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, text, streaming, rm }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: rm ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={rm ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 26 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className="max-w-[86%] whitespace-pre-wrap"
        style={{
          fontSize: "0.9rem",
          lineHeight: 1.55,
          padding: isUser ? "0.6rem 0.85rem" : "0.7rem 0.9rem",
          borderRadius: isUser ? "16px 16px 5px 16px" : "16px 16px 16px 5px",
          background: isUser ? "var(--fg)" : "var(--bg-3)",
          color: isUser ? "var(--bg)" : "var(--fg)",
          border: isUser ? "none" : "1px solid var(--line)",
        }}
      >
        {text}
        {streaming && (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block align-[-1px]"
            style={{ width: 7, height: 14, background: "var(--accent)", borderRadius: 1 }}
            animate={{ opacity: [1, 0.15, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

function TypingDots({ rm }) {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1.5 rounded-2xl px-4 py-3.5" style={{ background: "var(--bg-3)", border: "1px solid var(--line)", borderRadius: "16px 16px 16px 5px" }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: "var(--fog)" }}
            animate={rm ? {} : { opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function LeadForm({ sent, onSent, onError, rm }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState("");

  const wrap = {
    initial: { opacity: 0, y: rm ? 0 : 10 },
    animate: { opacity: 1, y: 0 },
    transition: rm ? { duration: 0.15 } : { type: "spring", stiffness: 240, damping: 24 },
  };

  if (sent) {
    return (
      <motion.div {...wrap} className="rounded-2xl px-4 py-4" style={{ background: "var(--bg-3)", border: "1px solid var(--line)", borderLeft: "3px solid var(--accent)" }}>
        <div className="flex items-center gap-2" style={{ color: "var(--accent)" }}>
          <Check size={17} strokeWidth={2} />
          <span className="font-display" style={{ fontSize: "1.05rem" }}>Got it — thank you.</span>
        </div>
        <p className="pt-1" style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--fg-soft)" }}>
          Aljesh will reach out shortly. For anything urgent, WhatsApp +977 9819963606.
        </p>
      </motion.div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    if (!form.name.trim() || !form.email.trim()) return onError("Please add your name and email.");
    setSending(true);
    onError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) onSent();
      else onError("Couldn't send that — please email rautaljesh@gmail.com directly.");
    } catch {
      onError("Couldn't send that — please email rautaljesh@gmail.com directly.");
    } finally {
      setSending(false);
    }
  }

  const field = (name) => ({
    background: "var(--bg-2)",
    border: `1px solid ${focused === name ? "var(--accent)" : "var(--line)"}`,
    color: "var(--fg)",
    borderRadius: "10px",
    padding: "0.6rem 0.75rem",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
    transition: "border-color 200ms ease",
  });

  return (
    <motion.form {...wrap} onSubmit={submit} className="space-y-2.5 rounded-2xl px-4 py-4" style={{ background: "var(--bg-3)", border: "1px solid var(--line)", borderLeft: "3px solid var(--accent)" }}>
      <div className="font-display" style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}>Leave your details</div>
      <p className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fog)" }}>
        Aljesh replies within hours
      </p>
      {["name", "email", "phone"].map((n) => (
        <input
          key={n}
          aria-label={n === "phone" ? "Phone (optional)" : n[0].toUpperCase() + n.slice(1)}
          type={n === "email" ? "email" : "text"}
          placeholder={n === "phone" ? "Phone (optional)" : n[0].toUpperCase() + n.slice(1)}
          style={field(n)}
          value={form[n]}
          onFocus={() => setFocused(n)}
          onBlur={() => setFocused("")}
          onChange={(e) => setForm({ ...form, [n]: e.target.value })}
        />
      ))}
      <textarea
        aria-label="Message (optional)"
        placeholder="What do you need? (optional)"
        rows={2}
        style={{ ...field("message"), resize: "none" }}
        value={form.message}
        onFocus={() => setFocused("message")}
        onBlur={() => setFocused("")}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />
      {/* Honeypot — hidden from users, catches bots */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      <button type="submit" disabled={sending} className="btn-magnet w-full" style={{ padding: "0.75rem 1rem", fontSize: "0.68rem" }}>
        <span className="label">{sending ? "Sending…" : "Send to Aljesh"}</span>
      </button>
    </motion.form>
  );
}
