import React, { useRef, useState, useEffect } from "react";
import { config } from "../config";
import BlurText from "./reactbits/BlurText";
import SpotlightCard from "./reactbits/SpotlightCard";

const skillIcons = {
  "Figma":           "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  "Adobe Photoshop": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
  "Canva":           "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg",
  "HTML & CSS":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  "JavaScript":      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "Git & GitHub":    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "VS Code":         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  "Vercel":          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  "React":           "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "Tailwind CSS":    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  "Node.js":         "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "Notion":          "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg",
};

const categoryColor = {
  design:   "#c0392b",
  frontend: "#b5657a",
  backend:  "#6abf69",
  tool:     "#a85568",
};

const floatVariants = [
  { duration: "3.2s", delay: "0s"   },
  { duration: "3.8s", delay: "0.4s" },
  { duration: "2.9s", delay: "0.8s" },
  { duration: "3.5s", delay: "0.2s" },
  { duration: "4.1s", delay: "0.6s" },
  { duration: "3.3s", delay: "1.0s" },
  { duration: "2.8s", delay: "0.3s" },
  { duration: "3.7s", delay: "0.7s" },
  { duration: "3.0s", delay: "0.5s" },
  { duration: "3.6s", delay: "0.9s" },
  { duration: "4.2s", delay: "0.1s" },
  { duration: "3.1s", delay: "0.6s" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function SkillCard({ skill, index, sectionInView }) {
  const [hovered, setHovered] = useState(false);
  const color = categoryColor[skill.category] || "#C97A8A";
  const iconSrc = skillIcons[skill.name];
  const floatV = floatVariants[index % floatVariants.length];
  const staggerDelay = Math.min(index * 0.07, 1.1);
  const animName = `floatCard${index}`;

  return (
    <>
      <style>{`
        @keyframes ${animName} {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        .skill-card-${index} {
          animation: ${sectionInView ? `${animName} ${floatV.duration} ease-in-out infinite ${floatV.delay}` : "none"};
          transition: transform 0.38s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.38s ease,
                      opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${staggerDelay}s;
        }
        .skill-card-${index}:hover {
          animation: none !important;
          transform: scale(1.28) translateY(-8px) !important;
          box-shadow: 0 40px 80px rgba(61,26,36,0.22), 0 0 0 2px ${color}55 !important;
          z-index: 20 !important;
        }
      `}</style>

      <div
        className={`skill-card-${index}`}
        style={{
          opacity: sectionInView ? 1 : 0,
          transform: sectionInView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.88)",
          position: "relative",
          zIndex: hovered ? 20 : 1,
          cursor: "default",
          borderRadius: "1.25rem",
          willChange: "transform",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <SpotlightCard
          spotlightColor={`${color}40`}
          className=""
          style={{
            height: "100%",
            borderRadius: "1.25rem",
            boxShadow: hovered
              ? `0 40px 80px rgba(61,26,36,0.22), 0 0 0 2px ${color}55`
              : "0 4px 20px rgba(61,26,36,0.07)",
            transition: "box-shadow 0.38s ease",
            background: hovered ? "rgba(255,255,255,0.6)" : undefined,
          }}
        >
          <div style={{
            padding: "2.2rem 1.2rem 1.8rem",
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "1rem",
            position: "relative",
          }}>
            {/* Top color bar */}
            <div style={{
              position: "absolute", top: 0, left: "20%", right: "20%",
              height: "2.5px", borderRadius: "0 0 4px 4px",
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              opacity: hovered ? 1 : 0.35,
              transition: "opacity 0.3s ease",
            }} />

            {/* Icon */}
            <div style={{
              width: "72px", height: "72px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: hovered ? `${color}15` : "rgba(61,26,36,0.03)",
              borderRadius: "1.1rem",
              border: `1.5px solid ${hovered ? `${color}50` : "rgba(61,26,36,0.07)"}`,
              transition: "all 0.3s ease",
            }}>
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt={skill.name}
                  width={42} height={42}
                  style={{
                    objectFit: "contain", display: "block",
                    filter: hovered ? "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" : "none",
                    transition: "filter 0.3s ease",
                  }}
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div style={{
                display: iconSrc ? "none" : "flex",
                width: 42, height: 42,
                alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem", fontWeight: 800, color,
                fontFamily: "'Georgia', serif",
              }}>
                {skill.name.slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Name + category */}
            <div style={{ textAlign: "center" }}>
              <span style={{
                fontSize: "0.82rem", fontWeight: 700,
                color: hovered ? color : "#3D1A24",
                letterSpacing: "0.07em", textTransform: "uppercase",
                lineHeight: 1.3, display: "block",
                transition: "color 0.25s ease",
              }}>
                {skill.name}
              </span>
              {skill.category && (
                <span style={{
                  fontSize: "0.62rem", fontWeight: 500,
                  color: hovered ? `${color}90` : "rgba(61,26,36,0.28)",
                  letterSpacing: "0.06em", textTransform: "capitalize",
                  transition: "color 0.25s ease",
                  marginTop: "0.2rem", display: "block",
                }}>
                  {skill.category}
                </span>
              )}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </>
  );
}

export default function Skill() {
  const hasSkills = config.skills && config.skills.length > 0;
  const [sectionRef, sectionInView] = useInView();

  return (
    <section
      id="skills"
      style={{
        background: "#EDE0D0",
        padding: "5rem 6% 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost background text */}
      <div style={{
        position: "absolute", bottom: "-1rem", right: "-1rem",
        fontSize: "clamp(5rem, 18vw, 14rem)", fontWeight: 900,
        color: "transparent", WebkitTextStroke: "1.5px rgba(61,26,36,0.07)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none",
        letterSpacing: "0.02em", fontFamily: "'Georgia', serif",
      }}>SKILLS</div>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          <span style={{ color: "#C97A8A", fontSize: "1.2rem" }}>✦</span>
          <span style={{
            fontSize: "0.75rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(61,26,36,0.45)", fontWeight: 600,
          }}>02 — Skills & Tech Stack</span>
        </div>

        {/* Heading */}
        <div style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 700, lineHeight: 1.05,
          color: "#3D1A24", marginBottom: "3rem",
        }}>
          <BlurText
            text="What I work with"
            delay={120}
            animateBy="words"
            direction="top"
            stepDuration={0.4}
          />
        </div>

        {/* Grid */}
        {hasSkills ? (
          <div
            ref={sectionRef}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {config.skills.map((skill, i) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={i}
                sectionInView={sectionInView}
              />
            ))}
          </div>
        ) : (
          <div style={{
            border: "1.5px dashed rgba(61,26,36,0.1)",
            borderRadius: "1rem", padding: "3.5rem 2rem",
            textAlign: "center", color: "rgba(61,26,36,0.3)",
          }} />
        )}
      </div>
    </section>
  );
}