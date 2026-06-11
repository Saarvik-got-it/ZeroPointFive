const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const TEMP_DIR = path.join(__dirname, "../../../temp");

/**
 * Ensures that the temp directory exists
 */
function ensureTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

/**
 * Downloads audio for a given YouTube video ID and returns the file path.
 * @param {string} videoId 
 * @returns {Promise<string>} Path to the downloaded audio file
 */
function downloadAudio(videoId) {
  return new Promise((resolve, reject) => {
    ensureTempDir();
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const outputPathPattern = path.join(TEMP_DIR, `${videoId}.%(ext)s`);
    const finalOutputPath = path.join(TEMP_DIR, `${videoId}.mp3`);

    console.log(`[Whisper] Downloading audio... URL: ${url}`);

    // If file already exists, reuse it to avoid re-downloading if interrupted
    if (fs.existsSync(finalOutputPath)) {
      console.log(`[Whisper] Audio file already exists at: ${finalOutputPath}`);
      return resolve(finalOutputPath);
    }

    // Spawn yt-dlp to extract audio in mp3 format
    const child = spawn("yt-dlp", [
      "-x",
      "--audio-format", "mp3",
      "--audio-quality", "0",
      "-o", outputPathPattern,
      url
    ], { shell: true });

    let stderrData = "";

    child.stdout.on("data", (data) => {
      // Opt-in verbose log to console for tracking progress
      const output = data.toString();
      if (output.includes("[download]") && output.includes("%")) {
        // Log download progress periodically
        const match = output.match(/(\d+\.\d+)%/);
        if (match) {
          console.log(`[Whisper] Audio download progress: ${match[0]}`);
        }
      }
    });

    child.stderr.on("data", (data) => {
      stderrData += data.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`[Whisper] yt-dlp failed with code ${code}. Error: ${stderrData}`);
        return reject(new Error(`yt-dlp download failed: ${stderrData.trim()}`));
      }

      if (fs.existsSync(finalOutputPath)) {
        console.log(`[Whisper] Audio downloaded successfully: ${finalOutputPath}`);
        resolve(finalOutputPath);
      } else {
        reject(new Error(`Downloaded file not found at expected path: ${finalOutputPath}`));
      }
    });

    child.on("error", (err) => {
      reject(new Error(`Failed to start yt-dlp process: ${err.message}`));
    });
  });
}

/**
 * Cleans up temporary audio file if it exists.
 * @param {string} filePath 
 */
function cleanupAudio(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      console.log(`[Whisper] Cleaning up temporary file: ${filePath}`);
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`[Whisper] Failed to delete temporary file ${filePath}:`, err.message);
  }
}

module.exports = {
  downloadAudio,
  cleanupAudio,
};
