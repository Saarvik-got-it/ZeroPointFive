# The Zero Point Five - Architecture

## System Architecture

The project consists of two primary modules decoupled from each other:

1. **Backend Pipeline (Data Ingestion)**
2. **Frontend Client (Data Rendering)**

Currently running on:

- Express (Node.js) for backend Services & APIs
- Vite (React, React Router) + Tailwind CSS for frontend

### Data Flow & Rendering Modes

```mermaid
graph TD
    subgraph Ingestion Pipeline (Backend)
        A[YouTube URL] --> B(Ingest Script)
        B --> C[YouTube Service Metadata]
        B --> D[Transcript Provider]
        C --> E[Gemini AI Service]
        D --> E
        E --> F[Structured Episode JSON]
        F --> G[(Backend Episode Repository - JSON)]
    end

    subgraph Sync Layer
        G --> Sync(Sync Script)
        Meta[(Episode Metadata Config)] --> Sync
    end

    subgraph Client Rendering (Frontend)
        Sync --> StaticFolder[(Static JSON Files)]
        H[React Client] --> CR{ContentRepository}
        CR -->|VITE_DATA_SOURCE=api| ExpressAPI[Express API /api/episodes]
        CR -->|VITE_DATA_SOURCE=static| StaticRepo[StaticContentRepository]
        ExpressAPI --> G
        StaticRepo --> StaticFolder
    end
```

### Module Breakdown

#### 1. Content Repositories & Data Source Abstraction

To support running the frontend completely offline/backendless for demos (Static Demo Mode) while retaining the active backend (API Mode), the client data-fetching logic is decoupled using a Repository pattern:
- **`ContentRepository.js`**: Unified entry point for the frontend, exporting either `StaticContentRepository` or `ApiContentRepository` based on the environment variable `VITE_DATA_SOURCE`.
- **`StaticContentRepository.js`**: Resolves episodes dynamically using Vite's eager glob imports (`import.meta.glob('../data/episodes/*.json')`) and resolves articles using a pre-compiled index map to avoid duplication.
- **`ApiContentRepository.js`**: Queries active REST backend routes and enriches payloads dynamically with metadata at runtime.
- **`episode.repository.js`**: Backend-side filesystem repository that handles saving and retrieving raw ingested podcast data.
Abstracts the storage layer. Currently implementing local JSON storage, making it future-proof for a MongoDB or PostgreSQL migration without touching the rest of the application.

#### 2. Transcript Providers

Located in `backend/src/services/transcript/`.
Follows the Strategy Pattern to isolate the transcription layer.
* `index.js`: Dynamically loads the selected provider (Whisper or YouTube) based on environment configurations, and implements automatic fallback strategy.
* `provider.js`: Base abstract class defining the provider interface contract.
* `youtube.provider.js`: Scrapes auto-generated captions directly from YouTube.
* `whisper.provider.js` & `whisper_transcribe.py`: Integrates `faster-whisper` locally using Whisper Large v3 for verbatim Hinglish transcription. Automatically detects GPU/CPU hardware and handles fallback.
* `audio-downloader.js`: Handles extraction and downloading of audio streams from YouTube URLs using `yt-dlp` to a temporary directory in the workspace.

All model downloads are stored inside the project folder (`backend/models/`) rather than system user cache folders. This is controlled via env variables like `WHISPER_MODEL_DIR`, `HF_HOME`, and `TRANSFORMERS_CACHE`.

#### 3. Gemini Pipeline

Located in `backend/src/services/ai/gemini.js`.
Uses `gemini-1.5-flash` with a strict JSON schema configuration (`responseSchema`). It takes a full transcript and generates the complete structured episode (Summary, Takeaways, Topics, Articles) in a single request.

#### 4. Frontend Routing

Located in `frontend/src/app/router.jsx`. Uses `react-router-dom`. The new Episode detail view lives at `/podcasts/:slug`.

### Automation Strategy

This architecture natively supports CI/CD pipelines or cron jobs.
Instead of calling the `processVideo(url)` function manually via the CLI, a webhook trigger (e.g., from YouTube pubsub) can invoke `processVideo(url)` on the server. The data will automatically land in the Episode Repository and become immediately available on the frontend without any rebuilds.
