# CLAUDE.md

Claude Code: read `AGENTS.md` first — it is the single source of truth for
this project's goal, stack, structure, conventions, and task ownership.
Everything below is Claude-Code-specific and additive, not a replacement.

## First action in this repo

Run the existing pipeline once before touching any code:

```bash
ANTHROPIC_API_KEY=your_key node pipeline.mjs "how do vaccines work" beginner 3
```

Report exactly what each of `clarify`, `research`, `writeScript`, and
`synthesize` returned (or threw). Don't assume `pipeline.mjs` works —
confirm it, then fix whatever's broken before building the API routes on
top of it.

## Model

Use `claude-fable-5-1` for every LLM call in this project (clarify,
research, script writing). Use the exact system prompts in `PROMPTS.md` —
they encode the JSON-only output contract the API routes parse against.
If you change a prompt's expected output shape, update `PROMPTS.md` and
`API_SPEC.md` in the same change so they stay in sync.

## When implementing `/api/generate`

This must stream `researching` → `writing` → `recording` → `done` events
before the final JSON payload (see `AGENTS.md` → Non-obvious patterns, and
`API_SPEC.md` for the exact event/payload shapes). Build and test this
streaming behavior directly — a version that just returns one big response
at the end will look broken against the progress-screen UI Person B is
building against the same contract.

## Scope discipline

If a request would add login, accounts, payments, a database, or anything
else listed as out-of-scope in `PRD.md` §6, say so and suggest it as a
"next steps" line for the pitch instead of building it.
