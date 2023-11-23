const { i18n } = require("./next-i18next.config");
const { translatedRedirects, oldPathsRedirects, partnersRedirect, rewrites } = require("./redirects.js");

module.exports = {
  reactStrictMode: true, // Fix for https://github.com/kirill-konshin/next-redux-wrapper/issues/422
  i18n,
  images: {
    domains: ["storage.googleapis.com", "res.cloudinary.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      events: false,
      buffer: false,
      process: require.resolve("process/browser"),
    };
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    });
    return config;
  },
  //This option requires Next 13.1 or newer, if you can't update you can use this plugin instead: https://github.com/martpie/next-transpile-modules
  transpilePackages: ["@codegouvfr/react-dsfr"],
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return rewrites;
  },
  async redirects() {
    return [...oldPathsRedirects, ...translatedRedirects, ...partnersRedirect];
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
