const integerFromEnv = (name, fallback) => {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) ? value : fallback;
};

export const config = Object.freeze({
  models: {
    clarify: process.env.ANTHROPIC_CLARIFY_MODEL || "claude-3-5-haiku-20241022",
    research: process.env.ANTHROPIC_RESEARCH_MODEL || "claude-3-5-haiku-20241022",
    script: process.env.ANTHROPIC_SCRIPT_MODEL || "claude-fable-5-1",
  },
  defaultVoice: process.env.DEFAULT_TTS_VOICE || "en-IN-NeerjaNeural",
  defaultLanguage: process.env.DEFAULT_LESSON_LANGUAGE || "English",
  wordsPerMinute: integerFromEnv("LESSON_WORDS_PER_MINUTE", 150),
  maxResearchUses: integerFromEnv("RESEARCH_MAX_USES", 5),
  outputDirectory: process.env.LESSON_OUTPUT_DIRECTORY || "public/out",
  allowedMinutes: Object.freeze(
    (process.env.ALLOWED_LESSON_MINUTES || "3,5,10")
      .split(",")
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter(Number.isFinite),
  ),
});