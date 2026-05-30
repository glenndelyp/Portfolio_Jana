import React, { useState, useEffect } from "react";
import { config } from "../config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        padding: "1.25rem 2.5rem",
        background: scrolled ? "rgba(26,26,24,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo / Name */}
        <div className="flex items-center gap-2">
          <span
            style={{ color: "var(--accent-red)", fontSize: "1.1rem" }}
          >
            ◆
          </span>
          <span
            className="font-display font-bold"
            style={{ fontSize: "1rem", color: "var(--cream)", letterSpacing: "0.03em" }}
          >
            {config.name}
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {config.navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn-pill">
            Get in touch!
          </a>
        </div>

        {/* Mobile menu icon (simplified) */}
        <button className="md:hidden flex flex-col gap-1.5" aria-label="Menu">
          <span style={{ width: 22, height: 1.5, background: "var(--cream)", display: "block" }} />
          <span style={{ width: 16, height: 1.5, background: "var(--cream)", display: "block" }} />
          <span style={{ width: 22, height: 1.5, background: "var(--cream)", display: "block" }} />
        </button>
      </div>
    </nav>
  );
}