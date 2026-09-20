"use client";

import { useState } from "react";
import InputScreen from "../components/InputScreen";
import QuestionsScreen from "../components/QuestionsScreen";
import ProgressScreen from "../components/ProgressScreen";
import ResultScreen from "../components/ResultScreen";
import ErrorScreen from "../components/ErrorScreen";
import { mockClarify, mockGenerateStream, DEMO_LESSON_DATA } from "../components/mockApi";

// Master toggle flag requested: switch between mock layer and real API routes
export const USE_MOCK = true;

export default function Home() {
  const [screen, setScreen] = useState("input"); // "input" | "questions" | "progress" | "result" | "error"
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lessonResult, setLessonResult] = useState(null);
  const [currentStage, setCurrentStage] = useState("researching");
  const [selectedMinutes, setSelectedMinutes] = useState(5);

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

  // Handle start generation (streaming)
  const handleGenerate = async (params) => {
    setSelectedMinutes(params.minutes);
    setCurrentStage("researching");
    setScreen("progress");
    setErrorMsg("");

    if (USE_MOCK) {
      await mockGenerateStream(
        params,
        (stage) => setCurrentStage(stage),
        (result) => {
          setLessonResult({ ...result, topic: params.topic, minutes: params.minutes });
          setScreen("result");
        },
        (err) => {
          setErrorMsg(err);
          setScreen("error");
        }
      );
      return;
    }

    // Real API streaming route connection (Task 7 contract)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Generation failed (${response.status})`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        let currentEvent = null;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("event:")) {
            currentEvent = trimmed.replace("event:", "").trim();
          } else if (trimmed.startsWith("data:")) {
            const dataStr = trimmed.replace("data:", "").trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (currentEvent === "progress" && data.stage) {
                setCurrentStage(data.stage);
              } else if (currentEvent === "done") {
                setLessonResult({ ...data, topic: params.topic, minutes: params.minutes });
                setScreen("result");
              } else if (currentEvent === "error") {
                throw new Error(data.message || `Error during ${data.stage || "generation"}`);
              }
            } catch (jsonErr) {
              if (currentEvent === "error") throw jsonErr;
              console.warn("Failed to parse event JSON:", dataStr);
            }
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setErrorMsg(err.message || "Failed to generate lesson audio");
      setScreen("error");
    }
  };

  // Handle Load Demo Lesson (plays demo1.mp3 and shows demo1.json)
  const handleLoadDemo = async () => {
    try {
      const res = await fetch("/demo/demo1.json");
      if (res.ok) {
        const data = await res.json();
        setLessonResult({
          ...data,
          audioUrl: data.audioUrl || "/demo/demo1.mp3",
        });
        setTopic(data.topic || "How do vaccines work");
        setScreen("result");
        return;
      }
    } catch (e) {
      console.warn("Failed to load /demo/demo1.json, using fallback object:", e);
    }
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
          onGenerate={handleGenerate}
          isGenerating={false}
        />
      )}

      {screen === "progress" && (
        <ProgressScreen
          currentStage={currentStage}
          topic={topic}
          minutes={selectedMinutes}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          lesson={lessonResult}
          onNewLesson={() => {
            setScreen("input");
            setTopic("");
            setQuestions([]);
            setLessonResult(null);
          }}
        />
      )}

      {screen === "error" && (
        <ErrorScreen
          message={errorMsg}
          onTryAgain={() => setScreen("input")}
          onLoadDemo={handleLoadDemo}
        />
      )}
    </div>
  );
}
