import React, { useRef, useState, useEffect, useCallback } from "react";
import { config } from "../config";

function useInView(threshold = 0) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fire immediately if already in viewport
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function useParallaxScroll(factor = 0.08) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * factor);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [factor]);
  return offset;
}

function useCountUp(target, trigger, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return count;
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const [ref, inView] = useInView(0);
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const num = String(index + 1).padStart(2, "0");

  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const r = cardRef.current?.getBoundingClientRect();
      if (!r) return;
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cardRef.current.style.transform =
        `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current) cardRef.current.style.transform = "";
    setHovered(false);
  }, []);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const animDelay = `${index * 0.1}s`;

  return (
    <div
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        background: hovered ? "#3D1A24" : "#EDE0D0",
        border: "1.5px solid rgba(61,26,36,0.12)",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        willChange: "transform",
        /* Wipe-in reveal — only clip-path and opacity animate on entry */
        clipPath: inView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        opacity: inView ? 1 : 0,
        transition: inView
          ? `clip-path 0.7s cubic-bezier(0.16,1,0.3,1) ${animDelay},
             opacity 0.4s ease ${animDelay},
             background 0.45s ease,
             box-shadow 0.45s ease`
          : "none",
        boxShadow: hovered
          ? "0 28px 72px rgba(61,26,36,0.22)"
          : "0 2px 16px rgba(61,26,36,0.06)",
      }}
    >
      {/* Shimmer sweep */}
      <div style={{
        position: "absolute", top: 0,
        left: hovered ? "160%" : "-120%",
        width: "60%", height: "100%",
        background: "linear-gradient(105deg, transparent 40%, rgba(247,212,212,0.12) 50%, transparent 60%)",
        zIndex: 2, pointerEvents: "none",
        transition: hovered ? "left 0.55s ease" : "left 0s",
      }} />

      {/* Top accent bar */}
      <div style={{
        height: "4px",
        background: hovered
          ? "linear-gradient(90deg, #F7D4D4, #C97A8A)"
          : "linear-gradient(90deg, #C97A8A, #A85568)",
        flexShrink: 0,
        transition: "background 0.45s ease",
      }} />

      <div style={{ padding: "2rem 2rem 1.8rem", flex: 1, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>

        {/* Big number */}
        <span style={{
          fontFamily: "'Georgia', serif",
          fontSize: "4rem", fontWeight: 700, lineHeight: 1,
          color: hovered ? "rgba(247,212,212,0.12)" : "rgba(61,26,36,0.08)",
          transition: "color 0.45s ease",
          userSelect: "none", marginBottom: "0.75rem", display: "block",
        }}>{num}</span>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.3,
          color: hovered ? "#F5EDE3" : "#3D1A24",
          margin: "0 0 0.9rem",
          transition: "color 0.45s ease",
        }}>{project.title}</h3>

        {/* Divider */}
        <div style={{
          height: "1px",
          background: hovered ? "rgba(247,212,212,0.2)" : "rgba(61,26,36,0.1)",
          marginBottom: "1rem",
          transition: "background 0.45s ease",
        }} />

        {/* Description */}
        {project.description && (
          <p style={{
            fontSize: "0.875rem", lineHeight: 1.75, flex: 1, margin: 0,
            color: hovered ? "rgba(245,237,227,0.6)" : "rgba(61,26,36,0.5)",
            transition: "color 0.45s ease",
          }}>{project.description}</p>
        )}

        {/* Tags — stagger-bounce in on hover */}
        {project.tags && project.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "1.2rem" }}>
            {project.tags.map((tag, i) => (
              <span key={i} style={{
                background: hovered ? "rgba(247,212,212,0.1)" : "rgba(61,26,36,0.06)",
                border: `1px solid ${hovered ? "rgba(201,122,138,0.4)" : "rgba(61,26,36,0.15)"}`,
                color: hovered ? "#F7D4D4" : "#3D1A24",
                borderRadius: "9999px",
                padding: "0.2rem 0.7rem",
                fontSize: "0.65rem", letterSpacing: "0.06em", fontWeight: 600,
                textTransform: "uppercase",
                opacity: hovered ? 1 : 0,
                transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.88)",
                transition: `all 0.38s cubic-bezier(0.16,1,0.3,1) ${i * 0.055 + 0.04}s`,
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {project.link && project.link !== "#" ? (
            <a href={project.link} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: hovered ? "#F7D4D4" : "#C97A8A",
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
              color: hovered ? "rgba(247,212,212,0.4)" : "rgba(61,26,36,0.25)",
              fontWeight: 600, transition: "color 0.45s ease",
            }}>In Progress</span>
          )}

          {/* Rotating arrow circle */}
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%",
            border: `1.5px solid ${hovered ? "rgba(201,122,138,0.5)" : "rgba(61,26,36,0.15)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.45s ease",
            transform: hovered ? "rotate(45deg)" : "rotate(0deg)",
            background: hovered ? "rgba(201,122,138,0.1)" : "transparent",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke={hovered ? "#F7D4D4" : "#3D1A24"} strokeWidth={2}
              style={{ transition: "stroke 0.45s ease" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Ripple pulse dot */}
      <div style={{ position: "absolute", bottom: "1rem", left: "2rem", width: "8px", height: "8px" }}>
        <div style={{
          position: "absolute", width: "8px", height: "8px", borderRadius: "50%",
          background: "#C97A8A",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "scale(1)" : "scale(0)",
          transition: "all 0.35s ease 0.1s",
        }} />
        <div style={{
          position: "absolute", width: "8px", height: "8px", borderRadius: "50%",
          background: "rgba(201,122,138,0.4)",
          opacity: hovered ? 1 : 0,
          animation: hovered ? "projectRipple 1.2s ease-out 0.3s infinite" : "none",
        }} />
      </div>

      <style>{`
        @keyframes projectRipple {
          0%  { transform: scale(1);   opacity: 0.6; }
          100%{ transform: scale(3.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function Projects() {
  const hasProjects = config.projects && config.projects.length > 0;
  const [headingRef, headingInView] = useInView(0);
  const [sectionRef, sectionInView] = useInView(0);
  const parallaxOffset = useParallaxScroll(0.08);
  const count = useCountUp(config.projects?.length ?? 0, sectionInView, 900);

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        background: "#F5EDE3",
        padding: "5rem 6% 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Parallax ghost text */}
      <div style={{
        position: "absolute", bottom: "-1rem", right: "-1rem",
        fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1.5px rgba(61,26,36,0.06)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        transform: `translateY(${parallaxOffset}px)`,
        transition: "transform 0.1s linear",
      }}>WORK</div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          <span style={{ color: "#C97A8A", fontSize: "1.2rem" }}>✦</span>
          <span style={{
            fontSize: "0.75rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(61,26,36,0.4)", fontWeight: 600,
          }}>03 — Projects</span>
        </div>

        {/* Heading */}
        <div
          ref={headingRef}
          style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: "3rem", flexWrap: "wrap", gap: "1rem",
          }}
        >
          <h2 style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700, lineHeight: 1.05,
            color: "#3D1A24", margin: 0,
            opacity: headingInView ? 1 : 0,
            transform: headingInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}>
            Selected{" "}
            <em style={{ color: "#3D1A24", fontStyle: "italic" }}>work</em>
          </h2>
          <p style={{
            fontSize: "0.8rem", color: "rgba(61,26,36,0.35)",
            letterSpacing: "0.05em", margin: 0,
            opacity: headingInView ? 1 : 0,
            transition: "opacity 0.7s ease 0.2s",
          }}>
            {count} project{count !== 1 ? "s" : ""}
          </p>
        </div>

        {hasProjects ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.5rem",
          }}>
            {config.projects.map((project, i) => (
              <ProjectCard key={i} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div style={{
            border: "1.5px dashed rgba(61,26,36,0.15)",
            borderRadius: "1rem", padding: "4rem 2rem",
            textAlign: "center", color: "rgba(61,26,36,0.3)",
          }}>
            <p style={{ fontWeight: 500, marginBottom: "0.4rem" }}>No projects yet</p>
            <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>
              Add items to the <code>projects</code> array in <code>src/config.js</code>
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          #projects .proj-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}