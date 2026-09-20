// CommuteClass core pipeline
// Setup:  npm i @anthropic-ai/sdk node-edge-tts
// Run:    ANTHROPIC_API_KEY=sk-... node pipeline.mjs "how do vaccines work" beginner 5
//         (args: topic, level, minutes)

import Anthropic from "@anthropic-ai/sdk";
import { EdgeTTS } from "node-edge-tts";
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";

const MODEL = "claude-fable-5-1";
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const textOf = (msg) =>
  msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");

// ---------- 1. Clarifying questions ----------
export async function clarify(topic) {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    system:
      "You personalise audio lessons. Return ONLY valid JSON. No markdown, no commentary.",
    messages: [
      {
        role: "user",
        content: `Topic: "${topic}"
Write exactly 3 short clarifying questions that would change how this lesson is taught (the learner's current level, their goal, and one topic-specific angle). Each question has 3 short answer options.
Return: {"questions":[{"q":"...","options":["...","...","..."]}]}`,
      },
    ],
  });
  return JSON.parse(textOf(msg).replace(/```json|```/g, "").trim());
}

// ---------- 2. Research (Claude's built-in web search) ----------
export async function research(topic, level, goal = "general understanding") {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 4000,
    tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
    messages: [
      {
        role: "user",
        content: `Research "${topic}" for a ${level} learner whose goal is: ${goal}.
Search the web, then write dense, accurate research notes: the key ideas in a logical teaching order, 2-3 concrete examples or numbers, and common misconceptions. Plain text only.`,
      },
    ],
  });

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
  return { notes: textOf(msg), sources };
}

// ---------- 3. Script written for the ear ----------
export async function writeScript(topic, notes, level, minutes, language = "English") {
  const targetWords = Math.round(minutes * 150);
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 6000,
    system: `You write spoken audio lessons for people walking or commuting with headphones.
Rules: write in ${language}. Short, clear sentences. Conversational, warm tone. No bullet points, headings, markdown, or symbols. Spell out numbers and abbreviations naturally. Start with a one-line hook, teach in a logical order, use one vivid example, end with a 2-sentence recap. Output ONLY the words to be spoken.`,
    messages: [
      {
        role: "user",
        content: `Topic: ${topic}
Learner level: ${level}
Target length: about ${targetWords} words (${minutes} minutes when spoken).

Research notes to base the lesson on:
${notes}`,
      },
    ],
  });
  return textOf(msg).trim();
}

// ---------- 4. Free TTS (Edge neural voices, no API key) ----------
function splitText(text, max = 1500) {
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
export async function synthesize(script, outFile, voice = "en-IN-NeerjaNeural") {
  const chunks = splitText(script);
  const buffers = [];
  for (let i = 0; i < chunks.length; i++) {
    const part = `${outFile}.part${i}`;
    const tts = new EdgeTTS({
      voice,
      lang: voice.slice(0, 5),
      outputFormat: "audio-24khz-48kbitrate-mono-mp3",
    });
    await tts.ttsPromise(chunks[i], part);
    buffers.push(await fs.readFile(part));
    await fs.unlink(part);
  }
  // Plain MP3 concatenation plays fine in browsers
  await fs.writeFile(outFile, Buffer.concat(buffers));
}

// ---------- Full pipeline ----------
export async function generateLesson({ topic, level, goal, minutes, voice, onProgress = () => {} }) {
  onProgress("researching");
  const { notes, sources } = await research(topic, level, goal);
  onProgress("writing");
  const script = await writeScript(topic, notes, level, minutes);
  onProgress("recording");
  await fs.mkdir("./out", { recursive: true });
  const audioFile = `./out/lesson-${Date.now()}.mp3`;
  await synthesize(script, audioFile, voice);
  onProgress("done");
  return { script, sources, audioFile };
}

// ---------- CLI test ----------
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [topic = "how do vaccines work", level = "beginner", minutes = "3"] = process.argv.slice(2);
  console.time("total");
  const result = await generateLesson({
    topic,
    level,
    minutes: Number(minutes),
    onProgress: (s) => console.log("->", s),
  });
  console.timeEnd("total");
  console.log("\nAudio:", result.audioFile);
  console.log("Words:", result.script.split(/\s+/).length);
  console.log("Sources:", result.sources.map((s) => s.url).join("\n  "));
  await fs.writeFile("./out/last-script.txt", result.script);
}
