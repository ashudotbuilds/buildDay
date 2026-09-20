"use client";

import { useState } from "react";

const DURATION_OPTIONS = [
  { minutes: 3, label: "3 min", subtitle: "Quick walk", words: "~450 words" },
  { minutes: 5, label: "5 min", subtitle: "Average ride", words: "~750 words", recommended: true },
  { minutes: 10, label: "10 min", subtitle: "Deep commute", words: "~1500 words" },
];

const LANGUAGE_OPTIONS = [
  { id: "en-IN-NeerjaNeural", name: "English", sub: "Indian", enabled: true },
  { id: "hi-IN-SwaraNeural", name: "Hindi", sub: "हिंदी", enabled: false, badge: "Soon" },
  { id: "mr-IN-AarohiNeural", name: "Marathi", sub: "मराठी", enabled: false, badge: "Soon" },
];

export default function QuestionsScreen({
  topic,
  questions = [],
  onGenerate,
  onBack,
  isGenerating,
}) {
  // Default selections for the 3 questions: first option of each
  const [answers, setAnswers] = useState(() => {
    return questions.map((q) => (q.options && q.options.length > 0 ? q.options[0] : ""));
  });

  const [selectedDuration, setSelectedDuration] = useState(5);
  const [selectedVoice, setSelectedVoice] = useState(
    process.env.NEXT_PUBLIC_DEFAULT_TTS_VOICE || "en-IN-NeerjaNeural",
  );

  const handleSelectOption = (qIndex, option) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = option;
      return next;
    });
  };

  const handleStartGeneration = () => {
    if (isGenerating) return;

    const langMap = {
      "en-IN-NeerjaNeural": "English",
      "hi-IN-SwaraNeural": "Hindi",
      "mr-IN-AarohiNeural": "Marathi",
    };

    onGenerate({
      topic,
      level: answers[0] || questions[0]?.options?.[0] || "Beginner",
      goal: answers[1] || questions[1]?.options?.[0] || "Understand basics",
      angle: answers[2] || questions[2]?.options?.[0] || "General overview",
      minutes: Number(selectedDuration),
      voice: selectedVoice,
      language: langMap[selectedVoice] || "English",
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top topic badge and back link */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={onBack}
          disabled={isGenerating}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          &larr; Change topic
        </button>
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--primary-amber)",
            background: "rgba(245, 158, 11, 0.1)",
            padding: "3px 8px",
            borderRadius: "6px",
            fontWeight: 500,
          }}
        >
          Step 2 of 2
        </span>
      </div>

      <div>
        <h2 style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
          Tailor your lesson
        </h2>
        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "4px" }}>
          Topic: <span style={{ color: "var(--text-main)", fontWeight: 600 }}>"{topic}"</span>
        </p>
      </div>

      {/* Clarifying Questions List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {questions.map((qObj, qIdx) => (
          <div
            key={qIdx}
            className="glass-panel"
            style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "var(--primary-amber)",
                  background: "var(--bg-app)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {qIdx + 1}
              </span>
              <h4 style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text-main)" }}>
                {qObj.q}
              </h4>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {qObj.options.map((option, optIdx) => {
                const isSelected = answers[qIdx] === option;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    className={`option-card ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectOption(qIdx, option)}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: isSelected
                          ? "5px solid var(--primary-amber)"
                          : "1.5px solid var(--text-subtle)",
                        marginRight: "10px",
                        flexShrink: 0,
                        backgroundColor: isSelected ? "#0a0d14" : "transparent",
                      }}
                    />
                    <span style={{ fontSize: "0.88rem", fontWeight: isSelected ? 600 : 400 }}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Duration Picker */}
      <div className="glass-panel" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>Available Time</label>
          <span style={{ fontSize: "0.78rem", color: "var(--text-subtle)" }}>
            ~{process.env.NEXT_PUBLIC_LESSON_WORDS_PER_MINUTE || 150} words/min
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {DURATION_OPTIONS.map((item) => {
            const active = selectedDuration === item.minutes;
            return (
              <button
                key={item.minutes}
                type="button"
                onClick={() => setSelectedDuration(item.minutes)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px 6px",
                  borderRadius: "var(--radius-md)",
                  border: active
                    ? "1.5px solid var(--primary-amber)"
                    : "1px solid var(--border-subtle)",
                  backgroundColor: active ? "rgba(245, 158, 11, 0.12)" : "var(--bg-app)",
                  color: active ? "var(--text-main)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {item.recommended && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-7px",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      background: "var(--primary-amber)",
                      color: "#0a0d14",
                      padding: "1px 6px",
                      borderRadius: "99px",
                      letterSpacing: "0.03em",
                    }}
                  >
                    BEST FIT
                  </span>
                )}
                <span style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: item.recommended ? "4px" : 0 }}>
                  {item.label}
                </span>
                <span style={{ fontSize: "0.7rem", color: active ? "var(--primary-amber)" : "var(--text-subtle)" }}>
                  {item.subtitle}
                </span>
                <span style={{ fontSize: "0.65rem", color: "var(--text-subtle)", marginTop: "2px" }}>
                  {item.words}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Picker */}
      <div className="glass-panel" style={{ padding: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <label style={{ fontSize: "0.9rem", fontWeight: 600 }}>Audio Voice Language</label>
          <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)" }}>Neural Speech</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {LANGUAGE_OPTIONS.map((lang) => {
            const active = selectedVoice === lang.id;
            const disabled = !lang.enabled;
            return (
              <button
                key={lang.id}
                type="button"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) setSelectedVoice(lang.id);
                }}
                style={{
                  padding: "10px 6px",
                  borderRadius: "var(--radius-md)",
                  border: active
                    ? "1.5px solid var(--primary-amber)"
                    : "1px solid var(--border-subtle)",
                  backgroundColor: active ? "rgba(245, 158, 11, 0.12)" : "var(--bg-app)",
                  color: active
                    ? "var(--text-main)"
                    : disabled
                    ? "var(--text-subtle)"
                    : "var(--text-muted)",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.4 : 1,
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
              >
                {lang.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-7px",
                      right: "6px",
                      fontSize: "0.58rem",
                      fontWeight: 700,
                      background: "var(--bg-card-elevated)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-subtle)",
                      padding: "1px 6px",
                      borderRadius: "99px",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {lang.badge}
                  </span>
                )}
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{lang.name}</div>
                <div style={{ fontSize: "0.7rem", color: active ? "var(--primary-amber)" : "var(--text-subtle)" }}>
                  {lang.sub}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div style={{ marginTop: "4px" }}>
        <button
          type="button"
          className="btn-primary"
          onClick={handleStartGeneration}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span>Preparing Audio Stream...</span>
          ) : (
            <span>Generate {selectedDuration}-Min Lesson 🎧</span>
          )}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "8px" }}>
          Researched with live web sources &bull; Edge Neural Voice
        </p>
      </div>
    </div>
  );
}
