import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Check } from "lucide-react";

const GREETING =
  "Hi — I'm Aljesh's assistant. Ask me about his work, services, how he runs a project, or how to get in touch.";

const SUGGESTIONS = ["What does Aljesh build?", "How do we start a project?", "What does it cost?"];

const LEAD_TOKEN = "[[SHOW_LEAD_FORM]]";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: GREETING, local: true }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showLead, setShowLead] = useState(false);
  const [leadSent, setLeadSent] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, showLead, leadSent, error]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 220);
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

      if (res.status === 429) {
        throw new Error("You're going a little fast — give it a few seconds and try again.");
      }
      if (!res.ok || !res.body) {
        throw new Error("Couldn't reach the assistant. Please try again in a moment.");
      }

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
      setMessages((cur) => cur.slice(0, -1)); // drop the empty assistant bubble
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const noUserYet = messages.filter((m) => m.role === "user").length === 0;

  return (
    <>
      <motion.button
        aria-label={open ? "Close chat" : "Chat with Aljesh's assistant"}
        onClick={() => setOpen((v) => !v)}
        className="mono fixed bottom-5 right-5 z-[110] grid h-14 w-14 place-items-center rounded-full"
        style={{
          background: "var(--fg)",
          color: "var(--bg)",
          border: "1px solid var(--line-strong)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Aljesh's assistant"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-5 z-[110] flex w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl"
            style={{
              height: "min(600px, calc(100vh - 8rem))",
              background: "var(--bg-2)",
              border: "1px solid var(--line-strong)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            }}
          >
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--bg-2)" }}>
                <Sparkles size={16} />
              </span>
              <div className="leading-tight">
                <div className="font-display" style={{ fontSize: "1.05rem" }}>Ask about Aljesh</div>
                <div className="mono" style={{ fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fog)" }}>
                  AI assistant · replies in seconds
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="ml-auto opacity-60 hover:opacity-100" style={{ color: "var(--fg)" }}>
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} />
              ))}
              {busy && messages[messages.length - 1]?.text === "" && <TypingDots />}

              {noUserYet && !busy && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => send(s)} className="chip" style={{ cursor: "pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {showLead && <LeadForm sent={leadSent} onSent={() => setLeadSent(true)} onError={(msg) => setError(msg)} />}

              {error && (
                <div className="mono" style={{ fontSize: "0.72rem", color: "var(--accent)" }}>
                  {error}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2 px-3 py-3"
              style={{ borderTop: "1px solid var(--line)" }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 800))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                rows={1}
                placeholder="Ask a question…"
                className="max-h-28 flex-1 resize-none bg-transparent px-2 py-2 outline-none"
                style={{ color: "var(--fg)", fontSize: "0.9rem" }}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="grid h-9 w-9 place-items-center rounded-full disabled:opacity-40"
                style={{ background: "var(--fg)", color: "var(--bg)" }}
              >
                <Send size={16} />
              </button>
            </form>

            <div className="mono pb-2 text-center" style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fog)" }}>
              Powered by Gemini · answers may be imperfect
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5"
        style={{
          fontSize: "0.88rem",
          lineHeight: 1.5,
          background: isUser ? "var(--fg)" : "var(--bg-3)",
          color: isUser ? "var(--bg)" : "var(--fg)",
          border: isUser ? "none" : "1px solid var(--line)",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-1 rounded-2xl px-3.5 py-3" style={{ background: "var(--bg-3)", border: "1px solid var(--line)" }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--fog)" }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

function LeadForm({ sent, onSent, onError }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [sending, setSending] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl px-4 py-4" style={{ background: "var(--bg-3)", border: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2" style={{ color: "var(--accent)" }}>
          <Check size={16} />
          <span className="font-display" style={{ fontSize: "1rem" }}>Got it — thank you.</span>
        </div>
        <p className="pt-1" style={{ fontSize: "0.82rem", color: "var(--fg-soft)" }}>
          Aljesh will reach out shortly. For anything urgent, WhatsApp +977 9819963606.
        </p>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    if (!form.name.trim() || !form.email.trim()) {
      onError("Please add your name and email.");
      return;
    }
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

  const field = {
    background: "var(--bg-2)",
    border: "1px solid var(--line)",
    color: "var(--fg)",
    borderRadius: "10px",
    padding: "0.55rem 0.7rem",
    fontSize: "0.85rem",
    width: "100%",
    outline: "none",
  };

  return (
    <form onSubmit={submit} className="space-y-2 rounded-2xl px-4 py-4" style={{ background: "var(--bg-3)", border: "1px solid var(--line)" }}>
      <div className="font-display" style={{ fontSize: "1rem" }}>Leave your details</div>
      <p className="mono" style={{ fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fog)" }}>
        Aljesh replies within hours
      </p>
      <input aria-label="Name" placeholder="Name" style={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input aria-label="Email" type="email" placeholder="Email" style={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input aria-label="Phone (optional)" placeholder="Phone (optional)" style={field} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <textarea aria-label="Message (optional)" placeholder="What do you need? (optional)" rows={2} style={{ ...field, resize: "none" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {/* Honeypot — hidden from users, catches bots */}
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      <button type="submit" disabled={sending} className="btn-magnet w-full" style={{ padding: "0.7rem 1rem", fontSize: "0.7rem" }}>
        <span className="label">{sending ? "Sending…" : "Send to Aljesh"}</span>
      </button>
    </form>
  );
}
