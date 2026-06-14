const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");
const { EPISODE_GENERATION_PROMPT } = require("./prompts/episode.prompt");

// Initialize Gemini
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  let modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  
  // Upgrade to gemini-2.5-flash for stability with large, multilingual JSON generation
  if (modelName === "gemini-2.5-flash-lite") {
    modelName = "gemini-2.5-flash";
  }

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Recommend using the newer preview models for structured JSON
  return genAI.getGenerativeModel({ model: modelName });
}

const episodeSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING },
    takeaways: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    topics: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    conversationSummary: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        introduction: { type: SchemaType.STRING },
        sections: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              heading: { type: SchemaType.STRING },
              content: { type: SchemaType.STRING }
            },
            required: ["heading", "content"]
          }
        },
        conclusion: { type: SchemaType.STRING }
      },
      required: ["title", "introduction", "sections", "conclusion"]
    },
    articles: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          slug: { type: SchemaType.STRING },
          title: { type: SchemaType.STRING },
          subtitle: { type: SchemaType.STRING },
          derivedFrom: { type: SchemaType.STRING },
          generatedAt: { type: SchemaType.STRING },
          author: { type: SchemaType.STRING },
          status: { type: SchemaType.STRING },
          readingLevel: { type: SchemaType.STRING },
          readingTime: { type: SchemaType.NUMBER },
          featuredInsight: { type: SchemaType.STRING },
          seo: {
            type: SchemaType.OBJECT,
            properties: {
              metaTitle: { type: SchemaType.STRING },
              metaDescription: { type: SchemaType.STRING },
              keywords: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            },
            required: ["metaTitle", "metaDescription", "keywords"],
          },
          source: {
            type: SchemaType.OBJECT,
            properties: {
              episodeId: { type: SchemaType.STRING },
              episodeTitle: { type: SchemaType.STRING },
              videoId: { type: SchemaType.STRING },
              youtubeUrl: { type: SchemaType.STRING },
            },
            required: ["episodeId", "episodeTitle", "videoId", "youtubeUrl"],
          },
          tableOfContents: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                anchorId: { type: SchemaType.STRING },
              },
              required: ["title", "anchorId"],
            },
          },
          introduction: { type: SchemaType.STRING },
          keyInsights: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          quoteHighlights: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                quote: { type: SchemaType.STRING },
                context: { type: SchemaType.STRING },
              },
              required: ["quote", "context"],
            },
          },
          podcastMoments: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                title: { type: SchemaType.STRING },
                summary: { type: SchemaType.STRING },
              },
              required: ["title", "summary"],
            },
          },
          sections: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                type: { type: SchemaType.STRING },
                heading: { type: SchemaType.STRING },
                content: { type: SchemaType.STRING },
                context: { type: SchemaType.STRING },
                anchorId: { type: SchemaType.STRING },
              },
              required: ["type", "content"],
            },
          },
          conclusion: { type: SchemaType.STRING },
          tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: [
          "id",
          "slug",
          "title",
          "subtitle",
          "derivedFrom",
          "generatedAt",
          "author",
          "status",
          "readingLevel",
          "readingTime",
          "featuredInsight",
          "seo",
          "source",
          "tableOfContents",
          "introduction",
          "keyInsights",
          "quoteHighlights",
          "podcastMoments",
          "sections",
          "conclusion",
          "tags",
        ],
      },
    },
  },
  required: ["summary", "takeaways", "topics", "articles", "conversationSummary"],
};

/**
 * Helper to retry a promise-returning function with exponential backoff.
 * @param {Function} fn
 * @param {number} retries
 * @param {number} delay
 * @param {number} backoffFactor
 */
