const { YoutubeTranscript } = require("youtube-transcript");
const TranscriptProvider = require("./provider");

class YoutubeTranscriptProvider extends TranscriptProvider {
  /**
   * @param {string} videoId
   * @returns {Promise<string>}
   */
  async getTranscript(videoId) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId);
      return items.map((item) => item.text).join(" ");
    } catch (err) {
      console.error("\n================ TRANSCRIPT ERROR ================");
      console.error(`🚨 FAILED TO FETCH TRANSCRIPT FOR VIDEO ID: ${videoId}`);
      const msg = err.message || "";
      if (msg.includes("disabled") || msg.includes("No transcripts")) {
        console.error(
          "💡 REASON: Transcripts are disabled or unavailable for this specific video.",
        );
      } else {
        console.error(`💡 REASON: ${msg}`);
      }
      console.error("==================================================\n");
      throw new Error(`Failed to fetch transcript from YouTube: ${msg}`);
    }
  }
}

module.exports = new YoutubeTranscriptProvider();
