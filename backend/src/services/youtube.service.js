/**
 * Extracts the video ID from various YouTube URL formats
 * @param {string} url
 * @returns {string|null}
 */
function extractVideoId(url) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/**
 * Basic metadata using oEmbed since we might not have a YouTube Data API Key initially.
 * For a production app with a key, this would use the official Google API.
 * @param {string} url
 * @returns {Promise<{videoId: string, title: string, thumbnail: string}>}
 */
async function fetchVideoMetadata(url) {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata (Status: ${response.status})`);
    }

    const data = await response.json();
    return {
      videoId,
      title: data.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (err) {
    console.error("Metadata fetch error:", err.message);
    throw err;
  }
}

module.exports = {
  extractVideoId,
  fetchVideoMetadata,
};
