import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactNativePlugin from "eslint-plugin-react-native";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      "react-native": reactNativePlugin,
    },
    rules: {
      // Add any specific React Native rules here
    },
  },
);
