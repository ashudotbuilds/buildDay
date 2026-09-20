import os from "node:os";
import path from "node:path";

const integerFromEnv = (name, fallback) => {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) ? value : fallback;
};

// Vercel, AWS Lambda, or any container where filesystem root is read-only
const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  process.env.NODE_ENV === "production"
);

export const config = Object.freeze({
  models: {
    clarify: process.env.ANTHROPIC_CLARIFY_MODEL || "claude-haiku-4-5-20251001",
    research: process.env.ANTHROPIC_RESEARCH_MODEL || "claude-haiku-4-5-20251001",
    script: process.env.ANTHROPIC_SCRIPT_MODEL || "claude-haiku-4-5-20251001",
  },
  defaultVoice: process.env.DEFAULT_TTS_VOICE || "en-IN-NeerjaNeural",
  defaultLanguage: process.env.DEFAULT_LESSON_LANGUAGE || "English",
  wordsPerMinute: integerFromEnv("LESSON_WORDS_PER_MINUTE", 150),
  maxResearchUses: integerFromEnv("RESEARCH_MAX_USES", 5),
  ttsChunkLength: integerFromEnv("TTS_CHUNK_LENGTH", 800),
  ttsRetries: integerFromEnv("TTS_RETRIES", 3),
  // In serverless environments, ALWAYS use os.tmpdir() to avoid ENOENT / EROFS on read-only lambda filesystems
  outputDirectory: isServerless
    ? path.join(os.tmpdir(), "commuteclass-out")
    : (process.env.LESSON_OUTPUT_DIRECTORY || "public/out"),
  allowedMinutes: Object.freeze(
    (process.env.ALLOWED_LESSON_MINUTES || "3,5,10")
      .split(",")
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter(Number.isFinite),
  ),
});