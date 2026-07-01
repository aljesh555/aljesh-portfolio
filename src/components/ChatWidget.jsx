import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, ArrowUp, ArrowRight, Check, Paperclip, Mic, Sparkles, FileText } from "lucide-react";

const GREETING =
  "Hello — I'm Aljesh's studio assistant. Ask about his work, services, or how to start a project. You can send photos, files, or a voice note too.";

const SUGGESTIONS = ["What can Aljesh build?", "How does a project start?", "What does it cost?"];
const LEAD_TOKEN = "[[SHOW_LEAD_FORM]]";
const MAX_FILE_BYTES = 6 * 1024 * 1024;

/* ---------- media helpers ---------- */
const toDataURL = (blob) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(blob);
  });

async function processImage(file) {
  const dataUrl = await toDataURL(file);
  const img = await new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = dataUrl;
  });
  const max = 1024;
  let w = img.width, h = img.height;
  if (Math.max(w, h) > max) {
    const s = max / Math.max(w, h);
    w = Math.round(w * s);
    h = Math.round(h * s);
  }
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  c.getContext("2d").drawImage(img, 0, 0, w, h);
  const out = c.toDataURL("image/jpeg", 0.72);
  return { id: "i" + Date.now() + Math.random(), kind: "image", name: file.name || "image.jpg", mimeType: "image/jpeg", dataUrl: out, data: out.split(",")[1] };
}

async function processFile(file) {
  const dataUrl = await toDataURL(file);
  return { id: "f" + Date.now() + Math.random(), kind: "file", name: file.name || "file", mimeType: file.type || "application/octet-stream", dataUrl, data: dataUrl.split(",")[1] };
}

async function audioFromBlob(blob, duration) {
  const dataUrl = await toDataURL(blob);
  const mimeBase = (blob.type || "audio/webm").split(";")[0];
  return { id: "a" + Date.now(), kind: "audio", name: "Voice message", mimeType: mimeBase, dataUrl, data: dataUrl.split(",")[1], duration };
}

