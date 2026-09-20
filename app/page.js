"use client";

import { useState } from "react";
import InputScreen from "../components/InputScreen";
import QuestionsScreen from "../components/QuestionsScreen";
import { mockClarify, DEMO_LESSON_DATA } from "../components/mockApi";

// Master toggle flag requested: switch between mock layer and real API routes
export const USE_MOCK = true;

export default function Home() {
  const [screen, setScreen] = useState("input"); // "input" | "questions" | "progress" | "result" | "error"
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lessonResult, setLessonResult] = useState(null);

  // Handle topic submit from InputScreen
  const handleTopicSubmit = async (enteredTopic) => {
    setTopic(enteredTopic);
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (USE_MOCK) {
        const data = await mockClarify(enteredTopic);
        setQuestions(data.questions || []);
        setScreen("questions");
      } else {
        const res = await fetch("/api/clarify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: enteredTopic }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || `Clarify failed (${res.status})`);
        }
        const data = await res.json();
        setQuestions(data.questions || []);
        setScreen("questions");
      }
    } catch (err) {
      console.error("Clarify error:", err);
      setErrorMsg(err.message || "Failed to analyze topic");
      setScreen("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Load Demo Lesson
  const handleLoadDemo = () => {
    setLessonResult(DEMO_LESSON_DATA);
    setTopic(DEMO_LESSON_DATA.topic);
    setScreen("result");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {screen === "input" && (
        <InputScreen
          onSubmitTopic={handleTopicSubmit}
          onLoadDemo={handleLoadDemo}
          isLoading={isLoading}
        />
      )}

      {screen === "questions" && (
        <QuestionsScreen
          topic={topic}
          questions={questions}
          onBack={() => setScreen("input")}
          onGenerate={(params) => {
            // Task 4 will transition to progress screen
            console.log("Generate requested with params:", params);
            setScreen("progress");
          }}
          isGenerating={false}
        />
      )}

      {screen === "progress" && (
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Progress Screen Preview</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "6px" }}>
            Ready for Task 4
          </p>
          <button
            className="btn-secondary"
            onClick={() => setScreen("questions")}
            style={{ marginTop: "16px" }}
          >
            &larr; Back to Questions
          </button>
        </div>
      )}

      {screen === "result" && (
        <div className="glass-panel" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Result Preview</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "6px" }}>
            Lesson: <strong>{lessonResult?.topic}</strong>
          </p>
          <button
            className="btn-secondary"
            onClick={() => setScreen("input")}
            style={{ marginTop: "16px" }}
          >
            &larr; Start New Lesson
          </button>
        </div>
      )}

      {screen === "error" && (
        <div className="glass-panel" style={{ padding: "24px", borderColor: "var(--accent-rose)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-rose)" }}>Error</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "6px" }}>
            {errorMsg}
          </p>
          <button
            className="btn-secondary"
            onClick={() => setScreen("input")}
            style={{ marginTop: "16px" }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
