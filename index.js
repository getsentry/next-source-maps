const SentryWebpackPlugin = require("@sentry/webpack-plugin");

let {
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_RELEASE,
  SENTRY_AUTH_TOKEN,
  VERCEL_GITHUB_COMMIT_SHA,
  VERCEL_GITLAB_COMMIT_SHA,
  VERCEL_BITBUCKET_COMMIT_SHA,
} = process.env;

SENTRY_RELEASE =
  SENTRY_RELEASE ||
  VERCEL_GITHUB_COMMIT_SHA ||
  VERCEL_GITLAB_COMMIT_SHA ||
  VERCEL_BITBUCKET_COMMIT_SHA;

module.exports = (pluginOptions = {}) => {
  return (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        if (!options.defaultLoaders) {
          throw new Error(
            "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
          );
        }

        const { dev } = options;

        if (!dev) {
          if (!SENTRY_ORG && !pluginOptions.org)
            throw new Error(
              "Missing required `SENTRY_ORG` environment variable or `org` plugin option."
            );
          if (!SENTRY_PROJECT && !pluginOptions.project)
            throw new Error(
              "Missing required `SENTRY_PROJECT` environment variable or `project` plugin option."
            );
          if (!SENTRY_RELEASE && !pluginOptions.release)
            throw new Error(
              "Missing required `SENTRY_RELEASE` environment variable or `release` plugin option."
            );
          if (!SENTRY_AUTH_TOKEN && !pluginOptions.authToken)
            throw new Error(
              "Missing required `SENTRY_AUTH_TOKEN` environment variable or `authToken` plugin option."
            );

          config.plugins.push(
            new SentryWebpackPlugin({
              org: SENTRY_ORG || pluginOptions.org,
              project: SENTRY_PROJECT || pluginOptions.project,
              release: SENTRY_RELEASE || pluginOptions.release,
              authToken: SENTRY_AUTH_TOKEN || pluginOptions.authToken,
              include: ".next",
              ignore: ["node_modules"],
              stripPrefix: ["webpack://_N_E/"], // Is it necessary? — Kamil
              urlPrefix: `~/_next`,
              ...pluginOptions,
            })
          );
        }

        if (typeof nextConfig.webpack === "function") {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    });
  };
};
