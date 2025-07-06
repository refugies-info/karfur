import eslint from "@eslint/js";
import reactNativePlugin from "@react-native/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Base configurations
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // React Native plugin
  {
    plugins: {
      "@react-native": reactNativePlugin,
    },
    languageOptions: {
      globals: {
        __DEV__: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // Add any project-specific rule overrides here
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
);
