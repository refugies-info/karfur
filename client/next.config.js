const { i18n } = require("./next-i18next.config");
const { translatedRedirects, oldPathsRedirects, rewrites } = require("./redirects.js");

module.exports = {
  reactStrictMode: true, // Fix for https://github.com/kirill-konshin/next-redux-wrapper/issues/422
  i18n,
  images: {
    domains: ["storage.googleapis.com", "res.cloudinary.com"],
  },
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      events: false,
      buffer: false,
      process: require.resolve("process/browser"),
    };
    return config;
  },
  compiler: {
    styledComponents: true,
  },
  async rewrites() {
    return rewrites;
  },
  async redirects() {
    return [...oldPathsRedirects, ...translatedRedirects];
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
