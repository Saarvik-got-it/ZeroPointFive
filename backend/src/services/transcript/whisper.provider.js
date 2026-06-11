const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const TranscriptProvider = require("./provider");
const { downloadAudio, cleanupAudio } = require("./audio-downloader");

class WhisperTranscriptProvider extends TranscriptProvider {
  constructor() {
    super();
    this.metadataCache = new Map();
  }

  /**
   * Fetches transcript for a given YouTube video ID using local Whisper model.
   * @param {string} videoId 
   * @returns {Promise<string>} The complete transcript as text
   */
  async getTranscript(videoId) {
    let audioPath = null;
    try {
      // 1. Download audio file from YouTube
      audioPath = await downloadAudio(videoId);

      // 2. Resolve relative environment paths to absolute directories
      const env = { ...process.env };
      const rootDir = process.cwd().endsWith("backend") ? path.resolve(process.cwd(), "..") : process.cwd();

      if (env.WHISPER_MODEL_DIR) {
        env.WHISPER_MODEL_DIR = path.resolve(rootDir, env.WHISPER_MODEL_DIR);
      } else {
        env.WHISPER_MODEL_DIR = path.resolve(rootDir, "./backend/models/whisper");
      }

      if (env.HF_HOME) {
        env.HF_HOME = path.resolve(rootDir, env.HF_HOME);
      } else {
        env.HF_HOME = path.resolve(rootDir, "./backend/models/huggingface");
      }

      if (env.TRANSFORMERS_CACHE) {
        env.TRANSFORMERS_CACHE = path.resolve(rootDir, env.TRANSFORMERS_CACHE);
      } else {
        env.TRANSFORMERS_CACHE = path.resolve(rootDir, "./backend/models/huggingface");
      }

      // Ensure that models and cache directories exist
      if (!fs.existsSync(env.WHISPER_MODEL_DIR)) {
        fs.mkdirSync(env.WHISPER_MODEL_DIR, { recursive: true });
      }
      if (!fs.existsSync(env.HF_HOME)) {
        fs.mkdirSync(env.HF_HOME, { recursive: true });
      }

      // 3. Run local Whisper Large v3 transcription Python script
      const scriptPath = path.join(__dirname, "whisper_transcribe.py");
      
      console.log(`[Whisper] Executing python script: ${scriptPath} with audio: ${audioPath}`);
      
      const transcriptJSON = await new Promise((resolve, reject) => {
        const pythonProcess = spawn("python", [scriptPath, audioPath], {
          env,
          shell: true,
        });

        let stdoutData = "";
        let stderrData = "";

        pythonProcess.stdout.on("data", (data) => {
          stdoutData += data.toString();
        });

        pythonProcess.stderr.on("data", (data) => {
          const chunk = data.toString();
          // Stream logs directly to backend console live so user sees progress (requirement 7)
          process.stderr.write(chunk);
          stderrData += chunk;
        });

        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            return reject(new Error(`Whisper transcription process failed with exit code ${code}. Stderr: ${stderrData.trim()}`));
          }
          resolve(stdoutData.trim());
        });

        pythonProcess.on("error", (err) => {
          reject(new Error(`Failed to start Whisper transcription process: ${err.message}`));
        });
      });

      // 4. Parse the output JSON structure
      const parsed = JSON.parse(transcriptJSON);
      
      // Cache metadata & segments to be retrieved by the ingestion pipeline (requirements 2, 4)
      this.metadataCache.set(videoId, {
        language: parsed.language || "hi-en",
        duration: parsed.duration || 0,
        segments: parsed.segments || []
      });

      return parsed.text;
    } catch (err) {
      console.error("\n================ WHISPER ERROR ================");
      console.error(`🚨 FAILED TO TRANSCRIBE VIDEO ID: ${videoId}`);
      console.error(`💡 REASON: ${err.message}`);
      console.error("==================================================\n");
      throw err;
    } finally {
      // 5. Clean up downloaded audio file
      if (audioPath) {
        cleanupAudio(audioPath);
      }
    }
  }

  /**
   * Retrieves the segment-level metadata for a given video ID after transcription is complete.
   * @param {string} videoId 
   * @returns {{language: string, duration: number, segments: Array<{start: number, end: number, text: string}>}|undefined}
   */
  getMetadata(videoId) {
    return this.metadataCache.get(videoId);
  }
}

module.exports = new WhisperTranscriptProvider();
