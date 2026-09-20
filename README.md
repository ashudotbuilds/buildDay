# CommuteClass

CommuteClass turns a topic and available commute time into a source-backed audio lesson.

## Production deployment

This app writes generated MP3 files to `LESSON_OUTPUT_DIRECTORY`. The included Docker setup uses a named volume so audio survives container restarts. This is the recommended production deployment for the current local-storage API contract.

1. Create the production environment file:

```powershell
Copy-Item .env.example .env.production
```

2. Set a valid `ANTHROPIC_API_KEY` in `.env.production`. Keep this file private and never commit it.

3. Start the production container:

```powershell
docker compose up -d --build
```

4. Verify the deployment:

```powershell
Invoke-WebRequest http://localhost:3000/api/health
```

Open `http://localhost:3000` in a browser. Logs are available with `docker compose logs -f commuteclass`.

## Environment

See `.env.example` for model, TTS, duration, output, and frontend settings. The three Anthropic model variables default to `claude-haiku-4-5-20251001`.

## Local production check

```powershell
npm ci
npm run build
npm start
```

The Anthropic key is required for live lessons. The generated audio directory must be writable by the app process.

## Important hosting note

Do not deploy the current audio implementation to a serverless platform with ephemeral local storage. Generated audio can disappear after an instance restart. For Vercel or another serverless host, replace local output storage with object storage such as Vercel Blob or S3 while keeping the `audioUrl` response shape unchanged.