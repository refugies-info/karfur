module.exports = {
  reactStrictMode: true, // Fix for https://github.com/kirill-konshin/next-redux-wrapper/issues/422
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
