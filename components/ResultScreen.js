"use client";

import { useState, useRef, useEffect } from "react";

export default function ResultScreen({ lesson, onNewLesson }) {
  const { topic, minutes = 5, script = "", sources = [], audioUrl } = lesson || {};

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isScriptExpanded, setIsScriptExpanded] = useState(false);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState(false);

  // Approximate word count
  const wordCount = script ? script.trim().split(/\s+/).length : 0;

  // Handle standard audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      } else {
        // Fallback default duration based on minutes
        setDuration(minutes * 60);
      }
    };
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      console.warn("Audio element failed to load MP3, enabling browser speech fallback");
      setUseSpeechFallback(true);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [audioUrl, minutes]);

  const togglePlay = () => {
    // If using speech synthesis fallback
    if (useSpeechFallback || !audioUrl) {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      if (speechSynthesisActive) {
        window.speechSynthesis.cancel();
        setSpeechSynthesisActive(false);
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = playbackRate;
        utterance.onend = () => {
          setSpeechSynthesisActive(false);
          setIsPlaying(false);
        };
        utterance.onerror = () => {
          setSpeechSynthesisActive(false);
          setIsPlaying(false);
        };
        window.speechSynthesis.speak(utterance);
        setSpeechSynthesisActive(true);
        setIsPlaying(true);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Play error, switching to speech fallback:", err);
        setUseSpeechFallback(true);
        togglePlay();
      });
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current && !useSpeechFallback) {
      audioRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || !isFinite(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Hidden audio element */}
      {audioUrl && !useSpeechFallback && (
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      )}

      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: "0.78rem",
            color: "var(--accent-emerald)",
            background: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            padding: "3px 10px",
            borderRadius: "99px",
            fontWeight: 600,
          }}
        >
          Lesson Ready
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
          {minutes} min &bull; {wordCount} words
        </span>
      </div>

      <div>
        <h2 style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
          {topic}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>
          Your commuter briefing &bull; Researched and structured
        </p>
      </div>

      {/* Large Featured Audio Player Card */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          background: "linear-gradient(180deg, #182235 0%, #121824 100%)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          boxShadow: "0 16px 36px -8px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Scrubber Progress Bar */}
        <div>
          <input
            type="range"
            min={0}
            max={duration || minutes * 60 || 180}
            value={currentTime}
            onChange={handleSeek}
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "99px",
              accentColor: "var(--primary-amber)",
              cursor: "pointer",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-subtle)", marginTop: "6px" }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration || minutes * 60)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Speed selectors */}
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => handleSpeedChange(rate)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  background: playbackRate === rate ? "var(--primary-amber)" : "var(--bg-card)",
                  color: playbackRate === rate ? "#0a0d14" : "var(--text-muted)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Large Play/Pause Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#0a0d14",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(245, 158, 11, 0.4)",
              transition: "transform 0.15s ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1.5"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1.5"></rect>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "3px" }}>
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>

          {/* Download MP3 Button */}
          {audioUrl ? (
            <a
              href={audioUrl}
              download={`${topic ? topic.replace(/[^a-zA-Z0-9]/g, "_") : "lesson"}.mp3`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-main)",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>MP3</span>
            </a>
          ) : (
            <div style={{ width: "65px" }} />
          )}
        </div>

        {useSpeechFallback && (
          <div style={{ fontSize: "0.75rem", color: "var(--primary-amber)", textAlign: "center", background: "rgba(245, 158, 11, 0.1)", padding: "4px 8px", borderRadius: "6px" }}>
            Playing via browser speech synthesizer
          </div>
        )}
      </div>

      {/* Expandable Script Card */}
      <div className="glass-panel" style={{ padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={() => setIsScriptExpanded(!isScriptExpanded)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Lesson Script</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", background: "var(--bg-app)", padding: "2px 8px", borderRadius: "99px" }}>
              {wordCount} words
            </span>
          </div>
          <span style={{ fontSize: "0.82rem", color: "var(--primary-amber)", fontWeight: 600 }}>
            {isScriptExpanded ? "Collapse ▲" : "Read Full Script ▼"}
          </span>
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            whiteSpace: "pre-line",
            maxHeight: isScriptExpanded ? "800px" : "80px",
            overflow: "hidden",
            position: "relative",
            transition: "max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {script}
          {!isScriptExpanded && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "40px",
                background: "linear-gradient(180deg, transparent 0%, var(--bg-card) 100%)",
              }}
            />
          )}
        </div>
      </div>

      {/* Verified Sources List */}
      <div className="glass-panel" style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Verified Sources</span>
          <span style={{ fontSize: "0.72rem", color: "var(--accent-emerald)", fontWeight: 600 }}>
            {sources?.length || 0} cited
          </span>
        </div>

        {sources && sources.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sources.map((src, i) => (
              <a
                key={i}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  background: "var(--bg-app)",
                  border: "1px solid var(--border-subtle)",
                  color: "var(--text-main)",
                  fontSize: "0.82rem",
                  textDecoration: "none",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--primary-amber)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: "8px" }}>
                  {src.title || src.url}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary-amber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>
            No external sources attached for this briefing.
          </p>
        )}
      </div>

      {/* Action to create another lesson */}
      <button
        type="button"
        className="btn-secondary"
        onClick={onNewLesson}
        style={{ marginTop: "4px" }}
      >
        <span>&larr; Learn Another Topic</span>
      </button>
    </div>
  );
}
