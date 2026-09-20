import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]+\.mp3$/.test(id)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const audio = await fs.readFile(path.resolve("public/out", id));
    return new Response(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return Response.json({ error: "not_found" }, { status: 404 });
  }
}