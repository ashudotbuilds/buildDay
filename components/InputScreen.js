"use client";

import { useState, useRef } from "react";

const POPULAR_CHIPS = [
  "How do vaccines work",
  "Why did Rome fall",
  "Quantum computing basics",
  "CRISPR gene editing",
  "How GPS satellites calculate location",
];

const COMPARISONS = [
  {
    feature: "Length fit",
    commuteClass: "Exact fit to 3, 5, or 10 min (~150 wpm)",
    podcasts: "45–60 min with 15 min banter & ads",
    chatgpt: "Rambles with no time awareness",
  },
  {
    feature: "Relevance",
    commuteClass: "3 clarifying questions target your exact level",
    podcasts: "Fixed general audience content",
    chatgpt: "Guesses context without asking",
  },
  {
    feature: "Transparency",
    commuteClass: "Live verified web citations + full script",
    podcasts: "No sources or show notes links",
    chatgpt: "Frequent hallucinated links",
  },
];

export default function InputScreen({ onSubmitTopic, onLoadDemo, isLoading }) {
  const [topic, setTopic] = useState("");
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmitTopic(topic.trim());
  };

  const togglePreviewAudio = () => {
    if (!previewAudioRef.current) return;
    if (isPreviewPlaying) {
      previewAudioRef.current.pause();
      setIsPreviewPlaying(false);
    } else {
      previewAudioRef.current.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
      {/* Hidden demo audio element for instant landing page preview */}
      <audio
        ref={previewAudioRef}
        src="/demo/demo1.mp3"
        onEnded={() => setIsPreviewPlaying(false)}
      />

      {/* Hero Section */}
      <section className="landing-container" style={{ textAlign: "center", paddingTop: "24px" }}>
        {/* Eyebrow badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div className="badge-gold">
            <span style={{ fontSize: "0.9rem" }}>⚡</span>
            <span>Turn dead transit time into high-yield audio lessons</span>
          </div>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.12,
            maxWidth: "860px",
            margin: "0 auto",
          }}
        >
          Learn anything on your walk, drive, or subway in{" "}
          <span className="serif-italic" style={{ color: "var(--primary-amber)", fontWeight: 400 }}>
            exact minutes.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-muted)",
            maxWidth: "680px",
            margin: "20px auto 0",
            lineHeight: 1.6,
          }}
        >
          Hands and eyes busy, but ears completely free? Tell us your topic and available time. We ask 3 quick questions, search verified sources, and produce a bespoke spoken briefing.
        </p>

        {/* Main interactive topic card */}
        <div
          style={{
            maxWidth: "680px",
            margin: "36px auto 0",
            textAlign: "left",
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: "24px",
              border: "1.5px solid rgba(245, 158, 11, 0.25)",
              boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.7)",
            }}
          >
            {/* Topic input form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label
                  htmlFor="hero-topic-input"
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    color: "var(--text-main)",
                    marginBottom: "10px",
                  }}
                >
                  What topic do you want to learn today?
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="hero-topic-input"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. How do vaccines work, Quantum computing, Fall of Rome..."
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "16px 18px",
                      fontSize: "1.05rem",
                      background: "var(--bg-app)",
                      border: "1.5px solid var(--border-subtle)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-main)",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--primary-amber)";
                      e.target.style.boxShadow = "0 0 0 4px rgba(245, 158, 11, 0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--border-subtle)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              </div>

              {/* Popular chips */}
              <div>
                <div style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--text-subtle)", marginBottom: "8px" }}>
                  Or tap an example topic:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {POPULAR_CHIPS.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      className="chip"
                      onClick={() => {
                        setTopic(chip);
                        onSubmitTopic(chip);
                      }}
                      disabled={isLoading}
                    >
                      <span style={{ color: "var(--primary-amber)", marginRight: "6px" }}>⚡</span>
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary"
                disabled={!topic.trim() || isLoading}
                style={{ marginTop: "4px" }}
              >
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className="wave-bar" style={{ height: "14px", width: "3px", backgroundColor: "#07080c" }}></span>
                    Consulting Research Model...
                  </span>
                ) : (
                  <span>Tailor My Audio Lesson &rarr;</span>
                )}
              </button>
            </form>

            {/* Try pre-recorded demo link */}
            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
              <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Want to hear the audio right now?
              </div>
              <button
                type="button"
                onClick={onLoadDemo}
                disabled={isLoading}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--primary-amber)",
                  fontSize: "0.84rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Play Pre-Recorded Demo (Vaccines)</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Micro feature badges under hero */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
            marginTop: "32px",
            fontSize: "0.82rem",
            color: "var(--text-subtle)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary-amber)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            No 45-minute podcast filler
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary-amber)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Exact word pacing (~150 wpm)
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary-amber)" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Real web citations provided
          </span>
        </div>
      </section>

      {/* Live Sample Audio Player Card (Instant proof) */}
      <section className="landing-container">
        <div
          className="glass-panel"
          style={{
            padding: "28px",
            background: "linear-gradient(180deg, #121622 0%, #0c0f16 100%)",
            border: "1px solid rgba(245, 158, 11, 0.28)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div>
              <div className="badge-gold" style={{ marginBottom: "10px" }}>
                <span>🎧 Hear It in Action</span>
              </div>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                "How do vaccines work in the human body?"
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "6px", lineHeight: 1.6 }}>
                3-minute spoken lesson synthesized with Edge Neural Audio. Researched using live clinical trials and immunological sources.
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={togglePreviewAudio}
                  className="btn-primary"
                  style={{ width: "auto", padding: "10px 18px", fontSize: "0.88rem" }}
                >
                  {isPreviewPlaying ? "Pause Sample ⏸" : "Play 3-Min Sample ▶"}
                </button>
                <button
                  type="button"
                  onClick={onLoadDemo}
                  className="btn-secondary"
                  style={{ padding: "10px 16px", fontSize: "0.88rem" }}
                >
                  View Full Script & Sources &rarr;
                </button>
              </div>
            </div>

            {/* Audio visualization widget */}
            <div
              style={{
                background: "var(--bg-app)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>Audio Preview</span>
                <span style={{ fontSize: "0.75rem", color: "var(--primary-amber)", fontWeight: 600 }}>
                  {isPreviewPlaying ? "Playing Now" : "Ready"}
                </span>
              </div>
              {/* Waveform bars */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px", height: "36px" }}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      backgroundColor: isPreviewPlaying ? "var(--primary-amber)" : "var(--bg-chip-hover)",
                      height: isPreviewPlaying ? `${10 + ((i * 7) % 26)}px` : "6px",
                      borderRadius: "4px",
                      transition: "height 0.2s ease, background-color 0.2s ease",
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-subtle)" }}>
                <span>0:00</span>
                <span>3:00 (~450 words)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 3 Differentiators Bento Section (PRD Section 4) */}
      <section className="landing-container">
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <span className="badge-gold">Why CommuteClass?</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginTop: "12px" }}>
            The 3 rules of commuter learning.
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "560px", margin: "8px auto 0" }}>
            Generic podcasts and ChatGPT voice don't work for commutes. We built CommuteClass specifically around hands-busy moments.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Card 1 */}
          <div className="bento-card">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-amber)",
                marginBottom: "16px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
              1. 3 Clarifying Questions
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              We never assume what you already know. 3 quick multiple-choice cards determine your knowledge level, your goal, and the specific angle you care about before researching.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bento-card">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-amber)",
                marginBottom: "16px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
              2. Time-Boxed to the Minute
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Pick 3, 5, or 10 minutes. The script prompt targets ~150 spoken words per minute with mathematical precision, so the lesson ends right as you step off the bus.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bento-card">
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--primary-amber)",
                marginBottom: "16px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "8px" }}>
              3. Transparent Citations
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              Zero fabricated sources. Claude executes live web search, lists real clickable source links, and provides the complete word-for-word transcript right beside the player.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Grid (Direct from PRD Section 4) */}
      <section className="landing-container">
        <div className="glass-panel" style={{ padding: "32px 24px" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", textAlign: "center" }}>
            Why CommuteClass beats generic audio
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontSize: "0.82rem", color: "var(--text-subtle)", fontWeight: 600 }}>Feature</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontSize: "0.85rem", color: "var(--primary-amber)", fontWeight: 700 }}>CommuteClass</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontSize: "0.82rem", color: "var(--text-subtle)", fontWeight: 500 }}>Generic Podcasts</th>
                  <th style={{ textAlign: "left", padding: "12px 14px", fontSize: "0.82rem", color: "var(--text-subtle)", fontWeight: 500 }}>ChatGPT / NotebookLM</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISONS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < COMPARISONS.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                    <td style={{ padding: "14px", fontWeight: 600, fontSize: "0.88rem" }}>{row.feature}</td>
                    <td style={{ padding: "14px", color: "var(--text-main)", fontSize: "0.88rem", background: "rgba(245, 158, 11, 0.05)" }}>
                      <span style={{ color: "var(--primary-amber)", marginRight: "6px" }}>✓</span>
                      {row.commuteClass}
                    </td>
                    <td style={{ padding: "14px", color: "var(--text-muted)", fontSize: "0.85rem" }}>{row.podcasts}</td>
                    <td style={{ padding: "14px", color: "var(--text-muted)", fontSize: "0.85rem" }}>{row.chatgpt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-container" style={{ textAlign: "center" }}>
        <div
          className="glass-panel"
          style={{
            padding: "40px 24px",
            background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.12) 0%, #11141d 80%)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
          }}
        >
          <h3 style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Got 5 minutes before your next stop?
          </h3>
          <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", maxWidth: "480px", margin: "10px auto 24px" }}>
            Type any topic at the top or load our pre-synthesized lesson to test the audio quality right away.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn-primary"
              style={{ width: "auto", padding: "14px 28px" }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                const el = document.getElementById("hero-topic-input");
                if (el) el.focus();
              }}
            >
              Start Your Commute Lesson &uarr;
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ width: "auto", padding: "14px 24px" }}
              onClick={onLoadDemo}
            >
              Load Demo Lesson (3 Min)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