const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: GREETING, local: true }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showLead, setShowLead] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);

  const rm = useReducedMotion();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const startRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, showLead, leadSent, error, pending, recording]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 260);
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !recording && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, recording]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  /* ---------- attachments ---------- */
  async function onFiles(list) {
    setError("");
    const files = [...list].slice(0, 5);
    for (const f of files) {
      if (f.size > MAX_FILE_BYTES) { setError("Files must be under 6 MB."); continue; }
      try {
        const att = f.type.startsWith("image/") ? await processImage(f) : await processFile(f);
        setPending((p) => [...p, att].slice(0, 5));
      } catch { setError("Couldn't read that file."); }
    }
  }
  const removePending = (id) => setPending((p) => p.filter((a) => a.id !== id));

  /* ---------- voice ---------- */
  async function startRecording() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Voice recording isn't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const types = ["audio/ogg;codecs=opus", "audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
      const mt = types.find((t) => MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined);
      recorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || mt || "audio/webm" });
        const dur = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
        try {
          const att = await audioFromBlob(blob, dur);
          setPending((p) => [...p, att].slice(0, 5));
        } catch { setError("Couldn't process the recording."); }
      };
      startRef.current = Date.now();
      rec.start();
      setRecording(true);
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs((s) => { const n = s + 1; if (n >= 60) stopRecording(); return n; }), 1000);
    } catch { setError("Microphone access was blocked."); }
  }
  function stopRecording() {
    clearInterval(timerRef.current);
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") { try { rec.stop(); } catch { /* noop */ } }
    setRecording(false);
  }
  function cancelRecording() {
    clearInterval(timerRef.current);
    const rec = recorderRef.current;
    if (rec) { rec.onstop = null; if (rec.state !== "inactive") { try { rec.stop(); } catch { /* noop */ } } }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    chunksRef.current = [];
    setRecording(false);
    setRecSecs(0);
  }

  /* ---------- send ---------- */
  async function send(textOverride) {
    const fromSuggestion = typeof textOverride === "string";
    const text = (fromSuggestion ? textOverride : input).trim();
    const atts = fromSuggestion ? [] : pending;
    if ((!text && atts.length === 0) || busy || recording) return;

    setError("");
    if (!fromSuggestion) { setInput(""); setPending([]); }

    const userMsg = { role: "user", text, attachments: atts };
    const base = [...messages, userMsg];
    setMessages([...base, { role: "assistant", text: "" }]);
    setBusy(true);

    try {
      const payloadMsgs = base
        .filter((m) => !m.local)
        .map((m, i, arr) => ({
          role: m.role,
          text: m.text,
          attachments:
            i === arr.length - 1 && m.attachments?.length
              ? m.attachments.map((a) => ({ mimeType: a.mimeType, data: a.data }))
              : undefined,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMsgs }),
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
      if (acc.includes(LEAD_TOKEN)) { setLeadSent(false); setShowLead(true); }
    } catch (e) {
      setMessages((cur) => cur.slice(0, -1));
      setError(e.message || "Something went wrong.");
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  const noUserYet = messages.filter((m) => m.role === "user").length === 0;
  const canSend = (input.trim() || pending.length) && !busy;
  const spring = rm ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 24 };

  return (
    <>
      {/* ---------- Launcher ---------- */}
      <motion.button
        layout
        aria-label={open ? "Close AI assistant" : "Ask AI — open the chat assistant"}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-[110] flex h-14 items-center gap-2 overflow-visible rounded-full"
        style={{ background: "var(--fg)", color: "var(--bg)", border: "1px solid var(--line-strong)", boxShadow: "0 12px 34px color-mix(in oklab, var(--fg), transparent 78%)", paddingLeft: open ? 15 : 18, paddingRight: open ? 15 : 22 }}
      >
        {!rm && !open && (
          <motion.span aria-hidden className="absolute inset-0 rounded-full" style={{ border: "1.5px solid var(--accent)" }}
            initial={{ opacity: 0.45, scale: 1 }} animate={{ opacity: 0, scale: 1.3 }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }} />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="grid place-items-center" style={{ width: 24 }}>
              <X size={22} strokeWidth={1.75} />
            </motion.span>
          ) : (
            <motion.span key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2 whitespace-nowrap">
              <Sparkles size={19} strokeWidth={2} />
              <span className="mono" style={{ fontSize: "0.8rem", letterSpacing: "0.03em" }}>Ask AI</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ---------- Panel ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-label="Chat with Aljesh's studio assistant"
            initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }} transition={spring}
            style={{ transformOrigin: "bottom right", height: "min(640px, calc(100vh - 7rem))", background: "var(--bg-2)", border: "1px solid var(--line-strong)", borderTop: "3px solid var(--accent)", boxShadow: "0 30px 70px color-mix(in oklab, var(--fg), transparent 74%)" }}
            className="fixed bottom-24 right-5 z-[110] flex w-[calc(100vw-2.5rem)] max-w-[400px] flex-col overflow-hidden rounded-[18px]"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 pb-3 pt-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ border: "1px solid var(--line-strong)", background: "var(--bg-3)" }}>
                <span className="star" style={{ width: 20, height: 20, color: "var(--accent)", display: "block" }} />
              </span>
              <div className="min-w-0 leading-tight">
                <div className="font-display" style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}>Ask Aljesh</div>
                <div className="mono flex items-center gap-1.5" style={{ fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fog)" }}>
                  <motion.span className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--accent)" }} animate={rm ? {} : { opacity: [1, 0.35, 1] }} transition={{ duration: 1.8, repeat: Infinity }} />
                  Online · replies in seconds
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="ml-auto grid h-8 w-8 place-items-center rounded-full opacity-55 transition-opacity hover:opacity-100" style={{ color: "var(--fg)" }}>
                <X size={17} strokeWidth={1.75} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
              {messages.map((m, i) => {
                const streaming = busy && i === messages.length - 1 && m.role === "assistant";
                return <Message key={i} m={m} streaming={streaming} rm={rm} />;
              })}
              {busy && messages[messages.length - 1]?.text === "" && <TypingDots rm={rm} />}

              {noUserYet && !busy && (
                <motion.div className="pt-1" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}>
                  <motion.div variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="mono pb-1.5" style={{ fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--fog)" }}>Try asking</motion.div>
                  <div style={{ borderTop: "1px solid var(--line)" }}>
                    {SUGGESTIONS.map((s) => (
                      <motion.button key={s} variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }} onClick={() => send(s)}
                        className="group flex w-full items-center justify-between gap-3 py-2.5 text-left" style={{ borderBottom: "1px solid var(--line)", color: "var(--fg)" }}>
                        <span style={{ fontSize: "0.88rem" }}>{s}</span>
                        <ArrowRight size={15} className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--accent)" }} />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {showLead && <LeadForm sent={leadSent} onSent={() => setLeadSent(true)} onError={(msg) => setError(msg)} rm={rm} />}
              {error && <div className="mono" style={{ fontSize: "0.72rem", lineHeight: 1.5, color: "var(--accent)" }}>{error}</div>}
            </div>

            {/* Composer */}
            <div style={{ borderTop: "1px solid var(--line)" }}>
              {/* pending attachments */}
              <AnimatePresence>
                {pending.length > 0 && !recording && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2 overflow-hidden px-3 pt-3">
                    {pending.map((a) => (
                      <PendingChip key={a.id} att={a} onRemove={() => removePending(a.id)} rm={rm} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {recording ? (
                <RecordingBar secs={recSecs} onCancel={cancelRecording} onStop={stopRecording} rm={rm} />
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-end gap-1.5 px-3 pb-2.5 pt-2.5">
                  <input ref={fileRef} type="file" accept="image/*,application/pdf" multiple hidden onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
                  <IconBtn label="Attach photo or file" onClick={() => fileRef.current?.click()}><Paperclip size={18} strokeWidth={1.75} /></IconBtn>
                  <div className="flex flex-1 items-end rounded-2xl" style={{ background: "var(--bg-3)", border: "1px solid var(--line)" }}>
                    <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value.slice(0, 800))}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                      rows={1} placeholder="Ask a question…" className="max-h-28 flex-1 resize-none bg-transparent px-3 py-2.5 outline-none" style={{ color: "var(--fg)", fontSize: "0.9rem" }} />
                  </div>
                  {canSend ? (
                    <motion.button key="send" type="submit" aria-label="Send message" whileTap={{ scale: 0.9 }} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                      <ArrowUp size={18} strokeWidth={2} />
                    </motion.button>
                  ) : (
                    <IconBtn key="mic" label="Record a voice message" onClick={startRecording} filled><Mic size={18} strokeWidth={1.75} /></IconBtn>
                  )}
                </form>
              )}
              <div className="mono pb-2 text-center" style={{ fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--fog)" }}>
                AI assistant · answers may be imperfect
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- sub-components ---------- */
function IconBtn({ children, label, onClick, filled }) {
  return (
    <motion.button type="button" aria-label={label} onClick={onClick} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors"
      style={{ background: filled ? "var(--fg)" : "transparent", color: filled ? "var(--bg)" : "var(--fg-soft)", border: filled ? "none" : "1px solid var(--line)" }}>
      {children}
    </motion.button>
  );
}

function Attachments({ atts, onUser }) {
  if (!atts?.length) return null;
  return (
    <div className="flex flex-wrap gap-2" style={{ marginTop: onUser ? 0 : 6, marginBottom: 6 }}>
      {atts.map((a) =>
        a.kind === "image" ? (
          <img key={a.id} src={a.dataUrl} alt={a.name} className="h-20 w-20 rounded-lg object-cover" style={{ border: "1px solid var(--line)" }} />
        ) : a.kind === "audio" ? (
          <audio key={a.id} controls src={a.dataUrl} style={{ height: 34, maxWidth: 210 }} />
        ) : (
          <span key={a.id} className="mono inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ fontSize: "0.66rem", background: "color-mix(in oklab, var(--bg-2), transparent 30%)", border: "1px solid var(--line)", color: "var(--fg-soft)", maxWidth: 200 }}>
            <FileText size={13} /> <span className="truncate">{a.name}</span>
          </span>
        )
      )}
    </div>
  );
}

function Message({ m, streaming, rm }) {
  const isUser = m.role === "user";
  const enter = rm ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 26 };
  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, y: rm ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={enter} className="flex flex-col items-end">
        <Attachments atts={m.attachments} onUser />
        {m.text && (
          <div className="max-w-[86%] whitespace-pre-wrap" style={{ marginTop: m.attachments?.length ? 6 : 0, fontSize: "0.9rem", lineHeight: 1.55, padding: "0.6rem 0.85rem", borderRadius: "16px 16px 5px 16px", background: "var(--fg)", color: "var(--bg)" }}>
            {m.text}
          </div>
        )}
      </motion.div>
    );
  }
  // Assistant — bubble-less editorial treatment with a wine star marker
  return (
    <motion.div initial={{ opacity: 0, y: rm ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={enter} className="flex gap-2.5">
      <span className="star mt-1 shrink-0" style={{ width: 13, height: 13, color: "var(--accent)", display: "block" }} />
      <div className="min-w-0 flex-1 whitespace-pre-wrap" style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "var(--fg)" }}>
        {m.text}
        {streaming && (
          <motion.span aria-hidden className="ml-0.5 inline-block align-[-2px]" style={{ width: 7, height: 15, background: "var(--accent)", borderRadius: 1 }}
            animate={{ opacity: [1, 0.15, 1] }} transition={{ duration: 0.9, repeat: Infinity }} />
        )}
      </div>
    </motion.div>
  );
}

function PendingChip({ att, onRemove, rm }) {
  return (
    <motion.div initial={{ scale: rm ? 1 : 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }} className="relative">
      {att.kind === "image" ? (
        <img src={att.dataUrl} alt={att.name} className="h-14 w-14 rounded-lg object-cover" style={{ border: "1px solid var(--line)" }} />
      ) : (
        <span className="mono flex h-14 items-center gap-1.5 rounded-lg px-2.5" style={{ fontSize: "0.62rem", background: "var(--bg-3)", border: "1px solid var(--line)", color: "var(--fg-soft)", maxWidth: 150 }}>
          {att.kind === "audio" ? <Mic size={13} style={{ color: "var(--accent)" }} /> : <FileText size={13} />}
          <span className="truncate">{att.kind === "audio" ? `Voice · ${fmtTime(att.duration || 0)}` : att.name}</span>
        </span>
      )}
      <button type="button" aria-label="Remove attachment" onClick={onRemove} className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full" style={{ background: "var(--fg)", color: "var(--bg)" }}>
        <X size={11} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}

function RecordingBar({ secs, onCancel, onStop, rm }) {
  return (
    <div className="flex items-center gap-3 px-3 pb-2.5 pt-2.5">
      <IconBtn label="Cancel recording" onClick={onCancel}><X size={18} strokeWidth={1.75} /></IconBtn>
      <div className="flex flex-1 items-center gap-2 rounded-2xl px-3 py-2" style={{ background: "var(--bg-3)", border: "1px solid var(--line)" }}>
        <span className="inline-block rounded-full" style={{ width: 8, height: 8, background: "var(--accent)" }} />
        <div className="flex flex-1 items-center gap-[3px]" style={{ height: 20 }}>
          {[...Array(18)].map((_, i) => (
            <motion.span key={i} className="inline-block flex-1 rounded-full" style={{ background: "var(--accent)", opacity: 0.65, transformOrigin: "center" }}
              animate={rm ? { scaleY: 0.4 } : { scaleY: [0.25, 1, 0.4, 0.8, 0.3] }} transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }} />
          ))}
        </div>
        <span className="mono tabular-nums" style={{ fontSize: "0.72rem", color: "var(--fg-soft)" }}>{fmtTime(secs)}</span>
      </div>
      <motion.button type="button" aria-label="Stop and attach recording" onClick={onStop} whileTap={{ scale: 0.9 }} className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "var(--accent)", color: "var(--bg)" }}>
        <Check size={18} strokeWidth={2} />
      </motion.button>
    </div>
  );
}

