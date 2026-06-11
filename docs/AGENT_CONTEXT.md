# Agent Context

## Current Status

- **Completed**: Implement Phase 1 Podcast Pipeline (Single Video -> JSON Pipeline -> New UI).
  - Abstracted YouTube Transcript Provider.
  - Implemented single-pass Gemini structured JSON generation.
  - Created `EpisodeRepository` for decoupled JSON storage.
  - Added CLI scripts (`process-video`, `regenerate-video`, and `regenerate-transcript`).
  - Added UI hooks in `EpisodeDetailPage.jsx` pointing to a functional Express backend (`/api/episodes/:slug`).
  - Enhanced error handling and API limit logging for Gemini layer.
  - Implemented `/articles/:slug` dynamic article pages.
  - Integrated local Whisper Large v3 transcription using `faster-whisper` and `yt-dlp` with automatic fallback, Hinglish prompt optimization, segment-level timestamps caching, and redirecting model cache weights inside the project folder.
- **Pending**:
  - Transcript chunking for 3hr+ podcasts is not yet implemented.

## Current Architecture

- Frontend: Vite, React, React Router, TailwindCSS. (NO TypeScript, NO Next.js).
- Backend: Express, Node.js, File-based Repository pattern, local python bridges for audio processing. JSDoc for types.
- AI: Google Generative AI (Structured Schema JSON Output).

## Environment Variables (.env mapped in backend/)

- `GEMINI_API_KEY`: Required for pipeline to function.
- `GEMINI_MODEL`: (Default: `gemini-2.5-flash`).
- `PORT`: Backend port (5000)
- `FRONTEND_URL`: CORS config (http://localhost:5173)
- `TRANSCRIPT_PROVIDER`: `whisper` to use local transcription, or `youtube` for auto-transcripts.
- `TRANSCRIPT_FALLBACK`: `youtube` for fallback resilience.
- `WHISPER_MODEL`: Model size (default: `large-v3`).
- `WHISPER_MODEL_DIR`: Project weight storage (`./backend/models/whisper`).
- `HF_HOME` & `TRANSFORMERS_CACHE`: Hugging Face weight cache paths redirected into project directory.

## Important Decisions

- **Single AI Call**: Decided to use a single Gemini payload generation using `@google/generative-ai` `SchemaType` for cost, speed, and validation consistency.
- **Repository Pattern**: Extracted JSON reads/writes into `episode.repository.js` so it can be swapped with a real DB (Mongo/SQL) without affecting routes or CLI scripts.
- **Transcript Provider Pattern**: Abstracted transcripts behind a Strategy Pattern provider interface. Added Whisper integration, segment storage, raw transcripts tracking, and automatic provider fallback.
- **Local Model Caching**: Explicitly isolated all Hugging Face and Whisper weight downloads inside `backend/models/` to prevent cluttering the host's primary `C:` drive system directories.

## Key Instructions for Future Agents

1. **NO TYPESCRIPT MIGRATION**: The user explicitly forbade migrating from `.js/.jsx` to `.ts/.tsx`. Continue using JSDoc.
2. **NO NEXT.JS MIGRATION**: Continue using Vite + React Router.
3. **STAY DECOUPLED**: Business logic must remain out of UI components.
4. If testing generation, rely heavily on `npm run regenerate-video <slug>` so you do not repeatedly fetch identical payloads and exhaust rate limits.
5. If you want to force full Whisper re-transcription of an existing episode, run `npm run regenerate-transcript <slug>`.

## Next Recommended Steps

1. Add pagination or chunking support for massive transcripts.
2. Hook up a YouTube Webhook to `processVideo` for full automation.
