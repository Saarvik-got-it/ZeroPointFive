const express = require("express");
const router = express.Router();
const episodeRepo = require("../repositories/episode.repository");

router.get("/", async (req, res) => {
  try {
    const episodes = await episodeRepo.getAllEpisodes();
    // For listing, we might filter out processing/failed episodes
    // and exclude heavy fields like transcript/articles
    const list = episodes
      .filter((ep) => ep.status === "completed")
      .map(({ transcript, articles, ...rest }) => rest);

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch episodes" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const episode = await episodeRepo.getBySlug(req.params.slug);
    if (!episode || episode.status !== "completed") {
      return res.status(404).json({ error: "Episode not found or not ready" });
    }
    res.json(episode);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch episode details" });
  }
});

router.get("/articles/:slug", async (req, res) => {
  try {
    const article = await episodeRepo.getArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article details" });
  }
});

module.exports = router;
