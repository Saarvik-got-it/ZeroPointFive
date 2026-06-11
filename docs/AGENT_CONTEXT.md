# Agent Context

## Current Status

- **Completed**: Implement Phase 1 Podcast Pipeline (Single Video -> JSON Pipeline -> New UI).
  - Abstracted YouTube Transcript Provider.
  - Implemented single-pass Gemini structured JSON generation.
  - Created `EpisodeRepository` for decoupled JSON storage.
  - Added CLI scripts (`process-video` and `regenerate-video`).
  - Added UI hooks in `EpisodeDetailPage.jsx` pointing to a functional Express backend (`/api/episodes/:slug`).
  - Enhanced error handling and API limit logging for Gemini layer.
- **Pending**: Article individual pages (`/articles/:slug`).
- **Known Issues**:
  - AI Generation might fail with `503 Service Unavailable` if the selected Gemini model (e.g., `gemini-2.5-flash`) is experiencing high traffic. If this happens, change `GEMINI_MODEL=gemini-1.5-flash` in `.env`.
  - Transcript chunking for 3hr+ podcasts is not yet implemented.

## Current Architecture

- Frontend: Vite, React, React Router, TailwindCSS. (NO TypeScript, NO Next.js).
- Backend: Express, Node.js, File-based Repository pattern. JSDoc for types.
- AI: Google Generative AI (Structured Schema JSON Output).

## Environment Variables (.env mapped in backend/)

- `GEMINI_API_KEY`: Required for pipeline to function.
- `GEMINI_MODEL`: (Default: `gemini-1.5-flash`. Change if hitting rate limits).
- `PORT`: Backend port (5000)
- `FRONTEND_URL`: CORS config (http://localhost:5173)

## Important Decisions

- **Single AI Call**: Decided to use a single Gemini payload generation using `@google/generative-ai` `SchemaType` for cost, speed, and validation consistency.
- **Repository Pattern**: Extracted JSON reads/writes into `episode.repository.js` so it can be swapped with a real DB (Mongo/SQL) without affecting routes or CLI scripts.
- **Transcript Provider Pattern**: Abstracted `youtube-transcript` behind a Provider Interface so Whisper/AssemblyAI can be introduced for missing transcripts easily.

## Key Instructions for Future Agents

1. **NO TYPESCRIPT MIGRATION**: The user explicitly forbade migrating from `.js/.jsx` to `.ts/.tsx`. Continue using JSDoc.
2. **NO NEXT.JS MIGRATION**: Continue using Vite + React Router.
3. **STAY DECOUPLED**: Business logic must remain out of UI components.
4. If testing generation, rely heavily on `npm run regenerate-video <slug>` so you do not repeatedly fetch identical payloads and exhaust rate limits.

## Next Recommended Steps

1. Build out the `/articles/:slug` route on the frontend using the generated `articles` payload inside the episodes.
2. Add pagination or chunking support for massive transcripts.
3. Hook up a YouTube Webhook to `processVideo` for full automation.
