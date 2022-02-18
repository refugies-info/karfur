const { i18n } = require("./next-i18next.config");

module.exports = {
  reactStrictMode: true, // Fix for https://github.com/kirill-konshin/next-redux-wrapper/issues/422
  i18n,
  images: {
    domains: [
      "storage.googleapis.com",
      "res.cloudinary.com"
    ],
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
    styledComponents: true
  }
}
