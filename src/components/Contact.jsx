import React, { useState, useEffect, useRef, useCallback } from "react";
import { config } from "../config";

function useInView(threshold = 0) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const STYLES = `
  @keyframes ctFadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ctFadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes ctSlideR   { from { opacity:0; transform:translateX(48px); } to { opacity:1; transform:translateX(0); } }
  @keyframes ctFloat    { 0%,100% { transform:translateY(0px) scale(1); opacity:0; } 15%{opacity:0.6;} 85%{opacity:0.35;} 100%{transform:translateY(-70px) scale(1.15);opacity:0;} }
  @keyframes ctPulseRing{ 0%{transform:scale(1);opacity:0.55;} 100%{transform:scale(3);opacity:0;} }
  @keyframes ctTwinkle  { 0%,100%{opacity:0.3;transform:scale(0.8) rotate(0deg);} 50%{opacity:1;transform:scale(1.2) rotate(20deg);} }
  @keyframes ctAccent   { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
  @keyframes ctLineGrow { from{transform:scaleX(0);} to{transform:scaleX(1);} }
  @keyframes ctOrbit    { from{transform:rotate(0deg) translateX(28px) rotate(0deg);} to{transform:rotate(360deg) translateX(28px) rotate(-360deg);} }
  @keyframes ctOrbit2   { from{transform:rotate(180deg) translateX(22px) rotate(-180deg);} to{transform:rotate(540deg) translateX(22px) rotate(-540deg);} }
  @keyframes ctGhost    { 0%,100%{opacity:1;} 50%{opacity:0.6;} }
  @keyframes ctSuccessPop { from{opacity:0;transform:scale(0.7) rotate(-10deg);} to{opacity:1;transform:scale(1) rotate(0deg);} }
  @keyframes ctBreath { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }

  /* ── Legend-style field ── */
  .lf-wrap { position: relative; margin-top: 0.7rem; }

  .lf-label {
    position: absolute;
    /* idle: centered inside the field */
    top: 50%;
    left: 1rem;
    transform: translateY(-50%);
    font-size: 0.88rem;
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    padding: 0;
    background: transparent;
    color: rgba(61,26,36,0.38);
    pointer-events: none;
    z-index: 2;
    line-height: 1;
    transition:
      top 0.25s cubic-bezier(0.16,1,0.3,1),
      transform 0.25s cubic-bezier(0.16,1,0.3,1),
      font-size 0.25s cubic-bezier(0.16,1,0.3,1),
      font-weight 0.25s cubic-bezier(0.16,1,0.3,1),
      letter-spacing 0.25s cubic-bezier(0.16,1,0.3,1),
      color 0.25s ease,
      padding 0.25s ease,
      background 0.25s ease;
    font-family: inherit;
    white-space: nowrap;
  }

  /* textarea idle: top-aligned instead of vertically centered */
  .lf-label.lf-area-idle {
    top: 1rem;
    transform: none;
  }

  /* active (focused or has value): sits in the border gap */
  .lf-label.lf-active {
    top: -0.58rem;
    transform: none;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0 0.3rem;
    background: #F5EDE3;
    color: #C97A8A;
  }

  .lf-input {
    width: 100%;
    background: #F5EDE3;
    border: 1.5px solid rgba(61,26,36,0.12);
    border-radius: 0.75rem;
    padding: 0.85rem 1rem;
    font-size: 0.9rem;
    color: #3D1A24;
    outline: none;
    font-family: inherit;
    display: block;
    box-sizing: border-box;
    transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  }
  .lf-input::placeholder { color: transparent; }
  .lf-input.lf-input-focused::placeholder { color: rgba(61,26,36,0.25); }
  .lf-input:hover:not(:focus) {
    border-color: rgba(61,26,36,0.28);
    background: #F9F2EA;
  }
  .lf-input:focus {
    border-color: #C97A8A;
    box-shadow: 0 0 0 3px rgba(201,122,138,0.12);
  }

  .ct-submit:hover { background: #A85568 !important; transform: translateY(-2px) scale(1.02) !important; box-shadow: 0 12px 32px rgba(168,85,104,0.28) !important; }
  .ct-submit:active { transform: translateY(0) scale(0.98) !important; }
  .ct-submit { transition: all 0.3s cubic-bezier(0.16,1,0.3,1) !important; }
  .ct-email-link:hover { color: #A85568 !important; letter-spacing: 0.06em !important; }
  .ct-email-link { transition: color 0.2s ease, letter-spacing 0.3s ease !important; }
`;

