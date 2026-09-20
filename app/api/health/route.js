import { config } from "../../../lib/config.mjs";

export const runtime = "nodejs";

export function GET() {
  return Response.json({
    status: "ok",
    service: "commuteclass",
    model: config.models.script,
  });
}