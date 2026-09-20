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
    return Response.json(await clarify(body.topic.trim()));
  } catch {
    return Response.json({ error: "clarify_failed" }, { status: 502 });
  }
}