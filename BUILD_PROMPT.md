# Build Prompts for CommuteClass

## Before you paste anything (5 minutes)

1. Create the project folder and open your coding agent (for example Claude Code) in it.
2. Put these files in the folder root: `CLAUDE.md`, `pipeline.mjs`, `.env.example`.
3. Copy `.env.example` to `.env.local` and add your real Anthropic API key.
4. Paste one of the prompts below.

**One person, one agent:** use the Master Prompt.
**Two people, two agents in parallel:** use Prompt A (backend) and Prompt B (frontend). Commit to different folders so you don't clash: A owns `lib/` and `app/api/`, B owns `app/page.js`, `app/layout.js`, and `components/`. Sync when both are done.

---

## Master Prompt (single agent)

```
You are building CommuteClass, a buildathon project. First read CLAUDE.md completely. It defines the product, the hard rules, the API contract, the folder structure, and the definition of done. Follow it exactly.

Work in this order. After each phase, run it, verify it works, commit, and give me a 2-line status before continuing.

PHASE 0: Setup
- Initialise a Next.js App Router project in the current folder using JavaScript (no TypeScript) with Tailwind CSS. Do not overwrite CLAUDE.md, pipeline.mjs, or .env.local.
- Install @anthropic-ai/sdk and node-edge-tts.
- Make sure .gitignore includes .env.local, out/, and node_modules.
- Move pipeline.mjs to lib/pipeline.mjs.

PHASE 1: Prove the pipeline
- Run the pipeline from the command line: node lib/pipeline.mjs "how do vaccines work" beginner 3
- Fix anything that breaks (model access, web search tool type, TTS package API). If the web search tool is rejected or TTS fails for a reason you cannot fix in 10 minutes, stop and tell me exactly what happened and what the options are.
- Report: total time, word count vs the 450-word target, and the path of the MP3. Add a language parameter passthrough to generateLesson.
- Tune the script prompt if the script reads like an article rather than speech.

PHASE 2: Backend routes
- Build /api/clarify, /api/generate (NDJSON streaming, stages: researching, writing, recording, done, error), and /api/audio/[id], exactly per the API contract in CLAUDE.md.
- Test each route with curl. Show me the curl commands and outputs.

PHASE 3: Frontend
- Build the UI in app/page.js and components/ as a single-page state machine: input, questions (with duration and language pickers), progress, result.
- Progress screen reads the NDJSON stream and highlights the current stage.
- Result screen: large audio player, MP3 download button, expandable script, source links.
- Clean, modern, mobile-friendly design. Make it look like a real product, not a template.

PHASE 4: Resilience and demo
- Friendly error states everywhere. Every error shows a "Load demo lesson" button.
- Generate 2 demo lessons using the real pipeline (pick topics: "how do vaccines work" and one more I will name) and save them to public/demo/ as MP3 plus JSON. Add a "Try a demo" option on the home screen.
- Add a small loading state so the app never looks frozen during the 30-60 second generation.

PHASE 5: Final check
- Run the full flow end to end twice with different topics. Report generation time and any problems.
- Write a short README.md with setup steps and how to run.

Rules: keep it simple, do not add features outside CLAUDE.md, never change the model from claude-fable-5-1, and ask me before making any change to the API contract. Begin with Phase 0.
```

---

## Prompt A: Backend agent (person A)

```
You are the backend agent for CommuteClass. Read CLAUDE.md fully first. You own lib/ and app/api/. Do NOT touch app/page.js, app/layout.js, or components/, because another agent is building those in parallel.

Tasks, in order (verify and commit after each):
1. Initialise the Next.js project (JavaScript, App Router, Tailwind) only if it does not exist yet; otherwise pull the latest. Install @anthropic-ai/sdk and node-edge-tts. Move pipeline.mjs to lib/pipeline.mjs.
2. Run node lib/pipeline.mjs "how do vaccines work" beginner 3 and fix whatever breaks. Report time, word count vs 450 target, and MP3 path. Stop and tell me if web search or TTS cannot be made to work.
3. Add language passthrough to generateLesson and tune the script prompt so it sounds like natural speech.
4. Build /api/clarify, /api/generate (NDJSON streaming), and /api/audio/[id] exactly per the contract in CLAUDE.md. Test each with curl.
5. Pre-generate two demo lessons into public/demo/ (demo1.mp3/json, demo2.mp3/json) using the real pipeline.
6. Measure generation time for 3, 5, and 10 minute lessons and report bottlenecks with suggestions.

Do not change the API contract without asking me. Give me a short status after each task.
```

---

## Prompt B: Frontend agent (person B)

```
You are the frontend agent for CommuteClass. Read CLAUDE.md fully first. You own app/page.js, app/layout.js, components/, and styling. Do NOT touch lib/ or app/api/, because another agent is building the backend in parallel.

The backend does not exist yet, so build against the API contract in CLAUDE.md using a mock layer: create lib-free mock functions inside components/ or a mock file (for example components/mockApi.js) that return the exact response shapes, including a fake NDJSON-style stage progression with delays. Add a single flag (USE_MOCK) at the top of the page so switching to the real API is one line.

Tasks, in order (verify in the browser and commit after each):
1. Layout and design system: clean, modern, mobile-first, real-product feel. Choose a distinctive but simple look; not a generic template.
2. Input screen: topic box, three example topic chips, a "Try a demo" link.
3. Questions screen: 3 multiple-choice cards from the clarify response, duration picker (3, 5, 10 min), language picker (English, Hindi, Marathi).
4. Progress screen: three stages (Researching, Writing, Recording) with the current stage highlighted and a friendly animated state.
5. Result screen: large audio player, MP3 download button, expandable script, source links list.
6. Error state with a "Load demo lesson" button that plays public/demo/demo1.mp3 and shows demo1.json.
7. When I say the backend is ready, switch USE_MOCK off and connect to the real routes, reading the NDJSON stream line by line.

Keep components small and simple. Give me a short status after each task with what to look at in the browser.
```

---

## When something goes wrong

Paste this to the agent:
```
Stop. Show me the exact error and the last command you ran. Do not try a different approach yet. Tell me your top 2 hypotheses, then fix the most likely one and re-run.
```

If you run out of time, cut in this order: Hindi/Marathi, 10-minute option, download button. Never cut the clarifying questions, the duration fitting, or the demo fallback.
