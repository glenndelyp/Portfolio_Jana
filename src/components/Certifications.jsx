import React, { useState, useEffect, useRef, useCallback } from "react";
import { config } from "../config";

/* ── Hooks ── */
function useInView(threshold = 0) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setInView(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useParallaxScroll(factor = 0.06) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fn = () => setOffset(window.scrollY * factor);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [factor]);
  return offset;
}

/* Floating particle that drifts continuously */
function Particle({ x, y, size, duration, delay, color }) {
  return (
    <div style={{
      position: "absolute",
      left: `${x}%`, top: `${y}%`,
      width: `${size}px`, height: `${size}px`,
      borderRadius: "50%",
      background: color,
      opacity: 0,
      animation: `certFloat ${duration}s ease-in-out ${delay}s infinite`,
      pointerEvents: "none",
    }} />
  );
}

/* ── Global keyframes injected once ── */
const GLOBAL_STYLES = `
  @keyframes certFloat {
    0%   { opacity: 0;    transform: translateY(0px) scale(0.8); }
    20%  { opacity: 0.55; }
    80%  { opacity: 0.35; }
    100% { opacity: 0;    transform: translateY(-60px) scale(1.1); }
  }
  @keyframes certPulseRing {
    0%   { transform: scale(1);   opacity: 0.5; }
    100% { transform: scale(2.8); opacity: 0; }
  }
  @keyframes certAccentShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes certCardBreath {
    0%,100% { box-shadow: 0 2px 12px rgba(61,26,36,0.05); }
    50%      { box-shadow: 0 6px 28px rgba(61,26,36,0.10); }
  }
  @keyframes certShimmerLoop {
    0%   { left: -120%; }
    100% { left: 160%; }
  }
  @keyframes certDotPop {
    0%,100% { transform: scale(1); }
    50%      { transform: scale(1.25); }
  }
  @keyframes certFadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes certSlideUp { from { opacity:0; transform:translateY(28px) scale(0.95) } to { opacity:1; transform:translateY(0) scale(1) } }
  @keyframes certHeadingDrift {
    0%,100% { letter-spacing: 0.01em; }
    50%      { letter-spacing: 0.015em; }
  }
  @keyframes certGhostDrift {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.7; }
  }
  @keyframes certBarPulse {
    0%,100% { opacity: 0.45; width: 60%; }
    50%      { opacity: 0.9;  width: 85%; }
  }
  @keyframes certIndexBlink {
    0%,90%,100% { opacity: 1; }
    95%          { opacity: 0.2; }
  }
`;

