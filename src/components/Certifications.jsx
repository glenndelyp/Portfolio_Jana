import React, { useState, useEffect } from "react";
import { config } from "../config";

function Modal({ cert, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(32px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141a0f",
          border: `1px solid ${cert.color}30`,
          borderRadius: "1.5rem",
          overflow: "hidden",
          maxWidth: "600px", width: "100%",
          maxHeight: "88vh", overflowY: "auto",
          animation: "slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1)",
          boxShadow: `0 48px 120px rgba(0,0,0,0.6), 0 0 80px ${cert.color}15`,
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{ height: "3px", background: `linear-gradient(90deg, ${cert.color || "#f5c842"} 0%, transparent 100%)` }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1.1rem", right: "1.1rem", zIndex: 10,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "50%", width: "34px", height: "34px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "rgba(240,236,224,0.5)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${cert.color}25`; e.currentTarget.style.color = cert.color || "#f5c842"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(240,236,224,0.5)"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        {/* Certificate image */}
        {cert.image && (
          <div style={{ padding: "1.75rem 1.75rem 1.25rem", background: `${cert.color}08` }}>
            <img
              src={cert.image} alt={cert.name}
              style={{ width: "100%", borderRadius: "0.75rem", display: "block", border: "1px solid rgba(255,255,255,0.07)" }}
            />
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "1.5rem 1.75rem 2rem" }}>
          {/* Issuer pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            background: `${cert.color}15`, border: `1px solid ${cert.color}30`,
            borderRadius: "2rem", padding: "0.22rem 0.75rem", marginBottom: "0.85rem",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cert.color || "#f5c842" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", color: cert.color || "#f5c842", textTransform: "uppercase" }}>
              {cert.issuer}
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(1.25rem, 3vw, 1.7rem)",
            fontWeight: 700, color: "#f0ece0", lineHeight: 1.2, margin: "0 0 1.25rem",
          }}>
            {cert.name}
          </h2>

          {/* Meta */}
          <div style={{
            display: "flex", gap: "2rem",
            padding: "0.9rem 0", marginBottom: "1.5rem",
            borderTop: "1px solid rgba(240,236,224,0.07)",
            borderBottom: "1px solid rgba(240,236,224,0.07)",
          }}>
            {cert.year && (
              <div>
                <p style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,236,224,0.3)", margin: "0 0 0.2rem" }}>Issued</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f0ece0", margin: 0 }}>{cert.year}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,236,224,0.3)", margin: "0 0 0.2rem" }}>Status</p>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#4ade80", margin: 0, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Verified
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap" }}>
            {cert.credentialUrl && cert.credentialUrl !== "#" && (
              <a
                href={cert.credentialUrl} target="_blank" rel="noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.45rem",
                  background: cert.color || "#f5c842", color: "#0f0d08",
                  padding: "0.6rem 1.2rem", borderRadius: "2rem",
                  fontSize: "0.8rem", fontWeight: 700, textDecoration: "none",
                  letterSpacing: "0.03em", transition: "opacity 0.2s, transform 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                View Credential
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            )}
            <button
              onClick={onClose}
              style={{
                display: "inline-flex", alignItems: "center",
                background: "transparent", border: "1px solid rgba(240,236,224,0.12)",
                color: "rgba(240,236,224,0.45)", padding: "0.6rem 1.2rem",
                borderRadius: "2rem", fontSize: "0.8rem", fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(240,236,224,0.3)"; e.currentTarget.style.color = "rgba(240,236,224,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(240,236,224,0.12)"; e.currentTarget.style.color = "rgba(240,236,224,0.45)"; }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CertCard({ cert, index, onClick }) {
  const [hovered, setHovered] = useState(false);
  const accentColor = cert.color || "#f5c842";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "rgba(20,26,15,0.95)" : "rgba(15,20,10,0.7)",
        border: `1px solid ${hovered ? `${accentColor}45` : "rgba(240,236,224,0.08)"}`,
        borderRadius: "1.25rem",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.35), 0 0 0 1px ${accentColor}15` : "none",
      }}
    >
      {/* Top color accent bar */}
      <div style={{
        height: "2px",
        background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.3s",
      }} />

      {/* Card number */}
      <div style={{
        position: "absolute", top: "0.85rem", right: "1rem",
        fontSize: "0.6rem", letterSpacing: "0.15em",
        color: `${accentColor}40`, fontWeight: 700, zIndex: 2,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Image */}
      <div style={{
        width: "100%", aspectRatio: "16/9",
        background: `${accentColor}0d`,
        overflow: "hidden", position: "relative", flexShrink: 0,
      }}>
        {cert.image ? (
          <img
            src={cert.image} alt={cert.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transition: "transform 0.4s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "0.5rem",
          }}>
            <div style={{
              width: "42px", height: "42px", borderRadius: "50%",
              border: `1.5px solid ${accentColor}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" opacity="0.4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <span style={{ fontSize: "0.58rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(240,236,224,0.18)" }}>
              Certificate
            </span>
          </div>
        )}
        {/* Hover overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to top, ${accentColor}18, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
          pointerEvents: "none",
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: "1.1rem 1.25rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.55rem", flex: 1 }}>
        {/* Issuer pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.35rem",
          background: `${accentColor}12`, border: `1px solid ${accentColor}25`,
          borderRadius: "2rem", padding: "0.18rem 0.6rem", width: "fit-content",
        }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: accentColor, flexShrink: 0 }} />
          <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", color: accentColor, textTransform: "uppercase" }}>
            {cert.issuer}
          </span>
        </div>

        <h3 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "0.98rem", fontWeight: 700,
          color: "#f0ece0", lineHeight: 1.35, margin: 0,
        }}>
          {cert.name}
        </h3>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem" }}>
          {cert.year && (
            <span style={{ fontSize: "0.68rem", color: "rgba(240,236,224,0.3)", letterSpacing: "0.08em", fontWeight: 500 }}>
              {cert.year}
            </span>
          )}
          {/* Expand hint */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.3rem",
            color: hovered ? accentColor : "rgba(240,236,224,0.2)",
            fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase",
            fontWeight: 600, transition: "color 0.3s",
          }}>
            View
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  const [activeCert, setActiveCert] = useState(null);
  const hasCerts = config.certifications && config.certifications.length > 0;

  return (
    <section
      id="certifications"
      style={{
        background: "linear-gradient(160deg, #2a3820 0%, #1e2c16 60%, #283620 100%)",
        padding: "6rem 6% 7rem",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Dot texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(245,200,66,0.05) 1px, transparent 1px)",
        backgroundSize: "30px 30px", pointerEvents: "none",
      }} />

      {/* Ghost text */}
      <div style={{
        position: "absolute", bottom: "-2rem", right: "-1rem",
        fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
        fontFamily: "'Georgia', serif", color: "transparent",
        WebkitTextStroke: "1px rgba(245,200,66,0.06)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>
        CERTS
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <span style={{ color: "#f5c842", fontSize: "1.2rem" }}>✦</span>
          <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(240,236,224,0.4)", fontWeight: 600 }}>
            04 — Certifications
          </span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "3.5rem" }}>
          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.05, color: "#f0ece0", margin: "0 0 0.9rem",
          }}>
            Licenses &{" "}
            <em style={{ color: "#f5c842", fontStyle: "italic" }}>Certificates</em>
          </h2>
          <p style={{
            fontSize: "0.88rem", color: "rgba(240,236,224,0.38)",
            maxWidth: "360px", lineHeight: 1.7, margin: 0,
          }}>
            Credentials earned through dedication and continuous learning.{" "}
            <span style={{ color: "rgba(245,200,66,0.45)" }}>Click any card to expand.</span>
          </p>
        </div>

        {hasCerts ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "1.1rem",
          }}>
            {config.certifications.map((cert, i) => (
              <CertCard key={i} cert={cert} index={i} onClick={() => setActiveCert(cert)} />
            ))}
          </div>
        ) : (
          <div style={{
            border: "1px dashed rgba(240,236,224,0.1)",
            borderRadius: "1.25rem", padding: "4rem 2rem",
            textAlign: "center", color: "rgba(240,236,224,0.25)",
          }}>
            <p style={{ fontWeight: 500, marginBottom: "0.4rem" }}>No certifications yet</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>Add items to the <code>certifications</code> array in <code>config.js</code></p>
          </div>
        )}
      </div>

      {activeCert && <Modal cert={activeCert} onClose={() => setActiveCert(null)} />}
    </section>
  );
}