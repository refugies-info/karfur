/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"],
  // Custom resolver to handle redux-saga with package exports
  resolveRequest: (context, moduleName, platform) => {
    // Disable package exports for redux-saga specifically
    if (moduleName === "redux-saga" || moduleName.startsWith("redux-saga/")) {
      return context.resolveRequest(
        {
          ...context,
          unstable_enablePackageExports: false,
        },
        moduleName,
        platform,
      );
    }
    // Use default resolution for everything else
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = config;
