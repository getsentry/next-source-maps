const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const withSourceMaps = require("@zeit/next-source-maps");

const { env } = process;

const withSentry = (opts = {}) => {
  const pluginOptions = {
    org: env.SENTRY_ORG,
    project: env.SENTRY_PROJECT,
    release:
      env.SENTRY_RELEASE ||
      env.NEXT_PUBLIC_SENTRY_RELEASE ||
      env.VERCEL_GITHUB_COMMIT_SHA ||
      env.VERCEL_GITLAB_COMMIT_SHA ||
      env.VERCEL_BITBUCKET_COMMIT_SHA,
    authToken: env.SENTRY_AUTH_TOKEN,
    ...opts,
  };

  return (nextConfig = {}) => {
    return {
      ...nextConfig,
      webpack(config, options) {
        if (!options.defaultLoaders) {
          throw new Error(
            "This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade"
          );
        }

        const { dev } = options;

        if (!dev) {
          if (!pluginOptions.org)
            throw new Error(
              "Missing required `SENTRY_ORG` environment variable or `org` plugin option."
            );
          if (!pluginOptions.project)
            throw new Error(
              "Missing required `SENTRY_PROJECT` environment variable or `project` plugin option."
            );
          if (!pluginOptions.release)
            throw new Error(
              "Missing required `SENTRY_RELEASE` environment variable or `release` plugin option."
            );
          if (!pluginOptions.authToken)
            throw new Error(
              "Missing required `SENTRY_AUTH_TOKEN` environment variable or `authToken` plugin option."
            );

          config.plugins.push(
            new SentryWebpackPlugin({
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
    };
  };
};

const withSentrySourceMaps = (config) => withSentry()(withSourceMaps()(config));

exports.withSentry = withSentry;
exports.withSourceMaps = withSourceMaps;
exports.withSentrySourceMaps = withSentrySourceMaps;
