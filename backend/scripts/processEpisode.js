require("dotenv").config();
const { processVideo } = require("../src/pipeline/ingest");

const url = process.argv[2];

if (!url) {
  console.error("Usage: npm run process-video <YOUTUBE_URL>");
  process.exit(1);
}

processVideo(url)
  .then(() => {
    process.exitCode = 0;
  })
  .catch((err) => {
    console.error("Unhandled Script Error:", err);
    process.exit(1);
  });
