const fs = require("fs");
const path = require("path");

const backendEpisodesDir = path.join(__dirname, "../backend/data/episodes");
const metadataFilePath = path.join(__dirname, "../backend/data/episode-metadata.json");
const frontendDataDir = path.join(__dirname, "../frontend/src/data");
const frontendEpisodesDir = path.join(frontendDataDir, "episodes");
const articleIndexFilePath = path.join(frontendDataDir, "articleIndex.json");

// Debounce helper for watcher
let fsWatchTimeout;

function runSync() {
  console.log("\n[Sync] Starting demo content synchronization...");

  try {
    // Ensure output directories exist
    if (!fs.existsSync(frontendEpisodesDir)) {
      fs.mkdirSync(frontendEpisodesDir, { recursive: true });
    }

    // Clear previous synced episodes to prevent stale data
    const existingSyncedFiles = fs.readdirSync(frontendEpisodesDir);
    for (const file of existingSyncedFiles) {
      if (file.endsWith(".json")) {
        fs.unlinkSync(path.join(frontendEpisodesDir, file));
      }
    }

    // Load metadata configuration
    let metadataConfig = {};
    if (fs.existsSync(metadataFilePath)) {
      try {
        const metadataStr = fs.readFileSync(metadataFilePath, "utf8");
        metadataConfig = JSON.parse(metadataStr);
        // Write copy to frontend data folder for API mode metadata enrichment
        fs.writeFileSync(path.join(frontendDataDir, "episodeMetadata.json"), metadataStr, "utf8");
      } catch (err) {
        console.error("[Sync] Error parsing or copying episode-metadata.json:", err.message);
      }
    }

    // Find and sort all backend episode files by createdAt descending (newest first)
    if (!fs.existsSync(backendEpisodesDir)) {
      console.log("[Sync] No backend episodes directory found. Nothing to sync.");
      return;
    }

    const files = fs.readdirSync(backendEpisodesDir).filter(f => f.endsWith(".json"));
    const episodesData = [];

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(backendEpisodesDir, file), "utf8");
        const ep = JSON.parse(content);
        if (ep.status === "completed" && ep.slug) {
          episodesData.push(ep);
        }
      } catch (err) {
        console.error(`[Sync] Error reading or parsing ${file}:`, err.message);
      }
    }

    // Sort episodes by creation date (oldest first) so fallback episode numbers are in order
    episodesData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const articleIndex = {};

    episodesData.forEach((ep, index) => {
      const slug = ep.slug;
      const meta = metadataConfig[slug] || {};

      // Determine Category: Explicit metadata -> Episode category -> Fallback topic search -> Default
      let category = meta.category || ep.category;
      if (!category && ep.topics && ep.topics.length > 0) {
        // Look for topics matching category names
        const lowerTopics = ep.topics.map(t => t.toLowerCase());
        if (lowerTopics.some(t => t.includes("startup"))) category = "Startups";
        else if (lowerTopics.some(t => t.includes("leadership") || t.includes("women"))) category = "Leadership";
        else if (lowerTopics.some(t => t.includes("business") || t.includes("market"))) category = "Business";
        else if (lowerTopics.some(t => t.includes("ai") || t.includes("tech"))) category = "Technology";
        else if (lowerTopics.some(t => t.includes("future"))) category = "Future";
        else category = ep.topics[0]; // Fallback to first topic
      }
      if (!category) {
        category = "Startups"; // Global default
      }

      // Determine Guest details
      const guestName = meta.guestName || "Special Guest";
      const guestCompany = meta.company || "ZeroPointFive";
      const guestRole = meta.role || "Guest";

      // Determine Image: if meta image is a mock AI image (starts with KLing_), ignore it and use the video thumbnail instead
      const guestImage = (meta.image && !meta.image.startsWith("KLing_")) ? meta.image : ep.thumbnail;

      // Determine Duration
      let duration = meta.duration;
      if (!duration) {
        if (ep.durationSeconds) {
          const mins = Math.round(ep.durationSeconds / 60);
          duration = `${mins} min`;
        } else {
          duration = "45 min";
        }
      }

      // Determine Episode Number (e.g. EP. 053)
      const episodeNumber = meta.episodeNumber || String(56 + index).padStart(3, "0");

      // Construct dynamic card properties and full detail properties
      const syncedEpisode = {
        id: ep.slug, // Map ID to slug so click handlers resolve perfectly
        slug: ep.slug,
        videoId: ep.videoId,
        youtubeUrl: ep.youtubeUrl,
        title: ep.title,
        thumbnail: ep.thumbnail,
        status: ep.status,
        summary: ep.summary,
        takeaways: ep.takeaways,
        topics: ep.topics,
        transcript: ep.transcript,
        createdAt: ep.createdAt,
        updatedAt: ep.updatedAt,
        // UI parameters
        guest: guestName,
        company: guestCompany,
        role: guestRole,
        image: guestImage,
        category: category,
        episodeNumber: episodeNumber,
        duration: duration,
        articles: (ep.articles && Array.isArray(ep.articles))
          ? ep.articles.map(art => ({
              ...art,
              source: {
                ...art.source,
                episodeSlug: ep.slug
              }
            }))
          : []
      };

      // Write synced episode JSON to frontend
      fs.writeFileSync(
        path.join(frontendEpisodesDir, `${slug}.json`),
        JSON.stringify(syncedEpisode, null, 2),
        "utf8"
      );

      // Populate article index: map articleSlug -> episodeSlug
      if (ep.articles && Array.isArray(ep.articles)) {
        ep.articles.forEach(article => {
          if (article.slug) {
            articleIndex[article.slug] = slug;
          }
        });
      }
    });

    // Write article index mapping file
    fs.writeFileSync(
      articleIndexFilePath,
      JSON.stringify(articleIndex, null, 2),
      "utf8"
    );

    console.log(`[Sync] Success! Synced ${episodesData.length} episodes and indexed ${Object.keys(articleIndex).length} articles.`);
  } catch (error) {
    console.error("[Sync] Synchronization failed with error:", error.message);
  }
}

// Initial Sync
runSync();

// Watch Mode
if (process.argv.includes("--watch")) {
  console.log(`[Sync] Watch mode active. Monitoring: ${backendEpisodesDir}`);
  if (!fs.existsSync(backendEpisodesDir)) {
    fs.mkdirSync(backendEpisodesDir, { recursive: true });
  }

  fs.watch(backendEpisodesDir, (eventType, filename) => {
    if (filename && filename.endsWith(".json")) {
      clearTimeout(fsWatchTimeout);
      fsWatchTimeout = setTimeout(() => {
        console.log(`[Sync] File change detected (${filename}). Re-syncing...`);
        runSync();
      }, 300); // Debounce to prevent multiple fires on write stream close
    }
  });
}
