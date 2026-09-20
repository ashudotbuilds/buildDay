# PRD: CommuteClass (working name)

## 1. Problem

People have regular pockets of "dead time" — commuting, walking, gym, chores —
where their hands and eyes are busy but their ears are free. There's no good
way to turn "I want to learn X right now" into a short audio lesson sized to
the time available. Generic podcasts don't cover the specific topic you want
today; reading isn't an option when you're moving.

## 2. Target users

Students and young professionals who want to learn a specific topic passively
during a fixed window of free time (a bus ride, a walk, a gym session).

## 3. Solution

A web app: type a topic and available time → answer 3 quick clarifying
questions → get a personalised, researched, source-backed audio lesson sized
to that time, with a full script and source links alongside the player.

## 4. Differentiation

Existing topic-to-podcast tools (NotebookLM, ChatGPT voice, etc.) don't do
this well because they skip requirement-gathering and don't fit a time box.
We differentiate on:

1. **Requirement understanding** — 3 clarifying questions (level, goal,
   topic-specific angle) before researching.
2. **Time-boxed audio** — lesson length fits the user's stated time (3, 5,
   or 10 min) at ~150 spoken words/minute.
3. **Transparency** — sources and the full script are shown next to the
   audio, not hidden.

## 5. Core user flow

1. User enters a topic.
2. System returns 3 clarifying questions (multiple choice) + a duration
   picker (3 / 5 / 10 min).
3. User answers. Progress screen shows three stages: Researching → Writing
   → Recording.
4. Result page: audio player, full script, source links, MP3 download.

## 6. In scope / out of scope

**In scope:** everything in the flow above, for one topic at a time, one
English voice by default, no persistence beyond the current session.

**Out of scope (pitch as "next steps"):** login/accounts, saved history,
payments, a mobile app, quizzes, multiple voice choices, Hindi/Marathi
(stretch goal only, see below).

**Stretch goal (only if core flow is solid with time to spare):** Hindi or
Marathi audio output, since the TTS voices are already available.

## 7. Functional requirements

| ID | Requirement |
|----|-------------|
| F1 | `POST /api/clarify` returns exactly 3 multiple-choice questions for a given topic. |
| F2 | User selects a duration: 3, 5, or 10 minutes. |
| F3 | `POST /api/generate` streams progress events (`researching`, `writing`, `recording`, `done`) then returns `{ script, sources, audioUrl }`. |
| F4 | The script's target word count is `minutes × 150`, within a reasonable tolerance (±15%). |
| F5 | Research step uses live web search and returns real, distinct source URLs — not fabricated ones. |
| F6 | The result page plays the generated MP3, shows the full script text, lists clickable sources, and offers an MP3 download. |
| F7 | If TTS fails, the app falls back to browser `speechSynthesis` so the demo never shows silence. |

## 8. Non-functional requirements

| ID | Requirement |
|----|-------------|
| N1 | End-to-end generation (clarify already done → audio ready) should stay under ~90 seconds for a 5-minute lesson. |
| N2 | Progress must be visibly streamed — no single 60+ second blank spinner. |
| N3 | The app must degrade gracefully: if research, scripting, or TTS fails, show a clear error state, not a hang. |
| N4 | No database; state lives in the browser session and the local `./out` folder. |
| N5 | Only one API key (`ANTHROPIC_API_KEY`) is required; nothing else needs a key. |

## 9. Success metrics (for the demo, not production)

- A judge can go from typing a topic to hearing audio in under 2 minutes,
  live, without a rehearsed fallback.
- At least 2 of 3 differentiators (clarifying questions, time-fit, sources
  shown) are visibly demonstrated.
- 4–5 informal user-validation answers collected at the venue are woven
  into the pitch.

## 10. Risks (see also `AGENTS.md` for mitigations owned by the team)

- Generation latency (research + scripting + TTS chained).
- Free/unofficial TTS package (`node-edge-tts`) breaking.
- Script reading like a Wikipedia article instead of something listenable.
- Web search tool not enabled in Console settings.
- Live demo network/API failure during judging.

## 11. Open decisions

- Final product name.
- Default voice: `en-IN-NeerjaNeural` (Indian English) — confirm before demo.
- Which 2–3 topics to pre-generate as an offline fallback.