function Particle({ x, y, size, dur, delay, color }) {
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: "50%",
      background: color, opacity: 0, pointerEvents: "none",
      animation: `ctFloat ${dur}s ease-in-out ${delay}s infinite`,
    }} />
  );
}

function OrbitStar() {
  return (
    <div style={{ position: "relative", width: "60px", height: "60px", flexShrink: 0 }}>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.6rem", color: "#C97A8A",
        animation: "ctTwinkle 2.8s ease-in-out infinite",
      }}>✦</div>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(201,122,138,0.2)" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-3px", marginLeft: "-3px", width: "6px", height: "6px" }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C97A8A", animation: "ctOrbit 3.5s linear infinite" }} />
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-3px", marginLeft: "-3px", width: "4px", height: "4px" }}>
        <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(168,85,104,0.5)", animation: "ctOrbit2 5s linear infinite" }} />
      </div>
    </div>
  );
}

function Field({ label, id, name, type = "text", value, onChange, placeholder, as = "input", rows }) {
  const [focused, setFocused] = useState(false);
  const hasVal = !!value;
  const isActive = focused || hasVal;
  const isArea = as === "textarea";
  const Tag = as;

  // label class
  let labelClass = "lf-label";
  if (isActive) {
    labelClass += " lf-active";
  } else if (isArea) {
    labelClass += " lf-area-idle";
  }

  return (
    <div className="lf-wrap">
      <label htmlFor={id} className={labelClass}>{label}</label>
      <Tag
        id={id}
        name={name}
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`lf-input${focused ? " lf-input-focused" : ""}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          resize: isArea ? "vertical" : undefined,
          minHeight: isArea ? "130px" : undefined,
        }}
      />
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sectionRef, inView] = useInView(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const blobRef = useRef(null);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        if (blobRef.current) {
          blobRef.current.style.left = `${mouseRef.current.x}%`;
          blobRef.current.style.top = `${mouseRef.current.y}%`;
        }
        rafRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (el) el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => { if (el) el.removeEventListener("mousemove", handleMouseMove); };
  }, [handleMouseMove]);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setSending(true);
    try {
      const res = await fetch("https://formspree.io/f/xykvoojd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) { setSubmitted(true); setFormData({ name: "", email: "", message: "" }); }
      else setError(true);
    } catch { setError(true); }
    finally { setSending(false); }
  };

  const particles = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * 100, y: 40 + Math.random() * 55,
      size: `${2 + Math.random() * 3.5}px`,
      dur: 5 + Math.random() * 7,
      delay: Math.random() * 8,
      color: ["rgba(201,122,138,0.45)", "rgba(168,85,104,0.3)", "rgba(247,212,212,0.5)"][i % 3],
    }))
  ).current;

  const stars = [
    { top: "12%", left: "2%",   size: "1.4rem", delay: "0s",   dur: "2.8s" },
    { top: "28%", left: "4%",   size: "0.7rem", delay: "0.6s", dur: "3.2s" },
    { top: "6%",  right: "3%",  size: "0.9rem", delay: "1.1s", dur: "2.5s" },
    { top: "55%", right: "2%",  size: "1.2rem", delay: "0.4s", dur: "3.6s" },
    { bottom:"15%",left: "3%",  size: "0.6rem", delay: "1.8s", dur: "2.2s" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{ background: "#EDE0D0", position: "relative", overflow: "hidden", padding: "6rem 6% 7rem" }}
    >
      <style>{STYLES}</style>

      {/* Cursor-tracking glow */}
      <div ref={blobRef} style={{
        position: "absolute", width: "420px", height: "420px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,122,138,0.12) 0%, transparent 65%)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none", zIndex: 0,
        transition: "left 0.6s cubic-bezier(0.16,1,0.3,1), top 0.6s cubic-bezier(0.16,1,0.3,1)",
        left: "50%", top: "50%",
      }} />

      {/* Ambient blobs */}
      <div style={{
        position: "absolute", top: "-4rem", right: "-4rem",
        width: "360px", height: "360px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,104,0.1) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0, animation: "ctBreath 7s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-3rem", left: "-3rem",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(201,122,138,0.08) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0, animation: "ctBreath 9s ease-in-out 2s infinite",
      }} />

      {/* Ghost text */}
      <div style={{
        position: "absolute", bottom: "-1.5rem", right: "-1rem",
        fontSize: "clamp(5rem, 16vw, 13rem)", fontWeight: 900,
        fontFamily: "'Georgia', serif", color: "transparent",
        WebkitTextStroke: "1px rgba(61,26,36,0.06)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        animation: "ctGhost 8s ease-in-out infinite",
      }}>HELLO</div>

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Stars */}
      {stars.map((s, i) => (
        <span key={i} style={{
          position: "absolute", ...s,
          fontSize: s.size, color: "#C97A8A", zIndex: 1,
          animation: `ctTwinkle ${s.dur} ease-in-out ${s.delay} infinite`,
          pointerEvents: "none",
        }}>✦</span>
      ))}

      {/* Content */}
      <div style={{ maxWidth: "1050px", margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* Section label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3.5rem",
          opacity: inView ? 1 : 0,
          animation: inView ? "ctFadeUp 0.6s ease both" : "none",
        }}>
          <span style={{ color: "#C97A8A", fontSize: "1.2rem", animation: "ctTwinkle 2.5s ease-in-out infinite" }}>✦</span>
          <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,26,36,0.4)", fontWeight: 600 }}>
            05 — Contact
          </span>
          <div style={{
            flex: 1, height: "1px",
            background: "linear-gradient(90deg, rgba(61,26,36,0.15), transparent)",
            transformOrigin: "left",
            animation: inView ? "ctLineGrow 1s cubic-bezier(0.16,1,0.3,1) 0.3s both" : "none",
          }} />
        </div>

        <div style={{ display: "flex", gap: "5rem", flexWrap: "wrap" }}>

          {/* LEFT */}
          <div style={{
            flex: "1 1 260px", minWidth: 0,
            opacity: inView ? 1 : 0,
            animation: inView ? "ctFadeUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.15s both" : "none",
          }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <OrbitStar />
            </div>

            <h2 style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
              color: "#3D1A24", lineHeight: 1.08, margin: "0 0 1.25rem", fontWeight: 700,
            }}>
              Let's create{" "}
              <em style={{ color: "#A85568", fontStyle: "italic", display: "block" }}>something great</em>
            </h2>

            <div style={{
              height: "2px", width: "60px",
              background: "linear-gradient(90deg, #C97A8A, #F7D4D4, #C97A8A)",
              backgroundSize: "200% 200%",
              marginBottom: "1.4rem", borderRadius: "1px",
              animation: "ctAccent 3s ease infinite",
            }} />

            <p style={{ fontSize: "0.9rem", color: "rgba(61,26,36,0.5)", lineHeight: 1.8, marginBottom: "2rem" }}>
              {config.contact.message}
            </p>

            {/* Email pill */}
            <a
              href={`mailto:${config.contact.email}`}
              className="ct-email-link"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.55rem",
                fontSize: "0.82rem", color: "#C97A8A", textDecoration: "none",
                background: "rgba(201,122,138,0.08)",
                border: "1px solid rgba(201,122,138,0.2)",
                borderRadius: "9999px", padding: "0.55rem 1.1rem", fontWeight: 600,
              }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              {config.contact.email}
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C97A8A", flexShrink: 0, position: "relative" }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(201,122,138,0.4)", animation: "ctPulseRing 2s ease-out infinite" }} />
              </span>
            </a>

    
          </div>

          {/* RIGHT: Form */}
          <div style={{
            flex: "1 1 320px", minWidth: 0,
            opacity: inView ? 1 : 0,
            animation: inView ? "ctSlideR 0.75s cubic-bezier(0.16,1,0.3,1) 0.3s both" : "none",
          }}>
            {submitted ? (
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: "1rem", textAlign: "center",
                background: "#F5EDE3",
                border: "1.5px solid rgba(201,122,138,0.2)",
                borderRadius: "1.5rem", padding: "3.5rem 2rem",
                minHeight: "340px", position: "relative", overflow: "hidden",
              }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    position: "absolute",
                    left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 25}%`,
                    width: `${3 + (i % 3)}px`, height: `${3 + (i % 3)}px`,
                    borderRadius: "50%",
                    background: ["#C97A8A","#F7D4D4","#A85568"][i%3],
                    opacity: 0,
                    animation: `ctFloat ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
                  }} />
                ))}
                <div style={{ animation: "ctSuccessPop 0.5s cubic-bezier(0.34,1.4,0.64,1) both" }}>
                  <span style={{ fontSize: "3.5rem", color: "#C97A8A", display: "block", lineHeight: 1, animation: "ctTwinkle 2s ease-in-out infinite" }}>✦</span>
                </div>
                <p style={{ fontFamily: "'Georgia', serif", fontSize: "1.5rem", color: "#3D1A24", fontWeight: 700, margin: 0, animation: "ctFadeUp 0.5s ease 0.2s both" }}>
                  Message sent!
                </p>
                <p style={{ fontSize: "0.85rem", color: "rgba(61,26,36,0.45)", margin: 0, animation: "ctFadeUp 0.5s ease 0.35s both" }}>
                  Thanks for reaching out — I'll be in touch soon.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", message: "" }); }}
                  style={{
                    marginTop: "0.5rem", background: "#C97A8A", color: "#FDF0F0",
                    borderRadius: "9999px", padding: "0.65rem 1.8rem",
                    fontSize: "0.8rem", fontWeight: 700, border: "none", cursor: "pointer",
                    letterSpacing: "0.06em", animation: "ctFadeUp 0.5s ease 0.5s both",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#A85568"}
                  onMouseLeave={e => e.currentTarget.style.background = "#C97A8A"}
                >
                  Send another ✦
                </button>
              </div>
            ) : (
              <div style={{
                background: "#F5EDE3",
                borderRadius: "1.5rem",
                padding: "2.25rem 2rem",
                border: "1.5px solid rgba(61,26,36,0.08)",
                position: "relative", overflow: "visible",
              }}>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>

                  <Field label="Your name" id="name" name="name" value={formData.name}
                    onChange={handleChange} placeholder="Jane Doe" />

                  <Field label="Email address" id="email" name="email" type="email" value={formData.email}
                    onChange={handleChange} placeholder="jane@example.com" />

                  <Field label="Message" id="message" name="message" as="textarea" value={formData.message}
                    onChange={handleChange} placeholder="What's on your mind?" rows={5} />

                  {error && (
                    <p style={{
                      fontSize: "0.82rem", color: "#f87171",
                      background: "rgba(248,113,113,0.08)", borderRadius: "0.5rem",
                      padding: "0.6rem 0.9rem", margin: 0,
                      border: "1px solid rgba(248,113,113,0.2)",
                    }}>
                      Something went wrong — please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="ct-submit"
                    style={{
                      alignSelf: "flex-start",
                      background: sending ? "#A85568" : "#3D1A24",
                      color: "#F5EDE3",
                      borderRadius: "9999px", padding: "0.85rem 2.2rem",
                      fontSize: "0.85rem", fontWeight: 700, border: "none",
                      cursor: sending ? "wait" : "pointer",
                      letterSpacing: "0.06em",
                      display: "inline-flex", alignItems: "center", gap: "0.6rem",
                    }}
                  >
                    {sending ? (
                      <>
                        Sending
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "ctOrbit 1s linear infinite" }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                        </svg>
                      </>
                    ) : (
                      <>Send Message <span style={{ animation: "ctTwinkle 2s ease-in-out infinite" }}>✦</span></>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}