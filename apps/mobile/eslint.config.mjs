import eslint from "@eslint/js";
import reactNativePlugin from "@react-native/eslint-plugin";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  // Base configurations
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // Configuration for JavaScript files
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      globals: {
        __DEV__: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },

  // Configuration for TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
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
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Disable the base no-unused-vars rule for TypeScript files
      "no-unused-vars": "off",

      // Configure TypeScript-specific unused vars rule
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Other rules
      "no-console": "warn",
    },
  },
);
