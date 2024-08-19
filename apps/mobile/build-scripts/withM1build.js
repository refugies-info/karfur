const fs = require("fs");
const path = require("path");
const generateCode = require("@expo/config-plugins/build/utils/generateCode");
const configPlugins = require("@expo/config-plugins");

const code = `
pre_install do |installer|
    installer.pods_project.build_configurations.each do |config|
        config.build_settings["EXCLUDED_ARCHS[sdk=iphonesimulator*]"] = "arm64"
    end
end`;

const withM1build = (config) => {
  return configPlugins.withDangerousMod(config, [
    "ios",
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const contents = fs.readFileSync(filePath, "utf-8");

      const addCode = generateCode.mergeContents({
        tag: "withM1build",
        src: contents,
        newSrc: code,
        anchor: /\s*get_default_flags\(\)/i,
        offset: 2,
        comment: "#",
      });

      if (!addCode.didMerge) {
        // eslint-disable-next-line no-console
        console.error(
          "ERROR: Cannot add withM1build to the project's ios/Podfile because it's malformed."
        );
        return config;
      }

      fs.writeFileSync(filePath, addCode.contents);

      return config;
    },
  ]);
};

module.exports = withM1build;
