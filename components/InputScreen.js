"use client";

import { useState } from "react";

const EXAMPLE_TOPICS = [
  "How do vaccines work",
  "Quantum computing basics",
  "Why did Rome fall",
];

export default function InputScreen({ onSubmitTopic, onLoadDemo, isLoading }) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    onSubmitTopic(topic.trim());
  };

  const handleChipClick = (example) => {
    setTopic(example);
    // Directly submit or populate
    onSubmitTopic(example);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Intro hero banner */}
      <div>
        <span style={{ 
          fontSize: "0.8rem", 
          fontWeight: 600, 
          color: "var(--primary-amber)",
          textTransform: "uppercase",
          letterSpacing: "0.08em" 
        }}>
          Turn dead time into knowledge
        </span>
        <h2 style={{ 
          fontSize: "1.65rem", 
          fontWeight: 800, 
          letterSpacing: "-0.03em", 
          marginTop: "6px",
          lineHeight: 1.25 
        }}>
          What do you want to learn right now?
        </h2>
        <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", marginTop: "8px" }}>
          We'll ask 3 quick questions, research the facts, and generate a personalized audio lesson sized for your commute.
        </p>
      </div>

      {/* Main input card */}
      <div className="glass-panel" style={{ padding: "20px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="topic-input" style={{ 
              display: "block", 
              fontSize: "0.85rem", 
              fontWeight: 600, 
              color: "var(--text-muted)", 
              marginBottom: "8px" 
            }}>
              Topic or question
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. How do vaccines work..."
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "1rem",
                  background: "var(--bg-app)",
                  border: "1.5px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-main)",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--primary-amber)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border-subtle)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Example topic chips */}
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-subtle)", marginBottom: "8px" }}>
              Popular topics to try:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {EXAMPLE_TOPICS.map((item) => (
                <button
                  type="button"
                  key={item}
                  className="chip"
                  onClick={() => handleChipClick(item)}
                  disabled={isLoading}
                >
                  <span style={{ color: "var(--primary-amber)", marginRight: "6px" }}>⚡</span>
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={!topic.trim() || isLoading}
            style={{ marginTop: "4px" }}
          >
            {isLoading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="wave-bar" style={{ height: "14px", width: "3px", backgroundColor: "#090d14" }}></span>
                Understanding topic...
              </span>
            ) : (
              <span>Continue to Questions &rarr;</span>
            )}
          </button>
        </form>
      </div>

      {/* Try a demo link */}
      <div style={{ textAlign: "center", marginTop: "-4px" }}>
        <button
          type="button"
          onClick={onLoadDemo}
          disabled={isLoading}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            cursor: "pointer",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = "var(--primary-amber)")}
          onMouseLeave={(e) => (e.target.style.color = "var(--text-muted)")}
        >
          Pressed for time? <span style={{ color: "var(--primary-amber)", fontWeight: 600 }}>Try a pre-recorded demo lesson</span> &rarr;
        </button>
      </div>
    </div>
  );
}
