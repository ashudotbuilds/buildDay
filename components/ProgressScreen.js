"use client";

import { useEffect, useState } from "react";

const STAGES = [
  {
    id: "researching",
    title: "Researching",
    desc: "Fetching live web sources, studies, and verified facts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    ),
  },
  {
    id: "writing",
    title: "Writing Script",
    desc: "Structuring conversational narrative sized to your exact time",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    ),
  },
  {
    id: "recording",
    title: "Recording Audio",
    desc: "Synthesizing studio-grade neural voice",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    ),
  },
];

export default function ProgressScreen({ currentStage = "researching", topic, minutes = 5 }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const getStageIndex = (stageId) => {
    const idx = STAGES.findIndex((s) => s.id === stageId);
    return idx === -1 ? 0 : idx;
  };

  const activeIndex = getStageIndex(currentStage);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Info */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 14px",
          borderRadius: "99px",
          background: "rgba(245, 158, 11, 0.12)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          color: "var(--primary-amber)",
          fontSize: "0.8rem",
          fontWeight: 600,
          marginBottom: "12px",
        }}>
          <span className="wave-bar" style={{ height: "12px", width: "3px" }}></span>
          <span>Crafting your {minutes}-minute lesson &bull; {formatTime(elapsed)}</span>
        </div>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          Generating "{topic}"
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
          Live research and neural voice synthesis in progress...
        </p>
      </div>

      {/* Visual Audio Waveform / Radar Animation */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.08) 0%, rgba(18, 24, 36, 0.9) 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "48px", marginBottom: "16px" }}>
          <span className="wave-bar" style={{ animationDelay: "0.0s", height: "16px" }}></span>
          <span className="wave-bar" style={{ animationDelay: "0.2s", height: "28px" }}></span>
          <span className="wave-bar" style={{ animationDelay: "0.4s", height: "38px" }}></span>
          <span className="wave-bar" style={{ animationDelay: "0.1s", height: "48px" }}></span>
          <span className="wave-bar" style={{ animationDelay: "0.3s", height: "30px" }}></span>
          <span className="wave-bar" style={{ animationDelay: "0.5s", height: "18px" }}></span>
        </div>
        <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--primary-amber)" }}>
          {STAGES[activeIndex]?.title || "Processing"}...
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-subtle)", marginTop: "2px" }}>
          {STAGES[activeIndex]?.desc}
        </div>
      </div>

      {/* 3 Stages Timeline List */}
      <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isPending = idx > activeIndex;

          let statusBg = "var(--bg-app)";
          let statusBorder = "var(--border-subtle)";
          let badgeColor = "var(--text-subtle)";

          if (isDone) {
            statusBg = "rgba(16, 185, 129, 0.08)";
            statusBorder = "rgba(16, 185, 129, 0.3)";
            badgeColor = "var(--accent-emerald)";
          } else if (isCurrent) {
            statusBg = "rgba(245, 158, 11, 0.1)";
            statusBorder = "var(--primary-amber)";
            badgeColor = "var(--primary-amber)";
          }

          return (
            <div
              key={stage.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 14px",
                borderRadius: "var(--radius-md)",
                backgroundColor: statusBg,
                border: `1.5px solid ${statusBorder}`,
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isCurrent ? "var(--primary-amber)" : isDone ? "var(--accent-emerald)" : "var(--bg-card)",
                  color: isCurrent || isDone ? "#0a0d14" : "var(--text-subtle)",
                  flexShrink: 0,
                  boxShadow: isCurrent ? "0 0 12px rgba(245, 158, 11, 0.4)" : "none",
                }}
              >
                {isDone ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  stage.icon
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: isCurrent ? 700 : 600, color: isPending ? "var(--text-subtle)" : "var(--text-main)" }}>
                    {stage.title}
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 600, color: badgeColor, textTransform: "uppercase" }}>
                    {isDone ? "Done" : isCurrent ? "Active" : "Pending"}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: isPending ? "var(--text-subtle)" : "var(--text-muted)", marginTop: "2px" }}>
                  {stage.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
