/**
 * @typedef {Object} ArticleSection
 * @property {'text' | 'insight' | 'quote'} type - Block type
 * @property {string} [heading] - Optional section heading
 * @property {string} content - Block text/body content
 * @property {string} [context] - Optional context annotation for quotes
 * @property {string} [anchorId] - Optional anchor link ID
 */

/**
 * @typedef {Object} TableOfContentsItem
 * @property {string} title - Header text
 * @property {string} anchorId - Slugified element ID
 */

/**
 * @typedef {Object} QuoteHighlight
 * @property {string} quote - Quote text
 * @property {string} context - Explanatory context
 */

/**
 * @typedef {Object} PodcastMoment
 * @property {string} title - Moment title
 * @property {string} summary - Highlight/analogy description
 */

/**
 * @typedef {Object} ArticleSEO
 * @property {string} metaTitle - SEO Title
 * @property {string} metaDescription - SEO Description
 * @property {string[]} keywords - Keywords list
 */

/**
 * @typedef {Object} ArticleSource
 * @property {string} episodeId - Original episode ID
 * @property {string} episodeTitle - Original episode title
 * @property {string} videoId - YouTube Video ID
 * @property {string} youtubeUrl - YouTube URL
 */

/**
 * @typedef {Object} Article
 * @property {string} id - Unique identifier for the article
 * @property {string} slug - URL-friendly slug
 * @property {string} title - Article title
 * @property {string} subtitle - Article subtitle
 * @property {string} derivedFrom - Source descriptor (e.g. "Podcast Conversation")
 * @property {string} generatedAt - ISO Timestamp string
 * @property {string} author - Editorial Author name
 * @property {'draft' | 'published' | 'archived'} status - Current publishing state
 * @property {'Beginner' | 'Intermediate' | 'Advanced'} readingLevel - Target audience reading level
 * @property {number} readingTime - Estimated reading time in minutes
 * @property {string} featuredInsight - Visually highlighted insight for card display
 * @property {ArticleSEO} seo - SEO tags object
 * @property {ArticleSource} source - Source episode attribution metadata
 * @property {TableOfContentsItem[]} tableOfContents - Table of contents items
 * @property {string} introduction - Main introductory paragraph
 * @property {string[]} keyInsights - Visually prominent highlights (bullet points)
 * @property {QuoteHighlight[]} quoteHighlights - Context-rich quote highlights
 * @property {PodcastMoment[]} podcastMoments - Moment callouts from conversation
 * @property {ArticleSection[]} sections - Nested content blocks
 * @property {string} conclusion - Wrap-up statement
 * @property {string[]} tags - Filter tags
 */

/**
 * @typedef {Object} SummarySection
 * @property {string} heading - Section title
 * @property {string} content - Section paragraphs content
 */

/**
 * @typedef {Object} ConversationSummary
 * @property {string} title - Summary title
 * @property {string} introduction - Summary introductory paragraph
 * @property {SummarySection[]} sections - Detail sections
 * @property {string} conclusion - Summary wrap-up statement
 */

/**
 * @typedef {Object} PodcastEpisode
 * @property {string} id - Unique identifier
 * @property {string} slug - URL-friendly slug
 * @property {string} videoId - YouTube video ID
 * @property {string} youtubeUrl - Full YouTube URL
 * @property {string} title - Episode title
 * @property {string} thumbnail - Thumbnail URL
 * @property {'processing' | 'completed' | 'failed'} status - Current processing status
 * @property {string} [transcript] - Full transcript text
 * @property {string} [summary] - Episode summary
 * @property {ConversationSummary} [conversationSummary] - Rich conversation summary
 * @property {string[]} [takeaways] - Array of key takeaways
 * @property {string[]} [topics] - Array of discussed topics
 * @property {Article[]} [articles] - Generated articles
 * @property {string} createdAt - ISO Timestamp
 * @property {string} updatedAt - ISO Timestamp
 */

module.exports = {};
