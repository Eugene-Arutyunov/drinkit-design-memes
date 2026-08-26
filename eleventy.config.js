module.exports = function (conf) {
  // Local-only files stay in .gitignore (so they are not deployed),
  // but Eleventy still builds them on localhost.
  conf.setUseGitIgnore(false);

  conf.addPassthroughCopy("./src/ids");
  conf.addPassthroughCopy("./src/index.js");
  conf.addPassthroughCopy("./src/assets");
  conf.addPassthroughCopy("./src/fonts");
  conf.addPassthroughCopy({
    "./node_modules/vidstack/cdn/with-layouts": "vidstack",
  });

  conf.addWatchTarget("./src/index.css");
  conf.addWatchTarget("./src/styles/");
  conf.addWatchTarget("./src/ids/");

  return {
    dir: {
      input: "./src",
      includes: "./includes",
    },
    htmlTemplateEngine: "njk",
  };
};
