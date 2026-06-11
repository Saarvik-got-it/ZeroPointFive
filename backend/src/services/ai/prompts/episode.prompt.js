const EPISODE_GENERATION_PROMPT = `
You are an expert content producer and technical writer for "The Zero Point Five Show" podcast.
Your task is to analyze the following podcast transcript and generate a highly structured JSON output containing the summary, takeaways, topics covered, and two long-form, magazine-grade articles based on the content.

INSTRUCTIONS:
1. Provide a concise, engaging 'summary' (100-150 words) that captures the essence of the episode.
2. List 3 to 5 'takeaways'. These should be actionable, key insights for the listener.
3. List 3 to 5 'topics'. These are short tags/phrases like "Artificial Intelligence", "Startup Strategy", etc.
4. Generate 2 distinct, highly engaging, premium long-form 'articles' inspired by specific interesting sub-topics in the transcript.

ARTICLE DESIGN & QUALITY PRINCIPLES:
- The articles must read like a premium, professionally written long-form editorial from publications like Medium or Substack.
- Each article MUST be at least 1200–1800 words (aim for 1500+ words) with substantial depth, narrative flow, and analytical rigor. Avoid generic AI writing, repetition, and walls of text.
- Write text paragraphs that flow naturally in a full-width column editorial layout. Avoid formatting short line breaks or artificially narrow sentence-wrapping inside the text block string itself, letting the text span to container boundaries.
- Do NOT generate articles as a single content string. Conforming strictly to the structure below.
- Generate dynamic visual content blocks under the 'sections' property of the article. Vary block types between:
  - "text": for detailed narrative analysis (must have a heading, a slugified anchorId, and content with paragraphs separated by newlines).
  - "insight": a visually prominent callout containing a core lesson or takeaway.
  - "quote": a key quote from the podcast with accompanying context about when/why it was spoken.
- Generate a tableOfContents detailing the major text headings and their corresponding slugified anchorId. Make sure the anchorId in the tableOfContents matches the anchorId on the corresponding text section blocks.
- Highlight key insights (3-5 items) and podcast moments (analogies, stories, or exchanges that occurred in the episode).
- Extract 2-5 quote highlights with explanatory context.
- Provide a strong headline (title), subtitle, author, metadata, status, readingLevel, tags, and readingTime.
- Include structured SEO metadata (metaTitle, metaDescription, keywords) for organic search discovery.
- Include a self-contained source attribution block. (Note: For the source attribution fields, leave 'episodeId', 'episodeTitle', 'videoId', and 'youtubeUrl' empty or set them as placeholder variables; the backend codebase will inject the actual episode values).

FORMAT: 
You MUST respond with ONLY a valid JSON object matching the following structure exactly. Do NOT wrap the JSON in Markdown code blocks (e.g., \`\`\`json). Just the raw JSON.

{
  "summary": "String...",
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
