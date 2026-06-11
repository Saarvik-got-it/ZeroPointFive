/**
 * Base interface for transcript providers
 */
class TranscriptProvider {
  /**
   * Fetches transcript for a given video ID
   * @param {string} videoId
   * @returns {Promise<string>} The complete transcript as text
   */
  async getTranscript(videoId) {
    throw new Error("Method not implemented");
  }
}

module.exports = TranscriptProvider;
