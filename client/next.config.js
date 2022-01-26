module.exports = {
  images: {
    domains: ["storage.googleapis.com"],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      events: false,
      buffer: false
    };
    return config;
  },
}