async function retryWithBackoff(fn, retries = 5, delay = 2000, backoffFactor = 2) {
  let currentDelay = delay;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const msg = error.message || "";
      const isRetryable =
        msg.includes("503") ||
        msg.includes("Service Unavailable") ||
        msg.includes("overloaded") ||
        msg.includes("429") ||
        msg.includes("quota") ||
        msg.includes("rate limit") ||
        msg.includes("fetch failed") ||
        msg.includes("connection") ||
        msg.includes("timeout") ||
        msg.includes("socket");

      if (!isRetryable || attempt === retries) {
        throw error;
      }

      console.warn(
        `\n⚠️ Gemini API warning: Request failed (attempt ${attempt}/${retries}). Retrying in ${currentDelay}ms... Error: ${msg}\n`
      );
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= backoffFactor;
    }
  }
}

/**
 * Generates the full podcast episode payload from a given transcript.
 * @param {string} transcript
 * @param {any} [episodeMeta]
 * @returns {Promise<{summary: string, takeaways: string[], topics: string[], articles: import('../../types').Article[]}>}
 */
async function generateEpisodePayload(transcript, episodeMeta = null) {
  const model = getModel();

  try {
    const result = await retryWithBackoff(() =>
      model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: EPISODE_GENERATION_PROMPT + transcript }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: episodeSchema,
          maxOutputTokens: 8192,
        },
      })
    );

    const responseText = result.response.text();
    let payload;
    try {
      payload = JSON.parse(responseText);
    } catch (parseErr) {
      console.error("\n================ RAW GEMINI RESPONSE ERROR ================");
      console.error("Length of responseText:", responseText.length);
      console.error("Last 1000 characters of responseText:");
      console.error(responseText.substring(Math.max(0, responseText.length - 1000)));
      console.error("=========================================================\n");
      throw parseErr;
    }

    // Dynamic Injection of self-contained properties
    if (payload.articles && Array.isArray(payload.articles) && episodeMeta) {
      const timestamp = new Date().toISOString();
      payload.articles = payload.articles.map(article => ({
        ...article,
        generatedAt: timestamp,
        source: {
          episodeId: episodeMeta.id || "",
          episodeTitle: episodeMeta.title || "",
          videoId: episodeMeta.videoId || "",
          youtubeUrl: episodeMeta.youtubeUrl || ""
        }
      }));
    }

    // Basic Validation
    if (!payload.summary || payload.summary.length < 50) {
      throw new Error("Validation failed: Summary is too short or missing.");
    }
    if (!Array.isArray(payload.takeaways) || payload.takeaways.length === 0) {
      throw new Error("Validation failed: Takeaways are missing.");
    }
    if (!Array.isArray(payload.topics) || payload.topics.length === 0) {
      throw new Error("Validation failed: Topics are missing.");
    }
    if (!Array.isArray(payload.articles) || payload.articles.length === 0) {
      throw new Error("Validation failed: Articles are missing.");
    }

    return payload;
  } catch (error) {
    console.error("\n================ GEMINI API ERROR ================");
    const msg = error.message || "";

    if (
      msg.includes("503") ||
      msg.includes("Service Unavailable") ||
      msg.includes("overloaded")
    ) {
      console.error(
        "🚨 API OVERLOADED (503): The Gemini model is currently experiencing high demand.",
      );
      console.error(
        "💡 ACTION: Please wait a few moments and use 'npm run regenerate-video <slug>' to try again without re-downloading the transcript.",
      );
    } else if (
      msg.includes("429") ||
      msg.includes("quota") ||
      msg.includes("rate limit")
    ) {
      console.error(
        "🚨 RATE LIMIT/QUOTA (429): You have exceeded your Gemini API limits.",
      );
      console.error(
        "💡 ACTION: Check your tier limits in Google AI Studio or slow down your requests.",
      );
    } else if (
      msg.includes("invalid API key") ||
      msg.includes("API_KEY_INVALID") ||
      msg.includes("403")
    ) {
      console.error(
        "🚨 INVALID API KEY: The provided GEMINI_API_KEY is rejected or missing.",
      );
    } else {
      console.error(`🚨 UNEXPECTED ERROR: ${msg}`);
    }
    console.error("==================================================\n");

    throw new Error(`Failed to generate episode content with Gemini: ${msg}`);
  }
}

module.exports = {
  generateEpisodePayload,
};
