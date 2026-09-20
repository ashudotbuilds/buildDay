import { clarify } from "../../../lib/pipeline.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "topic is required" }, { status: 400 });
  }

  if (typeof body.topic !== "string" || !body.topic.trim()) {
    return Response.json({ error: "topic is required" }, { status: 400 });
  }

  try {
    const result = await clarify(body.topic.trim());
    return Response.json(result);
  } catch (error) {
    console.error("POST /api/clarify error:", error);
    const message = error?.message || "clarify_failed";
    return Response.json(
      {
        error: message.includes("apiKey")
          ? "Missing ANTHROPIC_API_KEY in environment variables."
          : message,
      },
      { status: 502 }
    );
  }
}