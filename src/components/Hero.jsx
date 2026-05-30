import React from "react";
import { config } from "../config";
import profilePhoto from "../assets/tanny.png";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{ background: "#3a4a2e", minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <style>{`
        @media (max-width: 767px) {
          .hero-photo-div {
            bottom: 1rem !important;
            width: clamp(140px, 48vw, 260px) !important;
            left: 50% !important;
            transform: translateX(-50%);
            top: clamp(4rem, 18vw, 7rem) !important;
          }
          .hero-orange-frame {
            bottom: 1rem !important;
            width: clamp(140px, 48vw, 260px) !important;
            left: 50% !important;
            transform: translateX(-50%);
            top: clamp(4rem, 18vw, 7rem) !important;
          }
        }
      `}</style>

      {/* ========== MAIN AREA ========== */}
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* --- Orange frame --- */}
        <div
          className="hero-orange-frame"
          style={{
            position: "absolute",
            top: "clamp(5rem, 14vw, 12rem)",
            left: "clamp(110px, 13vw, 195px)",
            width: "clamp(200px, 28vw, 380px)",
            bottom: "clamp(-20px, -2vw, -30px)",
            background: "#c47d2a",
            zIndex: 4,
            borderRadius: "0.5rem 0.5rem 0 0",
          }}
        />

        {/* --- Gold stars --- */}
        <span style={{
          position: "absolute", top: "18%", left: "3%",
          fontSize: "2rem", color: "#f5c842",
          zIndex: 3, animation: "pulse 2s infinite"
        }}>✦</span>
        <span style={{
          position: "absolute", top: "34%", left: "5%",
          fontSize: "1.2rem", color: "#f5c842",
          zIndex: 3, animation: "pulse 2s infinite", animationDelay: "0.7s"
        }}>✦</span>

        {/* --- PORTFOLIO headline --- */}
        <div
          className="font-display font-black"
          style={{
            position: "absolute",
            top: "clamp(1.5rem, 5vw, 8rem)",
            left: 0, right: 0,
            textAlign: "center",
            fontSize: "clamp(2.8rem, 12vw, 10rem)",
            color: "var(--cream, #f0ece0)",
            letterSpacing: "0.01em",
            lineHeight: 1,
            zIndex: 6,
            animation: "fadeUp 0.9s ease both",
          }}
        >
          PORTFOLIO
        </div>

        {/* --- Profile photo --- */}
        <div
          className="hero-photo-div"
          style={{
            position: "absolute",
            top: "clamp(5rem, 14vw, 12rem)",
            left: "clamp(110px, 13vw, 195px)",
            width: "clamp(200px, 28vw, 380px)",
            bottom: "clamp(-20px, -2vw, -30px)",
            zIndex: 5,
            animation: "fadeIn 1s ease both",
            animationDelay: "0.3s",
          }}
        >
          <img
            src={profilePhoto}
            alt={config.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
              borderRadius: "0.5rem 0.5rem 0 0",
              display: "block",
              filter: "brightness(0.85) saturate(0.85)",
            }}
          />
        </div>

        {/* --- Ghost outline text --- */}
        <div
          className="font-display font-black select-none pointer-events-none"
          style={{
            position: "absolute",
            top: "clamp(1.5rem, 5vw, 8rem)",
            left: 0, right: 0,
            textAlign: "center",
            fontSize: "clamp(2.8rem, 12vw, 10rem)",
            lineHeight: 1,
            letterSpacing: "0.01em",
            color: "transparent",
            WebkitTextStroke: "1.5px rgba(240,200,80,0.45)",
            zIndex: 2,
          }}
        >
          <div>PORTFOLIO</div>
          <div>PORTFOLIO</div>
          <div>PORTFOLIO</div>
        </div>

        {/* Spacer */}
        <div style={{ minHeight: "calc(100vh - 120px)" }} />
      </div>

      {/* ========== BLACK BOTTOM BAR ========== */}
      <div
        style={{
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem 5%",
          zIndex: 10,
          position: "relative",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <p style={{
          fontSize: "0.7rem", lineHeight: 1.6,
          color: "rgba(240,236,224,0.65)", fontStyle: "italic",
          maxWidth: "260px", margin: 0, flex: "1 1 140px",
        }}>
          {config.tagline}
        </p>

        <a href="#about" style={{
          textDecoration: "none", display: "flex",
          flexDirection: "column", alignItems: "center", gap: "0.4rem",
          flex: "0 0 auto",
        }}>
          <span style={{
            background: "#f5c842", color: "#1a1a18",
            borderRadius: "9999px", padding: "0.6rem 1.8rem",
            fontSize: "0.8rem", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            Scroll down
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "#f5c842", opacity: 0.8 }}>
            <path d="M8 3v10M8 13l-4-4M8 13l4-4"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <span style={{ fontSize: "1.2rem", color: "#f5c842", flex: "0 0 auto" }}>✦</span>
      </div>
    </section>
  );
}