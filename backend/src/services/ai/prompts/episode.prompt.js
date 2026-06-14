const EPISODE_GENERATION_PROMPT = `
You are an expert content producer and technical writer for "The Zero Point Five Show" podcast.
Your task is to analyze the following podcast transcript and generate a highly structured JSON output containing the summary, takeaways, topics covered, and two long-form, magazine-grade articles based on the content.

INSTRUCTIONS:
1. Provide a concise, engaging 'summary' (50-80 words) that captures the essence of the episode.
2. List exactly 3 'takeaways'. These should be actionable, key insights for the listener.
3. List exactly 3 'topics'. These are short tags/phrases like "Artificial Intelligence", "Startup Strategy", etc.
4. Generate 2 distinct, highly concise 'articles' (each 200–250 words total) inspired by specific interesting sub-topics in the transcript.
5. Generate a 'conversationSummary' of approximately 150–200 words total that provides a brief, cohesive, structured overview of the entire discussion.
   - Structurally, this must contain a 'title', an 'introduction', an array of 3 'sections' (each section must have a 'heading' and a 'content' field with 1 short paragraph of 50-70 words, avoiding giant walls of text), and a 'conclusion'.
6. ALL generated JSON fields, including summaries, takeaways, topics, articles, sections, and particularly extracted quotes (in 'quoteHighlights' and inline 'quote' sections), MUST be written entirely in fluent, professional English. If a quote or segment was spoken in Hindi, Hinglish, or Devanagari script in the transcript, you MUST translate it into professional English in the JSON. Do NOT output Devanagari characters or Hindi words anywhere in the JSON payload.
 
ARTICLE DESIGN & QUALITY PRINCIPLES:
- Keep all article sections brief, containing only 1-2 short paragraphs of 60-90 words. Fulfill the structural template but keep the overall length extremely concise to fit output budgets.
- The articles must read like a premium, professionally written editorial from publications like Medium or Substack.
- Each article MUST be extremely concise, between 200–250 words total. The 'sections' array should contain exactly 2 short sections (each with a single short paragraph, 50-80 words). Keep it highly focused and brief. Avoid long essays.
- Write text paragraphs that flow naturally in a full-width column editorial layout. Avoid formatting short line breaks or artificially narrow sentence-wrapping inside the text block string itself.
- Do NOT generate articles as a single content string. Conforming strictly to the structure below.
- Limit 'keyInsights' to exactly 2 items, 'quoteHighlights' to exactly 1 item, and 'podcastMoments' to exactly 1 item to optimize the payload size.
- Generate dynamic visual content blocks under the 'sections' property of the article. Vary block types between:
  - "text": for narrative analysis (must have a heading, a slugified anchorId, and content with paragraphs separated by newlines).
  - "insight": a visually prominent callout containing a core lesson.
  - "quote": a key quote from the podcast with accompanying context.
- Generate a tableOfContents detailing the major text headings and their corresponding slugified anchorId.
- Provide a strong headline (title), subtitle, author, metadata, status, readingLevel, tags, and readingTime.
- Include structured SEO metadata (metaTitle, metaDescription, keywords).
- Include a self-contained source attribution block. (Note: Leave 'episodeId', 'episodeTitle', 'videoId', and 'youtubeUrl' empty; the backend codebase will inject the actual values).

FORMAT: 
You MUST respond with ONLY a valid JSON object matching the following structure exactly. Do NOT wrap the JSON in Markdown code blocks (e.g., \`\`\`json). Just the raw JSON.

{
  "summary": "String...",
  "conversationSummary": {
    "title": "String...",
    "introduction": "String...",
    "sections": [
      {
        "heading": "String...",
        "content": "String (1-2 paragraphs detailing the segment...)"
      }
    ],
    "conclusion": "String..."
  },
  "takeaways": ["String", "String", "String"],
  "topics": ["String", "String", "String"],
  "articles": [
    {
      "id": "String (e.g., article-1)",
      "slug": "String (URL-friendly slugified title)",
      "title": "String (Strong editorial headline)",
      "subtitle": "String (Engaging, descriptive subtitle)",
      "derivedFrom": "Podcast Conversation",
      "generatedAt": "String (ISO Timestamp placeholder)",
      "author": "The 0.5 Show Editorial Team",
      "status": "published",
      "readingLevel": "String (Beginner | Intermediate | Advanced)",
      "readingTime": Number (Estimated reading time in minutes),
      "featuredInsight": "String (A single prominent key insight to display on the article card)",
      "seo": {
        "metaTitle": "String (SEO title tag)",
        "metaDescription": "String (Compelling meta description)",
        "keywords": ["String", "String"]
      },
      "source": {
        "episodeId": "",
        "episodeTitle": "",
        "videoId": "",
        "youtubeUrl": ""
      },
      "tableOfContents": [
        {
          "title": "String (Header Title matching a text section)",
          "anchorId": "String (URL-safe slugified ID, e.g., why-startups-win)"
        }
      ],
      "introduction": "String (Engaging, narrative first paragraph)",
      "keyInsights": ["String", "String", "String"],
      "quoteHighlights": [
        {
          "quote": "String (Direct notable statement)",
          "context": "String (Contextual explanation of what was being discussed)"
        }
      ],
      "podcastMoments": [
        {
          "title": "String (Analogy or event title)",
          "summary": "String (Summary of this conversational segment or story)"
        }
      ],
      "sections": [
        {
          "type": "text",
          "heading": "String (Section Heading)",
          "content": "String (Detailed analytical paragraphs. Separate distinct paragraphs using two newlines \\n\\n)",
          "anchorId": "String (URL-safe slugified ID matching the ToC entry)"
        },
        {
          "type": "insight",
          "content": "String (Highly impactful visual callout text summarizing a lesson)"
        },
        {
          "type": "quote",
          "content": "String (Notable inline quote)",
          "context": "String (Context about when or why it was said)"
        }
      ],
      "conclusion": "String (Reflective summary paragraph)",
      "tags": ["String", "String"]
    }
  ]
}

TRANSCRIPT:
`;

module.exports = { EPISODE_GENERATION_PROMPT };
