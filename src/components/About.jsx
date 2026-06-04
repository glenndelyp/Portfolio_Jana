import React, { useRef, useState, useEffect, useCallback } from "react";
import { config } from "../config";
import profilePhoto from "../assets/tanny.png";

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// ── Typing cursor hook ──
function useTypingCursor(fullText, inView, delay = 400) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!inView) return;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, 55);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [inView, fullText, delay]);
  return { displayed, done };
}

// ── Magnetic icon ──
function MagneticIcon({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: offset.x === 0 && offset.y === 0
          ? "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)"
          : "transform 0.1s linear",
        display: "inline-flex",
      }}
    >
      {children}
    </div>
  );
}

// ── Tilt card ──
function TiltCard({ children, style }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, shine: { x: 50, y: 50 } });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({
      x: y * -10,
      y: x * 10,
      shine: {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      },
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, shine: { x: 50, y: 50 } });
    setHovered(false);
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
        transition: hovered
          ? "transform 0.12s linear"
          : "transform 0.6s cubic-bezier(0.34,1.2,0.64,1)",
        position: "relative",
      }}
    >
      {children}
      {/* Shine overlay */}
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: "0.75rem",
        background: `radial-gradient(circle at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(255,255,255,0.13) 0%, transparent 65%)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
        zIndex: 10,
      }} />
    </div>
  );
}

// ── Staggered word reveal ──
function StaggeredHeading({ line1, line2, name, inView }) {
  const words1 = line1.split(" ");
  const words2 = line2.split(" ");

  return (
    <h2 style={{
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
      fontWeight: 700, lineHeight: 1.1,
      color: "#3D1A24", margin: "0 0 1.8rem",
      overflow: "hidden",
    }}>
      {/* Line 1 words */}
      <span style={{ display: "block", overflow: "hidden" }}>
        {words1.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.3em",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(110%)",
              transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.08}s`,
            }}
          >
            {word}
          </span>
        ))}
      </span>

      {/* Line 2 — "I'm [name]!" */}
      <span style={{ display: "block", overflow: "hidden" }}>
        {words2.map((word, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.3em",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(110%)",
              transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.08}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.08}s`,
            }}
          >
            {word === name ? (
              <em style={{ color: "#3D1A24", fontStyle: "italic" }}>{word}</em>
            ) : word}
          </span>
        ))}
        {/* Cursor blink after name */}
        <span style={{
          display: "inline-block",
          width: "3px", height: "0.85em",
          background: "#C97A8A",
          marginLeft: "2px",
          verticalAlign: "middle",
          borderRadius: "1px",
          opacity: inView ? 1 : 0,
          animation: inView ? "cursorBlink 1s step-end infinite 1.2s" : "none",
          transition: "opacity 0.3s ease 1.2s",
        }} />
      </span>
    </h2>
  );
}

export default function About() {
  const { socials } = config;
  const [sectionRef, sectionInView] = useInView();
  const name = config.name || "Glenn";

  const styles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes cursorBlink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .about-pill {
      animation: float 3s ease-in-out infinite;
    }

    #about-grid {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    #about-section {
      padding: 3rem 5% 4rem;
    }

    .about-photo-col {
      position: relative;
      width: 100%;
    }
    .about-photo-card {
      position: relative;
      width: 70%;
      margin: 0 auto;
    }

    .about-pill-location {
      position: absolute;
      top: 10%;
      left: -2%;
      background: #C97A8A;
      color: #FDF0F0;
      border-radius: 9999px;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      z-index: 5;
      box-shadow: 0 4px 16px rgba(61,26,36,0.15);
    }
    .about-pill-role {
      position: absolute;
      bottom: 10%;
      right: -2%;
      background: #C97A8A;
      color: #FDF0F0;
      border-radius: 9999px;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      z-index: 5;
      box-shadow: 0 4px 16px rgba(61,26,36,0.15);
      animation-delay: 1.5s;
    }

    @media (min-width: 768px) {
      #about-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
      }

      #about-section {
        padding: 5rem 6% 6rem;
      }

      .about-photo-card {
        width: 90%;
        margin-left: auto;
        margin-right: 0;
      }

      .about-pill-location {
        top: 22%;
        left: 0;
        font-size: 0.8rem;
        padding: 0.55rem 1.3rem;
      }

      .about-pill-role {
        bottom: 28%;
        right: -5%;
        font-size: 0.8rem;
        padding: 0.55rem 1.3rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <section
        id="about"
        style={{
          background: "#F5EDE3",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost background text */}
        <div style={{
          position: "absolute", bottom: "-2rem", right: "-1rem",
          fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
          color: "transparent", WebkitTextStroke: "1.5px rgba(61,26,36,0.08)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
          letterSpacing: "0.02em",
        }}>ABOUT</div>

        <div id="about-section" style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
            <span style={{ color: "#C97A8A", fontSize: "1.2rem" }}>✦</span>
            <span style={{
              fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(61,26,36,0.5)", fontWeight: 600,
            }}>01 — About Me</span>
          </div>

          {/* Main grid */}
          <div id="about-grid" ref={sectionRef}>

            {/* LEFT — Intro text */}
            <div>
              {/* ── STAGGERED HEADING ── */}
              <StaggeredHeading
                line1="Hello,"
                line2={`I'm ${name}!`}
                name={name}
                inView={sectionInView}
              />

              {/* Bio paragraph — fade in */}
              <p style={{
                fontSize: "1rem", lineHeight: 1.8,
                color: "rgba(61,26,36,0.6)", maxWidth: "420px",
                marginBottom: "2rem",
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
              }}>
                {config.about?.bio || "A passionate creative based in the Philippines."}
              </p>

              {/* ── MAGNETIC SOCIAL ICONS ── */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "1.8rem", flexWrap: "wrap",
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.7s ease 0.75s, transform 0.7s ease 0.75s",
              }}>
                {socials?.linkedin && (
                  <MagneticIcon strength={0.4}>
                    <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                      style={socialIconStyle}
                      onMouseEnter={e => { e.currentTarget.style.background = "#0A66C2"; e.currentTarget.style.borderColor = "#0A66C2"; e.currentTarget.querySelector("svg").style.fill = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(61,26,36,0.2)"; e.currentTarget.querySelector("svg").style.fill = "rgba(61,26,36,0.5)"; }}
                    >
                      <svg viewBox="0 0 24 24" style={svgStyle}>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </MagneticIcon>
                )}
                {socials?.github && (
                  <MagneticIcon strength={0.4}>
                    <a href={socials.github} target="_blank" rel="noopener noreferrer" title="GitHub"
                      style={socialIconStyle}
                      onMouseEnter={e => { e.currentTarget.style.background = "#24292e"; e.currentTarget.style.borderColor = "#24292e"; e.currentTarget.querySelector("svg").style.fill = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(61,26,36,0.2)"; e.currentTarget.querySelector("svg").style.fill = "rgba(61,26,36,0.5)"; }}
                    >
                      <svg viewBox="0 0 24 24" style={svgStyle}>
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  </MagneticIcon>
                )}
                {socials?.instagram && (
                  <MagneticIcon strength={0.4}>
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer" title="Instagram"
                      style={socialIconStyle}
                      onMouseEnter={e => { e.currentTarget.style.background = "#E1306C"; e.currentTarget.style.borderColor = "#E1306C"; e.currentTarget.querySelector("svg").style.fill = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(61,26,36,0.2)"; e.currentTarget.querySelector("svg").style.fill = "rgba(61,26,36,0.5)"; }}
                    >
                      <svg viewBox="0 0 24 24" style={svgStyle}>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                      </svg>
                    </a>
                  </MagneticIcon>
                )}
              </div>

              {/* Resume button */}
              <div style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.7s ease 0.9s, transform 0.7s ease 0.9s",
              }}>
                <a
                  href={config.about?.resumeUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "#3D1A24",
                    border: "1.5px solid #3D1A24",
                    color: "#F5EDE3",
                    borderRadius: "9999px",
                    padding: "0.7rem 1.8rem",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textDecoration: "none",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#C97A8A";
                    e.currentTarget.style.borderColor = "#C97A8A";
                    e.currentTarget.style.color = "#FDF0F0";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#3D1A24";
                    e.currentTarget.style.borderColor = "#3D1A24";
                    e.currentTarget.style.color = "#F5EDE3";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13M5 16l7 7 7-7M3 21h18" />
                  </svg>
                  Download CV
                </a>
              </div>
            </div>

            {/* RIGHT — Tilt photo card */}
            <div
              className="about-photo-col"
              style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateX(0)" : "translateX(40px)",
                transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
              }}
            >
              {/* ── TILT CARD WRAPPER ── */}
              <TiltCard style={{ width: "100%" }}>
                <div className="about-photo-card">
                  {/* Deep rose backdrop */}
                  <div style={{
                    position: "absolute", top: "1.2rem", left: "-1.2rem",
                    right: "1.2rem", bottom: "-1.2rem",
                    background: "#3D1A24", borderRadius: "0.75rem", zIndex: 0,
                  }} />
                  {/* Circle accent */}
                  <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "55%", aspectRatio: "1",
                    background: "#F7D4D4", borderRadius: "9999px",
                    zIndex: 1, opacity: 0.15,
                  }} />
                  <img
                    src={profilePhoto}
                    alt={config.name}
                    style={{
                      position: "relative", width: "100%",
                      aspectRatio: "3/4", objectFit: "cover",
                      objectPosition: "top center", borderRadius: "0.75rem",
                      display: "block", zIndex: 2,
                      filter: "brightness(0.92) saturate(0.88)",
                    }}
                  />
                </div>
              </TiltCard>

              {/* Floating pill — location */}
              <div className="about-pill about-pill-location">
                {config.about?.location || "Philippines 🇵🇭"}
              </div>

              {/* Floating pill — role */}
              <div className="about-pill about-pill-role">
                {config.about?.role || "Graphic Designer"}
              </div>

              {/* Accent star */}
              <span style={{
                position: "absolute", top: "-1rem", right: "5%",
                fontSize: "1.8rem", color: "#C97A8A", zIndex: 5,
              }}>✦</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const socialIconStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "40px", height: "40px",
  border: "1px solid rgba(61,26,36,0.2)", borderRadius: "50%",
  background: "transparent", textDecoration: "none",
  transition: "all 0.25s ease", flexShrink: 0,
};

const svgStyle = {
  width: "18px", height: "18px",
  fill: "rgba(61,26,36,0.5)",
  transition: "fill 0.25s ease", display: "block",
};