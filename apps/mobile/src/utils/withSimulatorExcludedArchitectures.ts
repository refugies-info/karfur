import { ConfigPlugin, withXcodeProject, XcodeProject } from "expo/config-plugins";

interface XCBuildConfiguration {
  buildSettings?: {
    PRODUCT_NAME?: string;
    [key: string]: unknown;
  };
}

type XCBuildConfigurationSection = {
  [key: string]: XCBuildConfiguration;
};

function setExcludedArchitectures(project: XcodeProject) {
  const configurations = project.pbxXCBuildConfigurationSection() as XCBuildConfigurationSection;

  for (const config of Object.values(configurations)) {
    const buildSettings = config.buildSettings;
    if (buildSettings?.PRODUCT_NAME !== undefined) {
      buildSettings['"EXCLUDED_ARCHS[sdk=iphonesimulator*]"'] = '"arm64"';
    }
  }

  return project;
}

const withExcludedSimulatorArchitectures: ConfigPlugin = (config) => {
  return withXcodeProject(config, (config) => {
    config.modResults = setExcludedArchitectures(config.modResults);
    return config;
  });
};

export default withExcludedSimulatorArchitectures;
