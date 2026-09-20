# AGENTS.md — CommuteClass

Cross-tool instructions for AI coding agents (Antigravity, Claude Code,
Cursor, Codex). This is the single source of truth for project conventions.
`CLAUDE.md` and `.gemini/GEMINI.md` in this repo just point back here plus
add tool-specific notes.

## Goal

Build, in a 1-hour buildathon, a Next.js app that turns "topic + time
available" into a personalised, source-backed audio lesson. Full context:
see `PRD.md`. Full API contract: see `API_SPEC.md`. Exact model prompts to
use verbatim: see `PROMPTS.md`. Live task list: see `TASKS.md`.

## Tech stack (do not substitute without asking)

- **Framework:** Next.js, App Router, JavaScript (not TypeScript — speed
  over safety today), API routes only, no separate backend server.
- **LLM:** `claude-fable-5-1` via `@anthropic-ai/sdk`, called from server-side
  API routes only (never from the client — the key must not reach the
  browser).
- **Research:** Claude's built-in web search tool, attached to the research
  call. If it 400s or returns no results, fall back to a research call
  without the tool (weaker, but keeps the demo alive) — see `PROMPTS.md`
  for the fallback prompt.
- **TTS:** `node-edge-tts` (free Microsoft Edge neural voices, MP3 output).
  Fallback: browser `speechSynthesis` on the client if the MP3 never
  arrives.
- **Storage:** local `./out` folder for generated MP3s. No database, no
  ORM, no ID system beyond a timestamp/UUID filename.

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
node pipeline.mjs "how do vaccines work" beginner 3   # CLI smoke test of the pipeline only
```

There is no test suite for this buildathon — verify by running the CLI
pipeline and by clicking through the UI. Don't spend time writing unit
tests; spend it making the demo path reliable.

## Structure

```
/pipeline.mjs           # clarify, research, writeScript, synthesize, generateLesson
/app
  /api/clarify/route.js
  /api/generate/route.js
/components              # topic input, question cards, duration picker, progress screen, player
/out                      # generated MP3s (gitignored)
PRD.md
AGENTS.md
CLAUDE.md
TASKS.md
API_SPEC.md
PROMPTS.md
```

## Non-obvious patterns / gotchas

- `pipeline.mjs` exists and is believed to work but **has not been run
  yet**. The very first task for the backend owner is to run it once from
  the CLI and confirm each of the four functions actually returns what it
  claims to, before wiring it into API routes.
- The model to call is `claude-fable-5-1` everywhere — clarify, research,
  and script writing all use the same model. Don't swap in a different
  model string; it changes billing and behavior.
- `node-edge-tts` is an unofficial wrapper around a Microsoft service. It
  can fail intermittently or get rate-limited. Test it in the **first 15
  minutes** of the buildathon, not at hour 4. If it's flaky, keep the
  browser `speechSynthesis` fallback wired in from the start, not bolted
  on later.
- `/api/generate` must be a **streaming** route (Server-Sent Events or a
  streamed `ReadableStream`) that emits `researching` → `writing` →
  `recording` → `done` events, in that order, before the final JSON
  payload. The frontend's progress screen depends on receiving these as
  distinct events, not just a single response at the end.
- Target word count for the script is `minutes × 150`. Enforce this in the
  script-writing prompt (see `PROMPTS.md`), not with post-hoc truncation —
  truncating mid-sentence produces bad audio.
- Pre-generate 2–3 demo lessons and save their MP3 + script + sources to
  `/out` well before the judging window, in case live generation or the
  venue network fails during the demo.

## Permissions / boundaries

- Never commit `.env.local` or any API key. `.env.local` holds
  `ANTHROPIC_API_KEY` only.
- Don't add login, accounts, payments, a database, or a mobile app — all
  explicitly out of scope for the 6-hour build (see `PRD.md` §6). If asked
  to build one of these, push back and suggest it as a "next steps" pitch
  line instead.
- Don't fabricate source URLs. If the research step can't get real sources
  (e.g. web search unavailable), say so in the UI rather than inventing
  citations.

## Conventions

- Keep components small and un-abstracted — this is a demo, not a
  production codebase. Prefer one file per screen over premature shared
  abstractions.
- Commit messages: short, imperative, e.g. `add duration picker`,
  `wire generate route to pipeline`. Commit early and often so there's
  always a working checkpoint to roll back to before the demo.

## Continuity

Two people are working in parallel (see `TASKS.md` for the full split):

- **Person A (backend):** owns `pipeline.mjs`, `/api/clarify`,
  `/api/generate`, prompt tuning, and keeping end-to-end generation under
  ~90 seconds.
- **Person B (frontend + pitch):** owns the Next.js UI end to end (topic
  input, question cards, duration picker, progress screen, result player),
  the demo script, and the pre-generated fallback audio.

The two halves connect only through the API contract in `API_SPEC.md` — if
that contract needs to change, update the doc first so both people stay in
sync, since B can (and should) build the UI against mocked responses while
A gets the real pipeline working.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
