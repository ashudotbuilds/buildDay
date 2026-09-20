import fs from "node:fs/promises";
import path from "node:path";
import { generateLesson } from "../../../lib/pipeline.mjs";
import { config } from "../../../lib/config.mjs";

export const runtime = "nodejs";
export const maxDuration = 60;

const allowedMinutes = new Set(config.allowedMinutes);

const progressEvent = (stage, payload = {}) =>
  `event: ${stage === "done" ? "done" : "progress"}\ndata: ${JSON.stringify(
    stage === "done" ? payload : { stage },
  )}\n\n`;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  if (
    typeof body.topic !== "string" ||
    !body.topic.trim() ||
    !allowedMinutes.has(Number(body.minutes))
  ) {
    return Response.json({ error: "invalid_request" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  let currentStage = "researching";
  const stream = new ReadableStream({
    async start(controller) {
      const send = (value) => controller.enqueue(encoder.encode(value));
      try {
        const result = await generateLesson({
          topic: body.topic.trim(),
          level: body.level || "Complete beginner",
          goal: body.goal || "Quick overview",
          angle: body.angle || "The science/mechanism",
          minutes: Number(body.minutes),
          voice: body.voice || config.defaultVoice,
          language: body.language || config.defaultLanguage,
          onProgress: (stage) => {
            currentStage = stage;
            if (stage !== "done") send(progressEvent(stage));
          },
        });

        // Generate clean self-contained Data URI for seamless Vercel serverless playback
        let audioUrl = `/out/${path.basename(result.audioFile)}`;
        try {
          const audioBuffer = await fs.readFile(result.audioFile);
          audioUrl = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;
        } catch {
          // Fall back to relative URL if file read fails
        }

        send(
          progressEvent("done", {
            script: result.script,
            sources: result.sources,
            audioUrl,
          }),
        );
      } catch (error) {
        send(
          `event: error\ndata: ${JSON.stringify({
            stage: currentStage,
            message: error?.message || String(error) || "generation_failed",
          })}\n\n`,
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}