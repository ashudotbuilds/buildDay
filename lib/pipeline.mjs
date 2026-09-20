// CommuteClass core pipeline
// Setup:  npm i @anthropic-ai/sdk node-edge-tts
// Run:    ANTHROPIC_API_KEY=sk-... node pipeline.mjs "how do vaccines work" beginner 5
//         (args: topic, level, minutes)

import Anthropic from "@anthropic-ai/sdk";
import { EdgeTTS } from "node-edge-tts";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { config } from "./config.mjs";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const textOf = (msg) =>
  msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");

const parseJson = (text) =>
  JSON.parse(text.replace(/```json|```/g, "").trim());

// ---------- 1. Clarifying questions ----------
export async function clarify(topic) {
  const msg = await client.messages.create({
    model: config.models.clarify,
    max_tokens: 600,
    system: `You write short clarifying questions for a topic-to-audio-lesson app.
Return exactly 3 multiple-choice questions for the listener's level, goal, and
one topic-specific angle. Each question has exactly 3 short options. Keep each
question under 12 words and each option under 6 words. Respond with ONLY valid
JSON in this shape: {"questions":[{"q":"...","options":["...","...","..."]}]}`,
    messages: [
      {
        role: "user",
        content: `Topic: ${topic}`,
      },
    ],
  });
  return parseJson(textOf(msg));
}

// ---------- 2. Research (Claude's built-in web search) ----------
export async function research(topic, level, goal = "general understanding", angle = "") {
  const userContent = `Topic: ${topic}
Listener level: ${level}
Listener goal: ${goal}
Angle to focus on: ${angle}`;
  const system = `You are researching a topic to script a short spoken audio lesson.
Produce concise research notes with key facts, one or two vivid concrete examples
or numbers, and anything surprising or non-obvious. Respond with ONLY valid JSON:
{"notes":"...","sources":[{"title":"...","url":"..."}]}. Every URL must be
a real page found via search. If search returns nothing useful, use an empty array.`;
  let msg;
  let usedSearch = true;
  try {
    msg = await client.messages.create({
      model: config.models.research,
      max_tokens: 4000,
      system,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: config.maxResearchUses }],
      messages: [{ role: "user", content: userContent }],
    });
  } catch (error) {
    if (error?.status !== 400) throw error;
    usedSearch = false;
    msg = await client.messages.create({
      model: config.models.research,
      max_tokens: 4000,
      system: `${system} You do not have web search. Rely on conservative general
knowledge and return an empty sources array.`,
      messages: [{ role: "user", content: userContent }],
    });
  }

  const parsed = parseJson(textOf(msg));
  if (!usedSearch) return { notes: parsed.notes, sources: [] };

  const seen = new Set();
  const sources = [];
  for (const block of msg.content) {
    if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
      for (const r of block.content) {
        if (r.url && !seen.has(r.url)) {
          seen.add(r.url);
          sources.push({ title: r.title, url: r.url });
        }
      }
    }
  }
  return { notes: parsed.notes, sources: sources.length ? sources : parsed.sources ?? [] };
}

// ---------- 3. Script written for the ear ----------
export async function writeScript(topic, notes, level, minutes, language = config.defaultLanguage, goal = "general understanding", angle = "") {
  const targetWords = Math.round(minutes * config.wordsPerMinute);
  const msg = await client.messages.create({
    model: config.models.script,
    max_tokens: 6000,
    system: `You write scripts for spoken audio lessons for commuters. Write in ${language} for the ear, not the page. Use short sentences, contractions, and a warm conversational tone. Do not use headings, bullets, markdown, or symbols. Open with a hook, include a vivid concrete example, and close with a short recap. Never begin with "Today we're going to talk about". Target about ${targetWords} words, within 15 percent. Respond with ONLY valid JSON in this shape: {"script":"..."}`,
    messages: [
      {
        role: "user",
        content: `Topic: ${topic}
Listener level: ${level}
Listener goal: ${goal}
Angle to focus on: ${angle}
Target minutes: ${minutes}
Target words: ${targetWords}

Research notes:
${notes}`,
      },
    ],
  });
  return parseJson(textOf(msg)).script.trim();
}

// ---------- 4. Free TTS (Edge neural voices, no API key) ----------
function splitText(text, max = config.ttsChunkLength) {
  const out = [];
  let cur = "";
  for (const s of text.split(/(?<=[.!?\u0964])\s+/)) {
    if (cur && (cur + " " + s).length > max) {
      out.push(cur);
      cur = s;
    } else {
      cur = cur ? cur + " " + s : s;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// Voices: en-US-AriaNeural, en-IN-NeerjaNeural, hi-IN-SwaraNeural, mr-IN-AarohiNeural
export async function synthesize(script, outFile, voice = config.defaultVoice) {
  const chunks = splitText(script);
  const buffers = [];
  for (let i = 0; i < chunks.length; i++) {
    const part = `${outFile}.part${i}`;
    try {
      let lastError;
      for (let attempt = 1; attempt <= config.ttsRetries; attempt++) {
        try {
          const tts = new EdgeTTS({
            voice,
            lang: voice.slice(0, 5),
            outputFormat: "audio-24khz-48kbitrate-mono-mp3",
          });
          await tts.ttsPromise(chunks[i], part);
          buffers.push(await fs.readFile(part));
          lastError = undefined;
          break;
        } catch (error) {
          lastError = error;
          await fs.rm(part, { force: true });
          if (attempt < config.ttsRetries) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 500));
          }
        }
      }
      if (lastError) throw lastError;
    } finally {
      await fs.rm(part, { force: true });
    }
  }
  // Plain MP3 concatenation plays fine in browsers
  await fs.writeFile(outFile, Buffer.concat(buffers));
}

// ---------- Full pipeline ----------
export async function generateLesson({ topic, level, goal, angle, minutes, voice = config.defaultVoice, language = config.defaultLanguage, onProgress = () => {} }) {
  onProgress("researching");
  const { notes, sources } = await research(topic, level, goal, angle);
  onProgress("writing");
  const script = await writeScript(topic, notes, level, minutes, language, goal, angle);
  onProgress("recording");
  const outputDir = path.resolve(config.outputDirectory);
  await fs.mkdir(outputDir, { recursive: true });
  const audioFile = path.join(outputDir, `lesson-${Date.now()}.mp3`);
  await synthesize(script, audioFile, voice);
  onProgress("done");
  return { script, sources, audioFile };
}

// ---------- CLI test ----------
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [topic = "how do vaccines work", level = "beginner", minutes = "3", language = "English"] = process.argv.slice(2);
  console.time("total");
  const result = await generateLesson({
    topic,
    level,
    minutes: Number(minutes),
    language,
    onProgress: (s) => console.log("->", s),
  });
  console.timeEnd("total");
  console.log("\nAudio:", result.audioFile);
  console.log("Words:", result.script.split(/\s+/).length);
  console.log("Sources:", result.sources.map((s) => s.url).join("\n  "));
  await fs.writeFile(path.join(config.outputDirectory, "last-script.txt"), result.script);
}
