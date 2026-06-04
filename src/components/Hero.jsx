import React, { useEffect, useRef, useState } from "react";
import { config } from "../config";
import profilePhoto from "../assets/tanny.png";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [movedUp, setMovedUp] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const sectionRef = useRef(null);
  const WORD = "PORTFOLIO";

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Typing animation — slower, starts centered */
  useEffect(() => {
    if (!mounted) return;
    let i = 0;
    // Wait a beat so user sees the centered starting position
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTypedText(WORD.slice(0, i));
        if (i === WORD.length) {
          clearInterval(interval);
          // Pause on center, then slide up
          setTimeout(() => setTypingDone(true), 300);
          setTimeout(() => setMovedUp(true), 680);
        }
      }, 110); // slower typing speed
      return () => clearInterval(interval);
    }, 500);
    return () => clearTimeout(delay);
  }, [mounted]);

  /* Glow pulse after moved up */
  useEffect(() => {
    if (!movedUp) return;
    const t = setTimeout(() => setGlowPulse(true), 300);
    return () => clearTimeout(t);
  }, [movedUp]);

  useEffect(() => {
    const handleMouse = (e) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      });
    };
    const el = sectionRef.current;
    if (el) el.addEventListener("mousemove", handleMouse);
    return () => { if (el) el.removeEventListener("mousemove", handleMouse); };
  }, []);

  const px = mousePos.x;
  const py = mousePos.y;

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: "#F5EDE3", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(0.85) rotate(0deg); }
          50%       { opacity: 1;   transform: scale(1.15) rotate(20deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(201,122,138,0.45); }
          70%  { box-shadow: 0 0 0 12px rgba(201,122,138,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,122,138,0); }
        }
        @keyframes caretBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes textShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pillBounce {
          0%   { opacity: 0; transform: translateY(18px) scale(0.88); }
          60%  { opacity: 1; transform: translateY(-5px) scale(1.04); }
          80%  { transform: translateY(3px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pillFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes glowBreathe {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.06); }
        }
        @keyframes frameSweep {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes photoReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }


        .scroll-btn:hover { background: #A85568 !important; transform: scale(1.04); }
        .scroll-btn { transition: background 0.25s ease, transform 0.2s ease; }

        @media (max-width: 767px) {
          .hero-photo-div {
            bottom: 1rem !important;
            width: clamp(140px, 48vw, 260px) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: clamp(4rem, 18vw, 7rem) !important;
          }
          .hero-frame {
            bottom: 1rem !important;
            width: clamp(140px, 48vw, 260px) !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: clamp(4rem, 18vw, 7rem) !important;
          }
          .hero-name-pill, .hero-role-pill, .hero-right-col { display: none !important; }
        }
      `}</style>

      {/* ── Radial glow blobs ── */}
      <div style={{
        position: "absolute", top: "-8rem", right: "-6rem",
        width: "clamp(260px, 40vw, 560px)", aspectRatio: "1",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,160,173,0.22) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
        transform: `translate(${px * -14}px, ${py * -9}px)`,
        transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
      }} />
      <div style={{
        position: "absolute", bottom: "6rem", left: "-5rem",
        width: "clamp(180px, 24vw, 380px)", aspectRatio: "1",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(168,85,104,0.12) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
        transform: `translate(${px * 9}px, ${py * 7}px)`,
        transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)",
      }} />

      {/* ── Glow behind headline — fades in after move ── */}
      <div style={{
        position: "absolute",
        top: "clamp(2rem, 6vw, 6rem)", left: "50%",
        transform: "translateX(-50%)",
        width: "clamp(300px, 60vw, 700px)", height: "clamp(80px, 18vw, 200px)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(201,122,138,0.18) 0%, transparent 70%)",
        zIndex: 0, pointerEvents: "none",
        opacity: glowPulse ? 1 : 0,
        transition: "opacity 1.2s ease",
        animation: glowPulse ? "glowBreathe 3.5s ease-in-out infinite" : "none",
      }} />

      {/* ── MAIN CONTENT ── */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", zIndex: 1 }}>

        {/* ── Top nav row ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.6rem 5% 0",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
        }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            border: "1.5px solid rgba(61,26,36,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Georgia', serif",
            fontSize: "0.9rem", fontWeight: 700, color: "#3D1A24",
          }}>
            {(config.name || "T").slice(0, 1)}
          </div>
        </div>

        <div
          className="font-display font-black"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: "clamp(3rem, 13vw, 11rem)",
            letterSpacing: "0.01em",
            lineHeight: 1,
            zIndex: 6,

            /* Position: center screen → top of hero */
            top: movedUp ? "clamp(3.2rem, 7.5vw, 7.5rem)" : "50%",
            transform: movedUp ? "translateY(0)" : "translateY(-50%)",
            transition: movedUp
              ? "top 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1)"
              : "none",

            /* Fade in when typing starts */
            opacity: typedText.length > 0 ? 1 : 0,
            /* Smooth fade-in on first char */
            ...(typedText.length === 1 ? { transition: "opacity 0.3s ease" } : {}),

            /* Shimmer once moved up */
            background: movedUp
              ? "linear-gradient(90deg, #3D1A24 30%, #C97A8A 50%, #3D1A24 70%)"
              : "none",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: movedUp ? "text" : "unset",
            WebkitTextFillColor: movedUp ? "transparent" : "#3D1A24",
            color: movedUp ? "transparent" : "#3D1A24",
            animation: movedUp ? "textShimmer 3.5s linear 0.8s infinite" : "none",
          }}
        >
          {typedText}
          {/* Blinking caret while typing */}
          {!typingDone && typedText.length > 0 && (
            <span style={{
              display: "inline-block",
              width: "clamp(3px, 0.9vw, 8px)",
              height: "0.82em",
              background: "#C97A8A",
              marginLeft: "4px",
              verticalAlign: "middle",
              borderRadius: "2px",
              animation: "caretBlink 0.7s step-start infinite",
            }} />
          )}
        </div>

        {/* ── Accent frame behind photo — only shows after move ── */}
        <div
          className="hero-frame"
          style={{
            position: "absolute",
            top: "clamp(7rem, 17vw, 13.5rem)",
            left: "clamp(110px, 13vw, 195px)",
            width: "clamp(200px, 28vw, 380px)",
            bottom: "clamp(-20px, -2vw, -30px)",
            zIndex: 4,
            borderRadius: "0.75rem 0.75rem 0 0",
            overflow: "hidden",
            opacity: movedUp ? 1 : 0,
            transform: movedUp
              ? `perspective(900px) rotateY(${px * 1.8}deg) rotateX(${py * -1.2}deg) translateY(0)`
              : "perspective(900px) scale(0.9) translateY(20px)",
            transition: movedUp
              ? "opacity 0.9s ease 0.2s, transform 0.5s cubic-bezier(0.16,1,0.3,1)"
              : "opacity 0.3s ease, transform 0.5s ease",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "#d8b791" }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "frameSweep 3.5s ease-in-out infinite 1.2s",
          }} />
        </div>

        {/* ── Profile photo — only shows after move ── */}
        <div
          className="hero-photo-div"
          style={{
            position: "absolute",
            top: "clamp(7rem, 17vw, 13.5rem)",
            left: "clamp(110px, 13vw, 195px)",
            width: "clamp(200px, 28vw, 380px)",
            bottom: "clamp(-20px, -2vw, -30px)",
            zIndex: 5,
            opacity: movedUp ? 1 : 0,
            transform: movedUp
              ? `perspective(900px) rotateY(${px * 1.8}deg) rotateX(${py * -1.2}deg) translateY(0)`
              : "perspective(900px) translateY(24px)",
            transition: movedUp
              ? "opacity 1s ease 0.35s, transform 0.5s cubic-bezier(0.16,1,0.3,1)"
              : "opacity 0.3s ease, transform 0.5s ease",
          }}
        >
          <img
            src={profilePhoto}
            alt={config.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top center",
              borderRadius: "0.75rem 0.75rem 0 0",
              display: "block",
              filter: "brightness(0.93) saturate(0.87)",
              animation: movedUp ? "photoReveal 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both" : "none",
            }}
          />
          <div style={{
            position: "absolute", inset: 0,
            borderRadius: "0.75rem 0.75rem 0 0",
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: "-4px",
            borderRadius: "0.9rem 0.9rem 0 0",
            border: `2px solid rgba(201,122,138,${0.15 + Math.abs(px) * 0.2 + Math.abs(py) * 0.15})`,
            pointerEvents: "none",
            transition: "border-color 0.4s ease",
          }} />
        </div>



        {/* ── Stars — only shows after move ── */}
        {[
          { top: "18%", left: "3.5%", size: "1.8rem", color: "#C97A8A", delay: "0.3s" },
          { top: "35%", left: "5.5%", size: "1.1rem", color: "#A85568", delay: "0.5s" },
          { top: "12%", left: "8.5%", size: "0.65rem", color: "#D4A0AD", delay: "0.7s" },
          { top: "22%", right: "5%", size: "0.75rem", color: "rgba(61,26,36,0.2)", delay: "0.4s" },
          { bottom: "30%", right: "7%", size: "1.3rem", color: "rgba(201,122,138,0.45)", delay: "0.6s" },
        ].map((s, i) => (
          <span key={i} style={{
            position: "absolute",
            top: s.top, left: s.left, right: s.right, bottom: s.bottom,
            fontSize: s.size, color: s.color, zIndex: 3,
            opacity: movedUp ? 1 : 0,
            transition: `opacity 0.5s ease ${s.delay}`,
            animation: `twinkle ${2.2 + i * 0.3}s ease-in-out infinite ${s.delay}`,
          }}>✦</span>
        ))}

        {/* ── Ghost outline text — only shows after move ── */}
        <div
          className="font-display font-black select-none pointer-events-none"
          style={{
            position: "absolute",
            top: "clamp(3.2rem, 7.5vw, 7.5rem)",
            left: 0, right: 0,
            textAlign: "center",
            fontSize: "clamp(3rem, 13vw, 11rem)",
            lineHeight: 1,
            letterSpacing: "0.01em",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(61,26,36,0.18)",
            zIndex: 2,
            opacity: movedUp ? 1 : 0,
            transition: "opacity 1.4s ease 0.4s",
          }}
        >
          <div>PORTFOLIO</div>
          <div>PORTFOLIO</div>
          <div>PORTFOLIO</div>
        </div>

        {/* ── Right-side stats column ── */}
        <div
          className="hero-right-col"
          style={{
            position: "absolute",
            top: "clamp(12rem, 30vw, 22rem)",
            right: "5%",
            display: "flex",
            flexDirection: "column",
            gap: "1.6rem",
            zIndex: 7,
            opacity: movedUp ? 1 : 0,
            transform: movedUp ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.8s ease 0.6s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s",
          }}
        >
          <div style={{ height: "1px", background: "rgba(61,26,36,0.1)", width: "50px", marginLeft: "auto" }} />
        </div>

        <div style={{ minHeight: "calc(100vh - 160px)" }} />
      </div>

      {/* ── Marquee strip ── */}
      <div style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(61,26,36,0.08)",
        padding: "0.55rem 0",
        background: "#EDE0D0",
        zIndex: 10, position: "relative",
        opacity: movedUp ? 1 : 0,
        transition: "opacity 0.6s ease 0.9s",
      }}>
        <div style={{
          display: "flex", gap: "0",
          width: "max-content",
          animation: "marquee 20s linear infinite",
        }}>
          {[...Array(12)].map((_, i) => (
            <span key={i} style={{
              fontSize: "0.62rem", fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: i % 2 === 0 ? "rgba(61,26,36,0.38)" : "#C97A8A",
              whiteSpace: "nowrap",
              padding: "0 2rem",
            }}>
              {["Web Development", "✦", "UI/UX Design", "✦", "Mobile Apps", "✦", "React Developer", "✦", "Graphic Design", "✦", "Problem Solver", "✦"][i % 12]}
            </span>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div style={{
        background: "#EDE0D0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "1.2rem 5%",
        zIndex: 10, position: "relative",
        flexWrap: "wrap", gap: "0.5rem",
        opacity: movedUp ? 1 : 0,
        transition: "opacity 0.6s ease 0.8s",
      }}>
        <p style={{
          fontSize: "0.7rem", lineHeight: 1.6,
          color: "rgba(61,26,36,0.45)", fontStyle: "italic",
          maxWidth: "280px", margin: 0, flex: "1 1 160px",
        }}>
          {config.tagline}
        </p>

        <a href="#about" style={{
          textDecoration: "none", display: "flex",
          flexDirection: "column", alignItems: "center", gap: "0.35rem",
          flex: "0 0 auto",
        }}>
          <span
            className="scroll-btn"
            style={{
              background: "#C97A8A", color: "#FDF0F0",
              borderRadius: "9999px", padding: "0.65rem 2rem",
              fontSize: "0.74rem", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              display: "block",
              animation: "pulseRing 2.5s ease-out infinite 2.2s",
            }}
          >
            Scroll down
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
            style={{ color: "#A85568", opacity: 0.65 }}>
            <path d="M8 3v10M8 13l-4-4M8 13l4-4"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <span style={{
          fontSize: "1.1rem", color: "#C97A8A", flex: "0 0 auto",
          animation: "twinkle 2.4s ease-in-out infinite 0.5s",
        }}>✦</span>
      </div>
    </section>
  );
}