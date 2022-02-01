module.exports = {
  images: {
    domains: [
      "storage.googleapis.com",
      "res.cloudinary.com"
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      events: false,
      buffer: false
    };
    return config;
  },
  experimental: {
    styledComponents: true
  }
}
