require("dotenv").config();
const { regenerateVideo } = require("../src/pipeline/ingest");

const slug = process.argv[2];

if (!slug) {
  console.error("Usage: npm run regenerate-video <EPISODE_SLUG>");
  process.exit(1);
}

regenerateVideo(slug)
  .then(() => {
    process.exitCode = 0;
  })
  .catch((err) => {
    console.error("Unhandled Script Error:", err);
    process.exit(1);
  });
