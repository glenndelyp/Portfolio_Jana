import React, { useState } from "react";
import { config } from "../config";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      const response = await fetch("https://formspree.io/f/xykvoojd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-6 md:px-12"
      style={{ background: "var(--bg-dark)" }}
    >
      <div className="max-w-5xl mx-auto">
        <p className="section-label mb-3">05 — Contact</p>

        <div className="flex flex-col md:flex-row gap-12 md:gap-20">
          {/* Left */}
          <div className="md:w-2/5">
            <h2
              className="font-display font-bold"
              style={{
                fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                color: "var(--cream)",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              Get in{" "}
              <span style={{ color: "var(--accent-gold)", fontStyle: "italic" }}>touch</span>
            </h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(240,236,224,0.6)", lineHeight: 1.7 }}>
              {config.contact.message}
            </p>
            <div className="mt-6 flex flex-col gap-2">
              
             <a   href={`mailto:${config.contact.email}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--accent-gold)",
                  textDecoration: "none",
                }}
              >
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {config.contact.email}
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="md:w-3/5">
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center gap-3 text-center"
                style={{
                  border: "1.5px solid rgba(232,197,71,0.2)",
                  borderRadius: "1rem",
                  padding: "3rem",
                  minHeight: "260px",
                }}
              >
                <span style={{ fontSize: "2.5rem" }}>✦</span>
                <p
                  className="font-display font-bold"
                  style={{ fontSize: "1.3rem", color: "var(--cream)" }}
                >
                  Message sent!
                </p>
                <p style={{ fontSize: "0.85rem", color: "rgba(240,236,224,0.5)" }}>
                  Thanks for reaching out. I'll get back to you soon.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", message: "" }); }}
                  className="btn-pill mt-2"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(240,236,224,0.5)", marginBottom: "0.4rem", textTransform: "uppercase" }}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.6rem",
                      padding: "0.75rem 1rem",
                      fontSize: "0.9rem",
                      color: "var(--cream)",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent-gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(240,236,224,0.5)", marginBottom: "0.4rem", textTransform: "uppercase" }}
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.6rem",
                      padding: "0.75rem 1rem",
                      fontSize: "0.9rem",
                      color: "var(--cream)",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent-gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    style={{ display: "block", fontSize: "0.75rem", letterSpacing: "0.1em", color: "rgba(240,236,224,0.5)", marginBottom: "0.4rem", textTransform: "uppercase" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What's on your mind?"
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.6rem",
                      padding: "0.75rem 1rem",
                      fontSize: "0.9rem",
                      color: "var(--cream)",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 0.2s",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent-gold)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>

                {error && (
                  <p style={{ fontSize: "0.85rem", color: "#f87171" }}>
                    Something went wrong. Please try again.
                  </p>
                )}

                <button type="submit" className="btn-pill self-start px-8 py-3">
                  Send Message ✦
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}