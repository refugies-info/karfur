const { i18n } = require("./next-i18next.config");
const {
  translatedRedirects,
  oldPathsRedirects,
  partnersRedirect,
  annuaireRemovalRedirects,
  rewrites,
} = require("./redirects.js");
const path = require("path");

module.exports = {
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
  transpilePackages: ["@codegouvfr/react-dsfr", "@refugies-info/ui", "@refugies-info/shared"],
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
