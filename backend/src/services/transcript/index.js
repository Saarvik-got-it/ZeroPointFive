const youtubeProvider = require("./youtube.provider");

module.exports = {
  // Can be easily swapped or determined via environment variables in the future
  defaultProvider: youtubeProvider,
};
