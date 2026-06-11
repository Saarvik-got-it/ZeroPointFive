const youtubeProvider = require("./youtube.provider");
const whisperProvider = require("./whisper.provider");

/**
 * Creates and returns the appropriate TranscriptProvider based on environment configuration.
 * @param {string} [providerName] 
 * @returns {import("./provider")} The selected transcript provider
 */
function createTranscriptProvider(providerName = process.env.TRANSCRIPT_PROVIDER) {
  const name = (providerName || "youtube").toLowerCase();
  
  if (name === "whisper") {
    return whisperProvider;
  }
  
  return youtubeProvider;
}

module.exports = {
  createTranscriptProvider,
  // Getter enables dynamic lookups matching current environment variables at invocation time
  get defaultProvider() {
    return createTranscriptProvider();
  }
};
