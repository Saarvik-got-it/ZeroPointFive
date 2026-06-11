const crypto = require("crypto");
const episodeRepo = require("../repositories/episode.repository");
const { fetchVideoMetadata } = require("../services/youtube.service");
const { defaultProvider } = require("../services/transcript");
const { generateEpisodePayload } = require("../services/ai/gemini");

/**
 * Creates a URL-friendly slug
 * @param {string} text
 */
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Main ingestion function to process a single YouTube URL
 * @param {string} url
 */
async function processVideo(url) {
  console.log(`\n--- Starting Pipeline for: ${url} ---`);

  let episodeData = {
    id: crypto.randomUUID(),
    youtubeUrl: url,
    status: "processing",
    createdAt: new Date().toISOString(),
  };

  try {
    // 1. Metadata Fetch
    console.log("-> Fetching YouTube metadata...");
    const metadata = await fetchVideoMetadata(url);
    const slug = createSlug(metadata.title);

    episodeData = {
      ...episodeData,
      videoId: metadata.videoId,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      slug: slug,
    };

    // Save initial processing state
    await episodeRepo.saveEpisode(episodeData);

    // 2. Transcript Fetch
    console.log(`-> Fetching transcript for video ID ${metadata.videoId}...`);
    const transcript = await defaultProvider.getTranscript(metadata.videoId);
    if (!transcript) {
      throw new Error("Transcript was empty.");
    }
    episodeData.transcript = transcript;

    // Save state with transcript in case Gemini fails, we don't have to refetch
    await episodeRepo.saveEpisode(episodeData);

    // 3. Gemini Processing
    console.log("-> Generating AI content via Gemini...");
    const aiPayload = await generateEpisodePayload(transcript, episodeData);

    // 4. Update and Save Completed Episode
    episodeData = {
      ...episodeData,
      ...aiPayload,
      status: "completed",
    };

    console.log("-> Saving final completed episode...");
    await episodeRepo.saveEpisode(episodeData);

    console.log(`\n✅ Pipeline Success! Episode saved as [${slug}]`);
    return episodeData;
  } catch (error) {
    console.error(`\n❌ Pipeline Error: ${error.message}`);

    // Mark as failed if we have a slug established
    if (episodeData.slug) {
      episodeData.status = "failed";
      await episodeRepo.saveEpisode(episodeData).catch((saveErr) => {
        console.error("Also failed to save error status:", saveErr.message);
      });
    }

    throw error;
  }
}

/**
 * Regenerates the AI content for an existing episode using its saved transcript
 * @param {string} slug
 */
async function regenerateVideo(slug) {
  console.log(`\n--- Regenerating AI for: ${slug} ---`);
  const episode = await episodeRepo.getBySlug(slug);

  if (!episode) {
    throw new Error(`Episode not found for slug: ${slug}`);
  }

  if (!episode.transcript) {
    throw new Error(
      "Cannot regenerate: No transcript found in the existing episode data.",
    );
  }

  try {
    episode.status = "processing";
    await episodeRepo.saveEpisode(episode);

    console.log("-> Regenerating AI content via Gemini...");
    const aiPayload = await generateEpisodePayload(episode.transcript, episode);

    Object.assign(episode, aiPayload);
    episode.status = "completed";

    console.log("-> Saving regenerated episode...");
    await episodeRepo.saveEpisode(episode);

    console.log(`\n✅ Regeneration Success!`);
    return episode;
  } catch (error) {
    console.error(`\n❌ Regeneration Error: ${error.message}`);
    episode.status = "failed";
    await episodeRepo.saveEpisode(episode);
    throw error;
  }
}

module.exports = {
  processVideo,
  regenerateVideo,
};
