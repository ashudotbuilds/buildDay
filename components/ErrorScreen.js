"use client";

export default function ErrorScreen({
  message = "Something interrupted the lesson generation.",
  onTryAgain,
  onLoadDemo,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Friendly Error Container */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 20px",
          border: "1.5px solid rgba(244, 63, 94, 0.4)",
          background: "radial-gradient(ellipse at center, rgba(244, 63, 94, 0.08) 0%, rgba(18, 24, 36, 0.95) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "rgba(244, 63, 94, 0.15)",
            border: "1px solid rgba(244, 63, 94, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-rose)",
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>
            Generation Interrupted
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "6px", maxWidth: "380px" }}>
            {message}
          </p>
        </div>

        {/* Fallback Banner */}
        <div
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px dashed rgba(245, 158, 11, 0.3)",
            textAlign: "left",
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>💡</span>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-main)" }}>Don't miss your commute window!</strong> You can instantly load our pre-synthesized offline demo lesson with full audio and script.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", marginTop: "4px" }}>
          <button
            type="button"
            className="btn-primary"
            onClick={onLoadDemo}
            id="load-demo-lesson-btn"
          >
            <span>Load Demo Lesson (How Vaccines Work) 🎧</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onTryAgain}
          >
            <span>&larr; Try Topic Again</span>
          </button>
        </div>
      </div>
    </div>
  );
}
