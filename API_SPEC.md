# API_SPEC.md

Contract between backend (Person A) and frontend (Person B). Update this
file first if the shape needs to change, so both sides stay in sync.

## `POST /api/clarify`

**Request**

```json
{ "topic": "how do vaccines work" }
```

**Response** `200`

```json
{
  "questions": [
    {
      "q": "What's your current level with this topic?",
      "options": ["Complete beginner", "Some background", "Pretty familiar already"]
    },
    {
      "q": "What do you mainly want out of this?",
      "options": ["Quick overview", "Understand how it actually works", "Prep for a conversation/exam"]
    },
    {
      "q": "Any specific angle you care about?",
      "options": ["The science/mechanism", "The history", "Why it's debated/controversial"]
    }
  ]
}
```

- Always exactly 3 questions, each with 3 options.
- Options are the values sent back verbatim in the `/api/generate` request
  as `level`, `goal`, and `angle` — the frontend doesn't need to invent
  its own vocabulary, just echo what the user picked.

**Errors**

- `400` if `topic` is missing or empty: `{ "error": "topic is required" }`
- `502` if the model call fails: `{ "error": "clarify_failed" }`

## `POST /api/generate`

**Request**

```json
{
  "topic": "how do vaccines work",
  "level": "Complete beginner",
  "goal": "Understand how it actually works",
  "angle": "The science/mechanism",
  "minutes": 5,
  "voice": "en-IN-NeerjaNeural"
}
```

- `minutes` is one of `3`, `5`, `10`.
- `voice` is optional; defaults to `en-IN-NeerjaNeural` server-side if
  omitted.

**Response**: a streamed sequence of newline-delimited JSON events
(Server-Sent Events, `Content-Type: text/event-stream`), in this order:

```
event: progress
data: {"stage":"researching"}

event: progress
data: {"stage":"writing"}

event: progress
data: {"stage":"recording"}

event: done
data: {"script":"...","sources":[{"title":"...","url":"..."}],"audioUrl":"/out/lesson-<id>.mp3"}
```

- The frontend's progress screen listens for `event: progress` and maps
  `stage` to its three-step UI. It listens for `event: done` to move to
  the result page.
- If any stage fails, emit `event: error` with
  `data: {"stage":"<stage>","message":"..."}` and stop the stream — the
  frontend should show a clear error state, not hang.

**Word count target:** `script` should land within ±15% of
`minutes × 150` words.

**Sources:** every entry must be a real URL returned by the research step
— never fabricated. If research genuinely returns nothing, `sources` is
an empty array, not invented entries.

## `GET /out/<file>.mp3`

Static file serving of generated audio from the local `./out` folder
(Next.js can serve this directly from `public/out` if it's easier —
whichever Person A and B agree on first, since it only matters that
`audioUrl` in the `done` event resolves).
