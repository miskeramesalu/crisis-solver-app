module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress protobufjs warning
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        {
          module: /@protobufjs\/inquire/,
        },
      ];

      // Find the existing source-map-loader rule and modify it
      const sourceMapLoaderRule = webpackConfig.module.rules.find(
        (rule) =>
          rule.enforce === "pre" &&
          rule.use &&
          rule.use.some(
            (u) =>
              u === "source-map-loader" ||
              (typeof u === "object" && u.loader === "source-map-loader")
          )
      );

      if (sourceMapLoaderRule) {
        // Add exclude for @protobufjs/inquire
        if (!sourceMapLoaderRule.exclude) {
          sourceMapLoaderRule.exclude = /@protobufjs\/inquire/;
        } else if (Array.isArray(sourceMapLoaderRule.exclude)) {
          sourceMapLoaderRule.exclude.push(/@protobufjs\/inquire/);
        } else {
          sourceMapLoaderRule.exclude = [
            sourceMapLoaderRule.exclude,
            /@protobufjs\/inquire/,
          ];
        }
      } else {
        // Fallback: push a new rule that ignores the package
        webpackConfig.module.rules.push({
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
          exclude: /@protobufjs\/inquire/,
        });
      }

      return webpackConfig;
    },
  },

  devServer: (devServerConfig) => {
    // Remove deprecated options
    delete devServerConfig.onAfterSetupMiddleware;
    delete devServerConfig.onBeforeSetupMiddleware;

    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      return middlewares;
    };

    return devServerConfig;
  },
};