import React from "react";
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
  frontend: "#f5c842",
  backend:  "#6abf69",
  tool:     "#c47d2a",
};

const categoryLabel = {
  design:   "Design",
  frontend: "Frontend",
  backend:  "Backend",
  tool:     "Tool",
};

function SkillCard({ skill }) {
  const color = categoryColor[skill.category] || "#888";
  const iconSrc = skillIcons[skill.name];

  return (
    <SpotlightCard
      spotlightColor={`${color}40`}
      className=""
      style={{ height: "100%" }}
    >
      <div
        style={{
          padding: "1.6rem 1rem 1.2rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          position: "relative",
        }}
      >
        {/* Category dot top-right */}
        <div style={{
          position: "absolute", top: "0rem", right: "0.2rem",
          width: 7, height: 7, borderRadius: "50%",
          background: color, opacity: 0.8,
        }} />

        {/* Icon */}
        <div style={{ height: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {iconSrc ? (
            <img
              src={iconSrc}
              alt={skill.name}
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
              onError={e => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div style={{
            display: iconSrc ? "none" : "flex",
            width: 44, height: 44,
            borderRadius: "0.6rem",
            background: `${color}22`,
            border: `1.5px solid ${color}55`,
            alignItems: "center", justifyContent: "center",
            fontSize: "1rem", fontWeight: 800, color: color,
            fontFamily: "'Georgia', serif",
          }}>
            {skill.name.slice(0, 2).toUpperCase()}
          </div>
        </div>

        {/* Name */}
        <span style={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "#f0ece0",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.3,
        }}>
          {skill.name}
        </span>
      </div>
    </SpotlightCard>
  );
}

export default function Skill() {
  const hasSkills = config.skills && config.skills.length > 0;

  return (
    <section
      id="skills"
      style={{
        background: "#3a4a2e",
        padding: "5rem 6% 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost background text */}
      <div style={{
        position: "absolute",
        bottom: "-1rem", right: "-1rem",
        fontSize: "clamp(5rem, 18vw, 14rem)",
        fontWeight: 900,
        color: "transparent",
        WebkitTextStroke: "1.5px rgba(240,200,80,0.1)",
        lineHeight: 1,
        userSelect: "none", pointerEvents: "none",
        letterSpacing: "0.02em",
        fontFamily: "'Georgia', serif",
      }}>SKILLS</div>

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2.5rem" }}>
          <span style={{ color: "#f5c842", fontSize: "1.2rem" }}>✦</span>
          <span style={{
            fontSize: "0.75rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(240,236,224,0.5)", fontWeight: 600,
          }}>02 — Skills & Tech Stack</span>
        </div>

        {/* Animated heading with BlurText */}
        <div style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
          fontWeight: 700,
          lineHeight: 1.05,
          color: "#f0ece0",
          marginBottom: "1.5rem",
        }}>
          <BlurText
            text="What I work with"
            delay={120}
            animateBy="words"
            direction="top"
            stepDuration={0.4}
          />
        </div>

        {/* Category legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", marginBottom: "3rem" }}>
          {Object.entries(categoryLabel).map(([key, label]) => (
            <span key={key} style={{
              display: "flex", alignItems: "center", gap: "0.45rem",
              fontSize: "0.72rem", letterSpacing: "0.1em",
              color: "rgba(240,236,224,0.45)", textTransform: "uppercase",
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: categoryColor[key] }} />
              {label}
            </span>
          ))}
        </div>

        {hasSkills ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "1rem",
          }}>
            {config.skills.map((skill, i) => (
              <SkillCard key={i} skill={skill} />
            ))}
          </div>
        ) : (
          <div style={{
            border: "1.5px dashed rgba(240,236,224,0.12)",
            borderRadius: "1rem", padding: "3.5rem 2rem",
            textAlign: "center", color: "rgba(240,236,224,0.3)",
          }} />
        )}

      </div>
    </section>
  );
}