/* ── Modal ── */
function Modal({ cert, onClose }) {
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose]);

  const accentColor = cert.color || "#C97A8A";

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(61,26,36,0.6)", backdropFilter: "blur(16px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
      animation: "certFadeIn 0.22s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#F5EDE3", borderRadius: "1.5rem", overflow: "hidden",
        maxWidth: "520px", width: "100%",
        animation: "certSlideUp 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        boxShadow: `0 48px 120px rgba(61,26,36,0.28)`,
        position: "relative", border: `1px solid ${accentColor}20`,
      }}>
        {/* Animated accent bar */}
        <div style={{
          height: "3px",
          background: `linear-gradient(270deg, ${accentColor}, #F7D4D4, ${accentColor})`,
          backgroundSize: "200% 200%",
          animation: "certAccentShift 3s ease infinite",
        }} />

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "1rem", right: "1rem", zIndex: 10,
          background: "rgba(61,26,36,0.06)", border: "1px solid rgba(61,26,36,0.1)",
          borderRadius: "50%", width: "32px", height: "32px",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "rgba(61,26,36,0.4)", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}20`; e.currentTarget.style.color = accentColor; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(61,26,36,0.06)"; e.currentTarget.style.color = "rgba(61,26,36,0.4)"; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Image */}
        {cert.image && (
          <div style={{ padding: "1.5rem 1.5rem 1rem", background: `${accentColor}08` }}>
            <img src={cert.image} alt={cert.name} style={{
              width: "100%", borderRadius: "0.75rem", display: "block",
              border: "1px solid rgba(61,26,36,0.08)",
            }} />
          </div>
        )}

        {/* Footer strip */}
        <div style={{
          padding: "1.1rem 1.5rem 1.4rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {cert.year && (
            <span style={{
              fontFamily: "'Georgia', serif", fontSize: "1.4rem",
              fontWeight: 700, color: "#3D1A24",
            }}>{cert.year}</span>
          )}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {cert.credentialUrl && cert.credentialUrl !== "#" && (
              <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: accentColor, color: "#FDF0F0",
                padding: "0.5rem 1rem", borderRadius: "2rem",
                fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                letterSpacing: "0.04em", transition: "opacity 0.2s, transform 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                View Credential
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
            <button onClick={onClose} style={{
              background: "transparent", border: "1px solid rgba(61,26,36,0.15)",
              color: "rgba(61,26,36,0.4)", padding: "0.5rem 1rem",
              borderRadius: "2rem", fontSize: "0.75rem", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(61,26,36,0.3)"; e.currentTarget.style.color = "rgba(61,26,36,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(61,26,36,0.15)"; e.currentTarget.style.color = "rgba(61,26,36,0.4)"; }}
            >Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── CertCard ── */
function CertCard({ cert, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView(0);
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const accentColor = cert.color || "#C97A8A";
  const animDelay = `${index * 0.1}s`;

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cardRef.current.style.transform =
        `perspective(700px) rotateY(${x * 9}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) cardRef.current.style.transform = "";
    setHovered(false);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  /* stagger the continuous breathing so cards don't all pulse together */
  const breathDelay = `${index * 0.4}s`;

  return (
    <div
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        background: "#EDE0D0",
        border: `1.5px solid ${hovered ? `${accentColor}45` : "rgba(61,26,36,0.1)"}`,
        borderRadius: "1.25rem",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        cursor: "pointer",
        transformStyle: "preserve-3d",
        willChange: "transform",
        /* entry wipe */
        clipPath: inView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        opacity: inView ? 1 : 0,
        transition: inView
          ? `clip-path 0.7s cubic-bezier(0.16,1,0.3,1) ${animDelay},
             opacity 0.4s ease ${animDelay},
             border-color 0.3s ease,
             box-shadow 0.3s ease`
          : "none",
        /* continuous subtle breath when not hovered */
        animation: inView && !hovered
          ? `certCardBreath 4s ease-in-out ${breathDelay} infinite`
          : "none",
        boxShadow: hovered ? `0 24px 60px rgba(61,26,36,0.14), 0 0 0 1px ${accentColor}15` : undefined,
      }}
    >
      {/* Continuous shimmer loop (slow, always running after entry) */}
      {inView && (
        <div style={{
          position: "absolute", top: 0,
          width: "45%", height: "100%",
          background: "linear-gradient(105deg, transparent 35%, rgba(247,212,212,0.09) 50%, transparent 65%)",
          zIndex: 3, pointerEvents: "none",
          animation: hovered
            ? "certShimmerLoop 0s" /* on hover the fast shimmer below takes over */
            : `certShimmerLoop ${6 + index * 1.5}s linear ${index * 0.8}s infinite`,
        }} />
      )}

      {/* Fast shimmer on hover */}
      {hovered && (
        <div style={{
          position: "absolute", top: 0,
          left: "-120%",
          width: "55%", height: "100%",
          background: "linear-gradient(105deg, transparent 40%, rgba(247,212,212,0.16) 50%, transparent 60%)",
          zIndex: 4, pointerEvents: "none",
          animation: "certShimmerLoop 0.55s ease forwards",
        }} />
      )}

      {/* Animated accent bar — always shifts color */}
      <div style={{
        height: "3px",
        background: `linear-gradient(270deg, ${accentColor}, #F7D4D4, ${accentColor})`,
        backgroundSize: "200% 200%",
        animation: `certAccentShift ${3 + index * 0.5}s ease ${index * 0.3}s infinite`,
        flexShrink: 0,
      }} />

      {/* Card index — occasional blink */}
      <div style={{
        position: "absolute", top: "0.85rem", right: "1rem",
        fontSize: "0.58rem", letterSpacing: "0.15em",
        color: `${accentColor}60`, fontWeight: 700, zIndex: 2,
        animation: `certIndexBlink ${7 + index * 1.3}s ease ${index * 0.6}s infinite`,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Image area */}
      <div style={{
        width: "100%", aspectRatio: "16/9",
        background: `${accentColor}0a`,
        overflow: "hidden", position: "relative", flexShrink: 0,
      }}>
        {cert.image ? (
          <>
            <img src={cert.image} alt={cert.name} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to top, ${accentColor}30, transparent 60%)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }} />
          </>
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "0.5rem",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(61,26,36,0.2)" }}>Certificate</span>
          </div>
        )}
      </div>

      {/* Bottom strip — year + arrow */}
      <div style={{
        padding: "0.9rem 1.1rem 1rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: hovered ? `${accentColor}08` : "transparent",
        transition: "background 0.35s ease",
      }}>
        {cert.year ? (
          <span style={{
            fontFamily: "'Georgia', serif", fontSize: "1.15rem", fontWeight: 700,
            color: hovered ? "#3D1A24" : "rgba(61,26,36,0.55)",
            transition: "color 0.35s ease",
          }}>{cert.year}</span>
        ) : (
          <span style={{ fontSize: "0.65rem", color: "rgba(61,26,36,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>—</span>
        )}

        {/* Arrow circle — spins slowly when idle, snaps to 45° on hover */}
        <div style={{
          width: "30px", height: "30px", borderRadius: "50%",
          border: `1.5px solid ${hovered ? `${accentColor}60` : "rgba(61,26,36,0.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "border-color 0.4s ease, background 0.4s ease",
          transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
          animation: !hovered ? `certDotPop ${5 + index * 0.7}s ease ${index * 0.5}s infinite` : "none",
          background: hovered ? `${accentColor}15` : "transparent",
          flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke={hovered ? accentColor : "rgba(61,26,36,0.4)"} strokeWidth="2"
            style={{ transition: "stroke 0.35s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      {/* Always-pulsing dot — bottom left, continuous ripple */}
      <div style={{ position: "absolute", bottom: "1rem", left: "1.1rem", width: "6px", height: "6px", pointerEvents: "none" }}>
        <div style={{
          position: "absolute", width: "6px", height: "6px", borderRadius: "50%",
          background: accentColor,
          opacity: inView ? 0.7 : 0,
          transition: "opacity 0.5s ease",
          animation: inView ? `certDotPop ${2.5 + index * 0.3}s ease ${index * 0.4}s infinite` : "none",
        }} />
        <div style={{
          position: "absolute", width: "6px", height: "6px", borderRadius: "50%",
          background: `${accentColor}55`,
          opacity: inView ? 1 : 0,
          animation: inView ? `certPulseRing ${2.5 + index * 0.3}s ease-out ${index * 0.4}s infinite` : "none",
        }} />
      </div>
    </div>
  );
}

/* ── Section ── */
export default function Certifications() {
  const [activeCert, setActiveCert] = useState(null);
  const hasCerts = config.certifications && config.certifications.length > 0;
  const parallaxOffset = useParallaxScroll(0.06);
  const [headingRef, headingInView] = useInView(0);

  /* floating particles config — generated once */
  const particles = useRef(
    Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 6,
      color: i % 3 === 0 ? "rgba(201,122,138,0.4)" : i % 3 === 1 ? "rgba(168,85,104,0.25)" : "rgba(247,212,212,0.35)",
    }))
  ).current;

  return (
    <section id="certifications" style={{
      background: "#F5EDE3",
      padding: "6rem 6% 7rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Inject all keyframes once */}
      <style>{GLOBAL_STYLES}</style>

      {/* Dot texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(61,26,36,0.04) 1px, transparent 1px)",
        backgroundSize: "30px 30px", pointerEvents: "none",
      }} />

      {/* Floating ambient particles */}
      {particles.map((p, i) => <Particle key={i} {...p} />)}

      {/* Parallax ghost text */}
      <div style={{
        position: "absolute", bottom: "-2rem", right: "-1rem",
        fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
        fontFamily: "'Georgia', serif", color: "transparent",
        WebkitTextStroke: "1px rgba(61,26,36,0.05)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        transform: `translateY(${parallaxOffset}px)`,
        transition: "transform 0.1s linear",
        animation: "certGhostDrift 8s ease-in-out infinite",
      }}>CERTS</div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <span style={{ color: "#C97A8A", fontSize: "1.2rem" }}>✦</span>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(61,26,36,0.4)", fontWeight: 600 }}>
            04 — Certifications
          </span>
        </div>

        {/* Heading */}
        <div ref={headingRef} style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.05, color: "#3D1A24", margin: "0 0 0.9rem",
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
            animation: headingInView ? "certHeadingDrift 6s ease-in-out infinite" : "none",
          }}>
            Licenses &{" "}
            <em style={{ color: "#A85568", fontStyle: "italic" }}>Certificates</em>
          </h2>
          <p style={{
            fontSize: "0.88rem", color: "rgba(61,26,36,0.4)",
            maxWidth: "360px", lineHeight: 1.7, margin: 0,
            opacity: headingInView ? 1 : 0,
            transition: "opacity 0.7s ease 0.18s",
          }}>
            Credentials earned through dedication and continuous learning.{" "}
            <span style={{ color: "rgba(168,85,104,0.6)" }}>Click any card to expand.</span>
          </p>
        </div>

        {hasCerts ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
          }}>
            {config.certifications.map((cert, i) => (
              <CertCard key={i} cert={cert} index={i} onClick={() => setActiveCert(cert)} />
            ))}
          </div>
        ) : (
          <div style={{
            border: "1px dashed rgba(61,26,36,0.12)",
            borderRadius: "1.25rem", padding: "4rem 2rem",
            textAlign: "center", color: "rgba(61,26,36,0.3)",
          }}>
            <p style={{ fontWeight: 500, marginBottom: "0.4rem" }}>No certifications yet</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>Add items to the <code>certifications</code> array in <code>config.js</code></p>
          </div>
        )}
      </div>

      {activeCert && <Modal cert={activeCert} onClose={() => setActiveCert(null)} />}

      <style>{`
        @media (max-width: 640px) {
          #certifications > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}