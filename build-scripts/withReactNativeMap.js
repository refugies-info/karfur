const fs = require("fs");
const path = require("path");
const generateCode = require("@expo/config-plugins/build/utils/generateCode");
const configPlugins = require("@expo/config-plugins");

const code = `
$RNFirebaseAnalyticsWithoutAdIdSupport=true

# Note you don't need to add RNBootSplash or react-native-app-auth if unused
$static_library = [
 'React',
 'Google-Maps-iOS-Utils',
 'GoogleMaps',
 'react-native-maps',
 'react-native-google-maps',
 'React-hermes'
]

pre_install do |installer|
    Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
    installer.pod_targets.each do |pod|
      bt = pod.send(:build_type)
      if $static_library.include?(pod.name)
        puts "Overriding the build_type to static_library from static_framework for #{pod.name}"
        def pod.build_type;
          Pod::BuildType.static_library
        end
      end
    end
    installer.pod_targets.each do |pod|
      bt = pod.send(:build_type)
      puts "#{pod.name} (#{bt})"
      puts "  linkage: #{bt.send(:linkage)} packaging: #{bt.send(:packaging)}"
    end
end`;

const withReactNativeMaps = (config) => {
  return configPlugins.withDangerousMod(config, [
    "ios",
    async (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      const contents = fs.readFileSync(filePath, "utf-8");

      const addCode = generateCode.mergeContents({
        tag: "withReactNativeFirebase",
        src: contents,
        newSrc: code,
        anchor: /\s*get_default_flags\(\)/i,
        offset: 2,
        comment: "#",
      });

      if (!addCode.didMerge) {
        // eslint-disable-next-line no-console
        console.error(
          "ERROR: Cannot add withReactNativeMaps to the project's ios/Podfile because it's malformed."
        );
        return config;
      }

      fs.writeFileSync(filePath, addCode.contents);

      return config;
    },
  ]);
};

module.exports = withReactNativeMaps;
