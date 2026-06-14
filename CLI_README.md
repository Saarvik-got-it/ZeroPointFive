# The Zero Point Five Show - CLI Command Reference Guide

This reference guide details all command-line operations available for managing the podcast content pipeline. It covers ingestion, transcription, Gemini AI regeneration, metadata synchronization, and standard development tasks.

---

## 🚀 How to Ingest a New Podcast Episode from Scratch

Follow these step-by-step instructions to take a raw YouTube URL and make it appear live on the Podcasts Hub page with automatically generated magazine-grade articles.

### Step 1: Configure Environment Variables
Ensure that you have your Google Gemini API key configured in your backend environment:
1. Open the [backend/.env](file:///d:/ZeroPointFive/backend/.env) file (create it from `.env.example` if it doesn't exist).
2. Set the `GEMINI_API_KEY` variable:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### Step 2: Run the Ingestion Pipeline
From the **root folder of the project**, navigate to the backend directory and run the processing script with the YouTube URL:
```bash
cd backend
npm run process-video "https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
```
> [!NOTE]
> This command will:
> 1. Fetch YouTube metadata (title, thumbnail, video ID).
> 2. Fetch or generate the transcript (using YouTube captions or local Whisper models depending on your settings).
> 3. Send the transcript to Gemini AI to generate a conversation summary, key takeaways, topics, and two long-form editorial articles.
> 4. Save the finalized JSON output to `backend/data/episodes/<slug>.json`.

### Step 3: Synchronize backend data to the frontend
To push the freshly generated JSON file and its dynamic articles into the static frontend assets, return to the **project root directory** and run the sync script:
```bash
cd ..
npm run sync-demo-content
```
> [!TIP]
> This compiles the newly generated backend data, enriches metadata from `backend/data/episode-metadata.json`, outputs optimized frontend JSON to `frontend/src/data/episodes/`, and updates the dynamic article router index in `frontend/src/data/articleIndex.json`.

### Step 4: Launch the Local Servers
To view the new episode live on your local hub:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser. The new episode card will immediately appear on the Podcasts Hub, and its generated articles will be fully functional and formatted correctly.

---

## 📋 Complete CLI Command Reference Table

Here is a comprehensive overview of all available commands across the monorepo, backend, and frontend modules.

| Command | Working Directory | Command String | Description / Use Case |
| :--- | :--- | :--- | :--- |
| **Install Dependencies** | Monorepo Root | `npm run install:all` | Installs npm dependencies for both `frontend` and `backend` subfolders. |
| **Full Local Start** | Monorepo Root | `npm run dev` | Simultaneously runs the frontend Vite development server (`http://localhost:5173/`) and backend Express server (`http://localhost:5000/`) using concurrently. |
| **Watch & Auto-Sync** | Monorepo Root | `npm run sync-demo-content:watch` | Starts a file watcher on the `backend/data/episodes/` folder, automatically running a synchronization event to the frontend whenever a file is added or changed. |
| **Sync Content Once** | Monorepo Root | `npm run sync-demo-content` | Manually syncs and shapes all backend JSON records to frontend assets and updates the article lookup table. |
| **Process New Video** | `backend/` | `npm run process-video "<YOUTUBE_URL>"` | Executes the raw ingestion pipeline: scrapes metadata, transcribes audio, processes using Gemini AI, and outputs a completed episode JSON structure. |
| **Regenerate AI Content** | `backend/` | `npm run regenerate-video "<episode-slug>"` | Re-runs the Gemini AI content generation prompt using the *existing, cached* transcript. Useful for debugging prompt updates or resolving schema/formatting failures quickly. |
| **Force Re-Transcribe** | `backend/` | `npm run regenerate-transcript "<episode-slug>"` | Deletes the cached transcript for an episode, downloads the video audio again, runs a fresh Whisper transcription, and calls Gemini to build new articles from scratch. |
| **Seed Mock Data** | `backend/` | `node scripts/seedMockArticle.js` | Feeds static mock article data into the startup competition episode JSON for local UI testing. |
| **Start Frontend** | `frontend/` | `npm run dev` | Starts only the Vite frontend dev server (defaults to port `5173`). |
| **Build Frontend** | `frontend/` | `npm run build` | Compiles the production-ready static bundle of the React frontend into `frontend/dist/`. |

---

## ⚙️ Environment Variables that Control Command Outputs

You can customize the behavior of the generation commands by configuring variables inside [backend/.env](file:///d:/ZeroPointFive/backend/.env):

* **`TRANSCRIPT_PROVIDER`** (`youtube` | `whisper`):
  * `youtube` uses lightweight web scrapers to download auto-generated captions (extremely fast, requires no setup).
  * `whisper` runs local audio extraction and transcribes via the Python `faster-whisper` package (requires local Python and `pip install yt-dlp faster-whisper`).
* **`TRANSCRIPT_FALLBACK`** (`youtube`):
  * If set to `youtube` and `TRANSCRIPT_PROVIDER=whisper` fails (e.g. CUDA/out of memory errors), the script falls back to scraping YouTube auto-captions so the run doesn't fail.
* **`GEMINI_MODEL`** (Default: `gemini-1.5-flash`):
  * Allows you to specify the Google AI Studio model to query. Can be updated to preview models or advanced tiers (e.g. `gemini-2.5-pro`) for high-fidelity writing style.
