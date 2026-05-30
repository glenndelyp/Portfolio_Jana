import React, { useRef, useState, useEffect } from "react";
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

export default function About() {
  const { socials } = config;
  const [sectionRef, sectionInView] = useInView();

  const styles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .about-pill {
      animation: float 3s ease-in-out infinite;
    }

    /* ── MOBILE ─────────────────────────────────────── */
    #about-grid {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    #about-section {
      padding: 3rem 5% 4rem;
    }

    /* photo card: full width, reasonable height */
    .about-photo-col {
      position: relative;
      width: 100%;
    }
    .about-photo-card {
      position: relative;
      width: 70%;
      margin: 0 auto;
    }

    /* pills pushed inward on mobile so they don't escape the screen */
    .about-pill-location {
      position: absolute;
      top: 10%;
      left: -2%;
      background: #f5c842;
      color: #1a1a14;
      border-radius: 9999px;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      z-index: 5;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }
    .about-pill-role {
      position: absolute;
      bottom: 10%;
      right: -2%;
      background: #f5c842;
      color: #1a1a14;
      border-radius: 9999px;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      z-index: 5;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      animation-delay: 1.5s;
    }

    /* ── DESKTOP (≥ 768px) ──────────────────────────── */
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
          background: "#f0ece0",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ghost background text */}
        <div style={{
          position: "absolute", bottom: "-2rem", right: "-1rem",
          fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
          color: "transparent", WebkitTextStroke: "1.5px rgba(32,42,24,0.1)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
          letterSpacing: "0.02em",
        }}>ABOUT</div>

        <div id="about-section" style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* Section label */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
            <span style={{ color: "#c47d2a", fontSize: "1.2rem" }}>✦</span>
            <span style={{
              fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#3a4a2e", fontWeight: 600,
            }}>01 — About Me</span>
          </div>

          {/* Main grid */}
          <div
            id="about-grid"
            ref={sectionRef}
          >
            {/* LEFT — Intro text */}
            <div
              style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <h2 style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                fontWeight: 700, lineHeight: 1.05,
                color: "#1a1a14", margin: "0 0 1.8rem",
              }}>
                Hello,<br />
                I'm <em style={{ color: "#3a4a2e", fontStyle: "italic" }}>{config.name}</em>!
              </h2>

              <p style={{
                fontSize: "1rem", lineHeight: 1.8,
                color: "rgba(30,28,22,0.7)", maxWidth: "420px",
                marginBottom: "2rem",
              }}>
                {config.about?.bio || "A passionate creative based in the Philippines."}
              </p>

              {/* Socials row */}
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                marginBottom: "1.8rem", flexWrap: "wrap",
              }}>
                {socials?.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"
                    style={socialIconStyle}
                    onMouseEnter={e => { e.currentTarget.style.background = "#0A66C2"; e.currentTarget.style.borderColor = "#0A66C2"; e.currentTarget.querySelector("svg").style.fill = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(30,28,22,0.25)"; e.currentTarget.querySelector("svg").style.fill = "rgba(30,28,22,0.6)"; }}
                  >
                    <svg viewBox="0 0 24 24" style={svgStyle}>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                )}
                {socials?.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" title="GitHub"
                    style={socialIconStyle}
                    onMouseEnter={e => { e.currentTarget.style.background = "#24292e"; e.currentTarget.style.borderColor = "#24292e"; e.currentTarget.querySelector("svg").style.fill = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(30,28,22,0.25)"; e.currentTarget.querySelector("svg").style.fill = "rgba(30,28,22,0.6)"; }}
                  >
                    <svg viewBox="0 0 24 24" style={svgStyle}>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                )}
                {socials?.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" title="Instagram"
                    style={socialIconStyle}
                    onMouseEnter={e => { e.currentTarget.style.background = "#E1306C"; e.currentTarget.style.borderColor = "#E1306C"; e.currentTarget.querySelector("svg").style.fill = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(30,28,22,0.25)"; e.currentTarget.querySelector("svg").style.fill = "rgba(30,28,22,0.6)"; }}
                  >
                    <svg viewBox="0 0 24 24" style={svgStyle}>
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Resume button */}
              <a
                href={config.about?.resumeUrl || "#"}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#3a4a2e",
                  border: "1.5px solid #3a4a2e",
                  color: "#f0ece0",
                  borderRadius: "9999px",
                  padding: "0.7rem 1.8rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#f5c842";
                  e.currentTarget.style.borderColor = "#f5c842";
                  e.currentTarget.style.color = "#1a1a14";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#3a4a2e";
                  e.currentTarget.style.borderColor = "#3a4a2e";
                  e.currentTarget.style.color = "#f0ece0";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13M5 16l7 7 7-7M3 21h18" />
                </svg>
                Download CV
              </a>
            </div>

            {/* RIGHT — Photo card + floating chips */}
            <div
              className="about-photo-col"
              style={{
                opacity: sectionInView ? 1 : 0,
                transform: sectionInView ? "translateX(0)" : "translateX(40px)",
                transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s",
              }}
            >
              <div className="about-photo-card">
                {/* Green backdrop */}
                <div style={{
                  position: "absolute", top: "1.2rem", left: "-1.2rem",
                  right: "1.2rem", bottom: "-1.2rem",
                  background: "#3a4a2e", borderRadius: "0.75rem", zIndex: 0,
                }} />
                {/* Circle accent */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "55%", aspectRatio: "1",
                  background: "#f0ece0", borderRadius: "9999px",
                  zIndex: 1, opacity: 0.2,
                }} />
                <img
                  src={profilePhoto}
                  alt={config.name}
                  style={{
                    position: "relative", width: "100%",
                    aspectRatio: "3/4", objectFit: "cover",
                    objectPosition: "top center", borderRadius: "0.75rem",
                    display: "block", zIndex: 2,
                    filter: "brightness(0.9) saturate(0.9)",
                  }}
                />
              </div>

              {/* Floating pill — location */}
              <div className="about-pill about-pill-location">
                {config.about?.location || "Philippines 🇵🇭"}
              </div>

              {/* Floating pill — role */}
              <div className="about-pill about-pill-role">
                {config.about?.role || "Graphic Designer"}
              </div>

              {/* Gold star */}
              <span style={{
                position: "absolute", top: "-1rem", right: "5%",
                fontSize: "1.8rem", color: "#f5c842", zIndex: 5,
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
  border: "1px solid rgba(30,28,22,0.25)", borderRadius: "50%",
  background: "transparent", textDecoration: "none",
  transition: "all 0.25s ease", flexShrink: 0,
};

const svgStyle = {
  width: "18px", height: "18px",
  fill: "rgba(30,28,22,0.6)",
  transition: "fill 0.25s ease", display: "block",
};