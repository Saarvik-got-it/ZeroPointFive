import { asset } from "../data/siteData";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Eager glob import of the dynamic metadata config copy to enrich API data on-the-fly
let episodeMetadata = {};
try {
  const meta = import.meta.glob("../data/episodeMetadata.json", { eager: true });
  const metaModule = Object.values(meta)[0];
  episodeMetadata = metaModule ? (metaModule.default || metaModule) : {};
} catch (e) {
  console.warn("[API Repository] Metadata configuration not found.", e);
}

function enrichEpisode(ep, index) {
  const meta = episodeMetadata[ep.slug] || {};
  let category = meta.category || ep.category;
  if (!category && ep.topics && ep.topics.length > 0) {
    const lowerTopics = ep.topics.map(t => t.toLowerCase());
    if (lowerTopics.some(t => t.includes("startup"))) category = "Startups";
    else if (lowerTopics.some(t => t.includes("leadership") || t.includes("women"))) category = "Leadership";
    else if (lowerTopics.some(t => t.includes("business") || t.includes("market"))) category = "Business";
    else if (lowerTopics.some(t => t.includes("ai") || t.includes("tech"))) category = "Technology";
    else if (lowerTopics.some(t => t.includes("future"))) category = "Future";
    else category = ep.topics[0];
  }
  if (!category) category = "Startups";

  const guestName = meta.guestName || "Special Guest";
  const guestCompany = meta.company || "ZeroPointFive";
  const guestRole = meta.role || "Guest";

  let resolvedImage = ep.thumbnail;
  if (meta.image) {
    if (meta.image.startsWith("KLing_")) {
      resolvedImage = ep.thumbnail;
    } else {
      resolvedImage = meta.image;
    }
  }

  let duration = meta.duration;
  if (!duration) {
    if (ep.durationSeconds) {
      const mins = Math.round(ep.durationSeconds / 60);
      duration = `${mins} min`;
    } else {
      duration = "45 min";
    }
  }

  const episodeNumber = meta.episodeNumber || String(56 + index).padStart(3, "0");

  return {
    ...ep,
    id: ep.slug,
    guest: guestName,
    company: guestCompany,
    role: guestRole,
    image: resolvedImage,
    category: category,
    episodeNumber: episodeNumber,
    duration: duration,
  };
}

export const ApiContentRepository = {
  getAllEpisodes: async () => {
    const res = await fetch(`${API_BASE_URL}/api/episodes`);
    if (!res.ok) throw new Error("Failed to fetch episodes");
    const data = await res.json();
    return data.map((ep, idx) => enrichEpisode(ep, idx));
  },
  getEpisodeBySlug: async (slug) => {
    const res = await fetch(`${API_BASE_URL}/api/episodes/${slug}`);
    if (!res.ok) throw new Error("Episode not found");
    const data = await res.json();
    return enrichEpisode(data, 0);
  },
  getAllArticles: async () => {
    const res = await fetch(`${API_BASE_URL}/api/episodes`);
    if (!res.ok) throw new Error("Failed to fetch episodes list");
    const list = await res.json();
    const articles = [];
    for (const epInfo of list) {
      try {
        const fullRes = await fetch(`${API_BASE_URL}/api/episodes/${epInfo.slug}`);
        if (fullRes.ok) {
          const fullEp = await fullRes.json();
          if (fullEp.articles) {
            articles.push(...fullEp.articles);
          }
        }
      } catch (err) {
        console.error("Error fetching articles for list:", err);
      }
    }
    return articles;
  },
  getArticleBySlug: async (slug) => {
    const res = await fetch(`${API_BASE_URL}/api/episodes/articles/${slug}`);
    if (!res.ok) throw new Error("Article not found");
    return res.json();
  }
};
