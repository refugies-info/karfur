// Cannot refactor this import to
// import { withXcodeProject } from "@expo/config-plugins";
// because it will break the build
import expoConfigPlugins from "@expo/config-plugins";

const { withXcodeProject } = expoConfigPlugins;

/**
 * Exclude building for arm64 on simulator devices in the pbxproj project.
 * Without this, production builds targeting simulators will fail.
 * @param {Object} project - The Xcode project object
 * @returns {Object} The modified Xcode project
 */
function setExcludedArchitectures(project) {
  const configurations = project.pbxXCBuildConfigurationSection();
  for (const config of Object.values(configurations || {})) {
    const { buildSettings } = config || {};
    // Guessing that this is the best way to emulate Xcode.
    // Using `project.addToBuildSettings` modifies too many targets.
    if (buildSettings?.PRODUCT_NAME !== undefined) {
      buildSettings['"EXCLUDED_ARCHS[sdk=iphonesimulator*]"'] = '"arm64"';
    }
  }
  return project;
}

/**
 * Expo config plugin to exclude arm64 simulator architectures
 * @param {Object} config - Expo config object
 * @returns {Object} Modified Expo config
 */
const withExcludedSimulatorArchitectures = (config) => {
  return withXcodeProject(config, (config) => {
    config.modResults = setExcludedArchitectures(config.modResults);
    return config;
  });
};

export default withExcludedSimulatorArchitectures;
