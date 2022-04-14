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
  },
  async rewrites() {
    return [
      {
        source: "/advanced-search",
        destination: "/recherche",
      },
      {
        source: "/directory",
        destination: "/annuaire",
      },
      {
        source: "/directory/:id",
        destination: "/annuaire/:id",
      },
      {
        source: "/directory-create",
        destination: "/annuaire-creation",
      },
      {
        source: "/procedure",
        destination: "/demarche",
      },
      {
        source: "/procedure/:id",
        destination: "/demarche/:id",
      },
      {
        source: "/program",
        destination: "/dispositif",
      },
      {
        source: "/program/:id",
        destination: "/dispositif/:id",
      },
      {
        source: "/how-to-contribute",
        destination: "/comment-contribuer",
      },
      {
        source: "/who-are-we",
        destination: "/qui-sommes-nous",
      },
      {
        source: "/legal-notices",
        destination: "/mentions-legales",
      },
      {
        source: "/accessibility-statement",
        destination: "/declaration-accessibilite",
      },
      {
        source: "/privacy-policy",
        destination: "/politique-de-confidentialite",
      },
    ]
  }
}