function TypingDots({ rm }) {
  return (
    <div className="flex gap-2.5">
      <span className="star mt-1 shrink-0" style={{ width: 13, height: 13, color: "var(--accent)", display: "block" }} />
      <div className="flex items-center gap-1.5 pt-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="inline-block rounded-full" style={{ width: 6, height: 6, background: "var(--fog)" }}
            animate={rm ? {} : { opacity: [0.25, 1, 0.25], y: [0, -2, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </div>
    </div>
  );
}

function LeadForm({ sent, onSent, onError, rm }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", company: "" });
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState("");
  const wrap = { initial: { opacity: 0, y: rm ? 0 : 10 }, animate: { opacity: 1, y: 0 }, transition: rm ? { duration: 0.15 } : { type: "spring", stiffness: 240, damping: 24 } };

  if (sent) {
    return (
      <motion.div {...wrap} className="rounded-2xl px-4 py-4" style={{ background: "var(--bg-3)", border: "1px solid var(--line)", borderLeft: "3px solid var(--accent)" }}>
        <div className="flex items-center gap-2" style={{ color: "var(--accent)" }}>
          <Check size={17} strokeWidth={2} /><span className="font-display" style={{ fontSize: "1.05rem" }}>Got it — thank you.</span>
        </div>
        <p className="pt-1" style={{ fontSize: "0.82rem", lineHeight: 1.5, color: "var(--fg-soft)" }}>Aljesh will reach out shortly. For anything urgent, WhatsApp +977 9819963606.</p>
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
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) onSent();
      else onError("Couldn't send that — please email rautaljesh@gmail.com directly.");
    } catch { onError("Couldn't send that — please email rautaljesh@gmail.com directly."); }
    finally { setSending(false); }
  }

  const field = (name) => ({ background: "var(--bg-2)", border: `1px solid ${focused === name ? "var(--accent)" : "var(--line)"}`, color: "var(--fg)", borderRadius: "10px", padding: "0.6rem 0.75rem", fontSize: "0.85rem", width: "100%", outline: "none", transition: "border-color 200ms ease" });

  return (
    <motion.form {...wrap} onSubmit={submit} className="space-y-2.5 rounded-2xl px-4 py-4" style={{ background: "var(--bg-3)", border: "1px solid var(--line)", borderLeft: "3px solid var(--accent)" }}>
      <div className="font-display" style={{ fontSize: "1.1rem", letterSpacing: "-0.02em" }}>Leave your details</div>
      <p className="mono" style={{ fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fog)" }}>Aljesh replies within hours</p>
      {["name", "email", "phone"].map((n) => (
        <input key={n} aria-label={n === "phone" ? "Phone (optional)" : n[0].toUpperCase() + n.slice(1)} type={n === "email" ? "email" : "text"}
          placeholder={n === "phone" ? "Phone (optional)" : n[0].toUpperCase() + n.slice(1)} style={field(n)} value={form[n]}
          onFocus={() => setFocused(n)} onBlur={() => setFocused("")} onChange={(e) => setForm({ ...form, [n]: e.target.value })} />
      ))}
      <textarea aria-label="Message (optional)" placeholder="What do you need? (optional)" rows={2} style={{ ...field("message"), resize: "none" }} value={form.message}
        onFocus={() => setFocused("message")} onBlur={() => setFocused("")} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <input tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      <button type="submit" disabled={sending} className="btn-magnet w-full" style={{ padding: "0.75rem 1rem", fontSize: "0.68rem" }}>
        <span className="label">{sending ? "Sending…" : "Send to Aljesh"}</span>
      </button>
    </motion.form>
  );
}
