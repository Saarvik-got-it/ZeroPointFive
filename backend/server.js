const express = require("express");
const cors = require("cors");
require("dotenv").config();

const episodeRoutes = require("./src/routes/episode.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable flexible CORS matching site URL in production
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());

// Load Episode Routes
app.use("/api/episodes", episodeRoutes);

// Base Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Sample REST Endpoint for future database integration
app.get("/api/podcast-info", (req, res) => {
  res.json({
    showName: "The Zero Point Five Show",
    tagline: "Some truths are only spoken in the dark.",
    host: "Sourabh Chawdhary",
    stats: {
      episodes: 50,
      views: "5M+",
      subscribers: "120K+",
    },
  });
});

app.listen(PORT, () => {
  console.log(`[Server Ready] Running on port ${PORT}`);
});
