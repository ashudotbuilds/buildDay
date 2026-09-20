# TASKS.md

Live checklist for the 6-hour build. Check items off as you go — this is
also your fallback pitch material if the demo needs to explain what's done
vs "next steps."

## 0:00–0:30 — Bootstrap

- [ ] Repo created, both people cloned
- [ ] `npm install`, `.env.local` created with `ANTHROPIC_API_KEY` (not committed)
- [ ] **(A)** Run `node pipeline.mjs "how do vaccines work" beginner 3` once, record what each function actually returned
- [ ] **(A)** Confirm web search tool is enabled in Console settings; if not, note it and use the fallback research prompt from `PROMPTS.md`
- [ ] **(B)** Confirm `node-edge-tts` produces a playable MP3 locally — test this early, it's an unofficial package and the #2 risk in `PRD.md`

## 0:30–2:00 — Backend pipeline solid / UI skeleton

- [ ] **(A)** Fix whatever's broken in `pipeline.mjs`'s four functions
- [ ] **(A)** Confirm `clarify()` output matches the shape in `API_SPEC.md`
- [ ] **(A)** Confirm `research()` returns real URLs, not fabricated ones
- [ ] **(A)** Confirm `writeScript()` hits the word-count target within 15%
- [ ] **(A)** Confirm `synthesize()` produces a valid MP3 in `./out`
- [ ] **(B)** Build topic input screen
- [ ] **(B)** Build question-card component against mocked `/api/clarify` response
- [ ] **(B)** Build duration picker (3 / 5 / 10 min)

## 2:00–3:30 — Clarify step wired / streaming route

- [ ] **(A)** Implement `POST /api/clarify` calling the real pipeline function
- [ ] **(A)** Implement `POST /api/generate` as a streaming route emitting `researching` → `writing` → `recording` → `done` per `API_SPEC.md`
- [ ] **(A)** Add error events for failed stages, don't let the stream just hang
- [ ] **(B)** Build progress screen consuming streamed events against a mocked stream
- [ ] **(B)** Build result page: audio player, script text, source links, download button

## 3:30–4:30 — Wire UI to real API

- [ ] **(B)** Swap mocked responses for real `/api/clarify` and `/api/generate` calls
- [ ] **(A + B)** Full click-through test: topic → questions → duration → progress → result, at least 3 times with different topics
- [ ] **(B)** Wire browser `speechSynthesis` fallback for when the MP3 doesn't arrive

## 4:30–5:15 — Polish, error handling, fallback

- [ ] **(A + B)** Pre-generate 2–3 demo topics' full output (MP3 + script + sources) and save them as an offline fallback
- [ ] **(A)** Add basic error states for each API failure mode (missing topic, model failure, TTS failure)
- [ ] **(B)** Visual polish pass on all 4 screens
- [ ] **(A + B)** Run the 10-minute venue validation (4–5 people): commute audio habits, wanted-a-podcast-that-didn't-exist, would-use-this-over-ChatGPT — note answers for the pitch

## 5:15–6:00 — Demo rehearsal and buffer

- [ ] Full run-through of the demo plan from `PRD.md` at least twice
- [ ] Confirm the pre-generated fallback plays with zero network calls, in case live demo fails
- [ ] Decide: final product name, default voice, which 2–3 fallback topics
- [ ] One person owns the "next steps" closing line (accounts, quizzes, regional languages) — rehearse it in under 15 seconds

## Stretch (only if everything above is done with time left)

- [ ] Hindi or Marathi voice option
