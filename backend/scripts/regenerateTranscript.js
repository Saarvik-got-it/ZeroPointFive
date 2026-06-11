require("dotenv").config();
const { processVideo } = require("../src/pipeline/ingest");
const episodeRepo = require("../src/repositories/episode.repository");

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run regenerate-transcript <EPISODE_SLUG>");
  process.exit(1);
}

async function run() {
  console.log(`\n--- Regenerating Transcript & Rebuilding for: ${slug} ---`);
  const episode = await episodeRepo.getBySlug(slug);

  if (!episode) {
    throw new Error(`Episode not found for slug: ${slug}`);
  }

  const youtubeUrl = episode.youtubeUrl;
  if (!youtubeUrl) {
    throw new Error(`No youtubeUrl found on episode: ${slug}`);
  }

  console.log(`[Transcript] Found episode. Clearing cached transcript fields...`);
  
  // Clear all transcript related fields
  delete episode.transcript;
  delete episode.rawTranscript;
  delete episode.transcriptSegments;
  delete episode.transcriptSource;
  delete episode.transcriptVersion;
  delete episode.language;
  delete episode.durationSeconds;
  delete episode.segmentCount;

  // Save the updated cleared episode state
  await episodeRepo.saveEpisode(episode);
  console.log(`[Transcript] Cached transcript deleted. Re-triggering pipeline for: ${youtubeUrl}`);

  // Re-run the ingestion pipeline. It will re-download, transcribe, and run Gemini.
  await processVideo(youtubeUrl);
}

run()
  .then(() => {
    console.log(`\n✅ Transcript Regeneration Completed successfully!`);
    process.exitCode = 0;
  })
  .catch((err) => {
    console.error("Unhandled Script Error:", err);
    process.exit(1);
  });
