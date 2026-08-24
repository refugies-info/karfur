const { i18n } = require("./next-i18next.config");
const {
  translatedRedirects,
  oldPathsRedirects,
  partnersRedirect,
  annuaireRemovalRedirects,
  rewrites,
} = require("./redirects.js");
const path = require("path");
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  reactStrictMode: true, // see https://github.com/kirill-konshin/next-redux-wrapper/issues/422
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/refugies-info-assets/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dlmqnnhp6/image/upload/**",
      },
    ],
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fullySpecified: false,
    };
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    });
    config.module.rules.push({
      test: /\.lottie$/,
      type: "asset/resource",
    });
    return config;
  },
  //This option requires Next 13.1 or newer, if you can't update you can use this plugin instead: https://github.com/martpie/next-transpile-modules
  transpilePackages: ["@codegouvfr/react-dsfr", "@refugies-info/mongo", "@refugies-info/ui"],
  serverExternalPackages: ["mongoose"],
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return rewrites;
  },
  async redirects() {
    return [
      ...oldPathsRedirects,
      ...translatedRedirects,
      ...partnersRedirect,
      ...annuaireRemovalRedirects,
    ];
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|woff2|mp4)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, must-revalidate",
          },
        ],
      },
    ];
  },
};

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "betagouv",
  project: "refugiesinfo-client",
  sentryUrl: "https://sentry.incubateur.net/",
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // No tunnelRoute: the i18n locale middleware 308-redirects /monitoring to
  // /fr/monitoring, which the Sentry rewrite does not cover, so every envelope
  // ends up on the 404 page. Sentry is self-hosted on an internal domain, so
  // ad-blockers are not a concern here.

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
