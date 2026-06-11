const fs = require("fs/promises");
const path = require("path");

const dataDir = path.join(__dirname, "../../data/episodes");

class EpisodeRepository {
  async _ensureDataDir() {
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }
  }

  /**
   * @param {string} slug
   * @returns {Promise<import('../types').PodcastEpisode | null>}
   */
  async getBySlug(slug) {
    if (!slug) return null;
    await this._ensureDataDir();
    const filePath = path.join(dataDir, `${slug}.json`);
    try {
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      if (err.code === "ENOENT") return null;
      throw err;
    }
  }

  /**
   * @returns {Promise<import('../types').PodcastEpisode[]>}
   */
  async getAllEpisodes() {
    await this._ensureDataDir();
    try {
      const files = await fs.readdir(dataDir);
      const episodes = [];
      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = await fs.readFile(path.join(dataDir, file), "utf-8");
          episodes.push(JSON.parse(content));
        }
      }
      // Sort by createdAt descending
      return episodes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    } catch (err) {
      return [];
    }
  }

  /**
   * @param {import('../types').PodcastEpisode} episode
   */
  async saveEpisode(episode) {
    if (!episode || !episode.slug) throw new Error("Episode must have a slug");
    await this._ensureDataDir();
    const filePath = path.join(dataDir, `${episode.slug}.json`);
    episode.updatedAt = new Date().toISOString();
    if (!episode.createdAt) {
      episode.createdAt = episode.updatedAt;
    }
    await fs.writeFile(filePath, JSON.stringify(episode, null, 2), "utf-8");
    return episode;
  }

  /**
   * @param {string} articleSlug
   * @returns {Promise<any | null>}
   */
  async getArticleBySlug(articleSlug) {
    const episodes = await this.getAllEpisodes();
    for (const episode of episodes) {
      if (episode.articles && Array.isArray(episode.articles)) {
        const article = episode.articles.find((a) => a.slug === articleSlug);
        if (article) {
          return article;
        }
      }
    }
    return null;
  }
}

module.exports = new EpisodeRepository();
