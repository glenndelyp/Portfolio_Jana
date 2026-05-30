import React, { useRef, useState, useEffect } from "react";
import { config } from "../config";

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView();
  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered ? "#3a4a2e" : "#f0ece0",
        border: "1.5px solid rgba(58,74,46,0.15)",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        transition: "background 0.45s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease",
        transform: inView
          ? hovered ? "translateY(-6px)" : "translateY(0)"
          : "translateY(40px)",
        opacity: inView ? 1 : 0,
        transitionDelay: `${index * 0.1}s`,
        boxShadow: hovered
          ? "0 24px 64px rgba(58,74,46,0.25)"
          : "0 2px 16px rgba(58,74,46,0.07)",
      }}
    >
      {/* Top accent bar */}
      <div style={{
        height: "4px",
        background: hovered
          ? "linear-gradient(90deg, #f5c842, #c47d2a)"
          : "linear-gradient(90deg, #3a4a2e, #5a6e42)",
        flexShrink: 0,
        transition: "background 0.45s ease",
      }} />

      <div style={{ padding: "2rem 2rem 1.8rem", flex: 1, display: "flex", flexDirection: "column" }}>

        {/* Big number */}
        <span style={{
          fontFamily: "'Georgia', serif",
          fontSize: "4rem", fontWeight: 700, lineHeight: 1,
          color: hovered ? "rgba(245,200,66,0.18)" : "rgba(58,74,46,0.1)",
          transition: "color 0.45s ease",
          userSelect: "none",
          marginBottom: "0.75rem",
          display: "block",
        }}>{num}</span>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.3,
          color: hovered ? "#f0ece0" : "#1a1a14",
          marginBottom: "0.9rem",
          transition: "color 0.45s ease",
        }}>{project.title}</h3>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: hovered ? "rgba(245,200,66,0.25)" : "rgba(58,74,46,0.15)",
          marginBottom: "1rem",
          transition: "background 0.45s ease",
        }} />

        {/* Description */}
        {project.description && (
          <p style={{
            fontSize: "0.85rem", lineHeight: 1.75, flex: 1,
            color: hovered ? "rgba(240,236,224,0.65)" : "rgba(30,28,22,0.55)",
            transition: "color 0.45s ease",
          }}>{project.description}</p>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.2rem" }}>
            {project.tags.map((tag, i) => (
              <span key={i} style={{
                background: hovered ? "rgba(245,200,66,0.12)" : "rgba(58,74,46,0.08)",
                border: `1px solid ${hovered ? "rgba(245,200,66,0.35)" : "rgba(58,74,46,0.2)"}`,
                color: hovered ? "#f5c842" : "#3a4a2e",
                borderRadius: "9999px",
                padding: "0.2rem 0.7rem",
                fontSize: "0.65rem", letterSpacing: "0.06em", fontWeight: 600,
                textTransform: "uppercase",
                transition: "all 0.45s ease",
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div style={{
          marginTop: "1.5rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {project.link && project.link !== "#" ? (
            <a href={project.link} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: hovered ? "#f5c842" : "#c47d2a",
              textDecoration: "none",
              transition: "color 0.45s ease",
            }}>
              View Project
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ) : (
            <span style={{
              fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: hovered ? "rgba(245,200,66,0.45)" : "rgba(58,74,46,0.3)",
              fontWeight: 600,
              transition: "color 0.45s ease",
            }}>In Progress</span>
          )}

          {/* Rotating arrow circle */}
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            border: `1.5px solid ${hovered ? "rgba(245,200,66,0.5)" : "rgba(58,74,46,0.2)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.45s ease",
            transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
            background: hovered ? "rgba(245,200,66,0.08)" : "transparent",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={hovered ? "#f5c842" : "#3a4a2e"} strokeWidth={2}
              style={{ transition: "stroke 0.45s ease" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Corner gold dot on hover */}
      <div style={{
        position: "absolute", bottom: "1rem", left: "2rem",
        width: "6px", height: "6px", borderRadius: "50%",
        background: "#f5c842",
        opacity: hovered ? 1 : 0,
        transform: hovered ? "scale(1)" : "scale(0)",
        transition: "all 0.35s ease 0.1s",
      }} />
    </div>
  );
}

export default function Projects() {
  const hasProjects = config.projects && config.projects.length > 0;
  const [headingRef, headingInView] = useInView();

  return (
    <section id="projects" style={{
      background: "#f0ece0",
      padding: "5rem 6% 6rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ghost text */}
      <div style={{
        position: "absolute", bottom: "-1rem", right: "-1rem",
        fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1.5px rgba(58,74,46,0.08)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
      }}>WORK</div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          <span style={{ color: "#c47d2a", fontSize: "1.2rem" }}>✦</span>
          <span style={{
            fontSize: "0.75rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(30,28,22,0.45)", fontWeight: 600,
          }}>03 — Projects</span>
        </div>

        {/* Heading */}
        <div ref={headingRef} style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          marginBottom: "3rem", flexWrap: "wrap", gap: "1rem",
        }}>
          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.05,
            color: "#1a1a14", margin: 0,
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}>
            Selected{" "}
            <em style={{ color: "#3a4a2e", fontStyle: "italic" }}>work</em>
          </h2>
          <p style={{
            fontSize: "0.8rem", color: "rgba(30,28,22,0.4)",
            letterSpacing: "0.05em", margin: 0,
            opacity: headingInView ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}>
            {config.projects?.length} projects
          </p>
        </div>

        {hasProjects ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}>
            {config.projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            border: "1.5px dashed rgba(58,74,46,0.2)",
            borderRadius: "1rem", padding: "4rem 2rem",
            textAlign: "center", color: "rgba(30,28,22,0.3)",
          }}>
            <p style={{ fontWeight: 500, marginBottom: "0.4rem" }}>No projects yet</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>
              Add items to the <code>projects</code> array in <code>src/config.js</code>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #projects > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}