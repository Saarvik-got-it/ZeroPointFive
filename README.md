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

### Local Whisper Transcription Setup (Optional / Highly Recommended)
To transcribe videos locally using Whisper Large v3 (improving accuracy for Hinglish/multilingual episodes):

1. **Prerequisites**: Ensure you have Python >= 3.9 (e.g. 3.12) and `ffmpeg` installed and available in your system `PATH`.
2. **Install Python Packages**: In your terminal, run:
   ```bash
   pip install yt-dlp faster-whisper
   ```
3. **Configure Environment**: Set the following variables in your `backend/.env` file:
   ```env
   TRANSCRIPT_PROVIDER=whisper
   TRANSCRIPT_FALLBACK=youtube
   WHISPER_MODEL=large-v3
   WHISPER_MODEL_DIR=./backend/models/whisper
   HF_HOME=./backend/models/huggingface
   TRANSFORMERS_CACHE=./backend/models/huggingface
   ```
   *Note: Model downloads (approx. 3GB) will automatically be saved into the project's `backend/models/` folder instead of your C:\ drive system folders. This folder is ignored in Git.*

## Content Pipeline (Adding/Updating a video)

To ingest a new podcast into the system:

1. Ensure the backend `.env` is configured.
2. In the root `backend` folder, run:
   ```bash
   npm run process-video "<YOUTUBE_URL>"
   ```
   This will download the audio (if using Whisper), transcribe, generate the articles through Gemini, and write the structured JSON dataset in `backend/data/episodes/<slug>.json`.

To regenerate the articles and AI summaries reusing the cached transcript (faster, avoids re-transcribing):

```bash
npm run regenerate-video "<existing-episode-slug>"
```

To force a full re-transcription with Whisper (deletes cached transcript and re-transcribes audio from scratch):

```bash
npm run regenerate-transcript "<existing-episode-slug>"
```

## Future Automation

This system is designed so that `processVideo()` can be hooked up to a YouTube webhook or a scheduled CRON job eventually. The frontend UI dynamically renders based on whatever the backend `EpisodeRepository` serves, requiring no rebuilds when new videos are published.
