import { asset } from "../data/siteData";

// Vite eager glob imports to scan the synced files folder dynamically
const episodeModules = import.meta.glob("../data/episodes/*.json", { eager: true });
const articleIndexModules = import.meta.glob("../data/articleIndex.json", { eager: true });

const rawEpisodes = Object.values(episodeModules).map(mod => mod.default || mod);
const articleIndexModule = Object.values(articleIndexModules)[0];
const articleIndex = articleIndexModule ? (articleIndexModule.default || articleIndexModule) : {};

// Pre-resolve dynamic guest images using the asset() helper and enrich articles
const episodes = rawEpisodes.map(ep => {
  let resolvedImage = ep.thumbnail;
  if (ep.image) {
    if (ep.image.startsWith("KLing_")) {
      resolvedImage = ep.thumbnail;
    } else {
      resolvedImage = ep.image;
    }
  }

  const enrichedArticles = (ep.articles && Array.isArray(ep.articles))
    ? ep.articles.map(art => ({
        ...art,
        source: {
          ...art.source,
          episodeSlug: ep.slug
        }
      }))
    : ep.articles;

  return {
    ...ep,
    image: resolvedImage,
    articles: enrichedArticles
  };
});

export const StaticContentRepository = {
  getAllEpisodes: async () => {
    // Sort descending by creation date (newest first)
    return [...episodes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getEpisodeBySlug: async (slug) => {
    return episodes.find(ep => ep.slug === slug) || null;
  },
  getAllArticles: async () => {
    const articles = [];
    episodes.forEach(ep => {
      if (ep.articles && Array.isArray(ep.articles)) {
        articles.push(...ep.articles);
      }
    });
    return articles;
  },
  getArticleBySlug: async (slug) => {
    const epSlug = articleIndex[slug];
    if (!epSlug) {
      // Fail-safe fallback: search episodes manually
      for (const ep of episodes) {
        if (ep.articles && Array.isArray(ep.articles)) {
          const art = ep.articles.find(a => a.slug === slug);
          if (art) return art;
        }
      }
      return null;
    }
    const episode = episodes.find(ep => ep.slug === epSlug);
    if (!episode || !episode.articles) return null;
    return episode.articles.find(art => art.slug === slug) || null;
  }
};
