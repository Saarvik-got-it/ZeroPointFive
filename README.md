# The Zero Point Five Show - Personal Brand Website

A high-performance personal brand and podcast hub aiming to automate content generation.

## Project Purpose

To provide a smooth, aesthetic frontend for podcast listeners while establishing a robust backend pipeline capable of taking a YouTube video, extracting metadata and transcripts, and utilizing Gemini AI to generate articles, takeaways, and summaries automatically.

## Setup Instructions & Installation

Make sure you have Node >18.x installed.

### Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` in the root of the project. Include your `GEMINI_API_KEY`.
4. Run server: `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. Run site: `npm run dev`

## Content Pipeline (Adding a new video)

To ingest a new podcast into the system:

1. Ensure the backend `.env` is configured.
2. In the root `backend` folder, run:
   ```bash
   npm run process-video "<YOUTUBE_URL>"
   ```
   This will fetch the transcript, run it through Gemini, create the structured JSON data in `backend/data/episodes/<slug>.json`, and immediately make it available on the frontend.

To tweak the AI prompt or regenerate an existing transcription's AI payload (saves fetching texts):

```bash
npm run regenerate-video "<existing-episode-slug>"
```

## Future Automation

This system is designed so that `processVideo()` can be hooked up to a YouTube webhook or a scheduled CRON job eventually. The frontend UI dynamically renders based on whatever the backend `EpisodeRepository` serves, requiring no rebuilds when new videos are published.
