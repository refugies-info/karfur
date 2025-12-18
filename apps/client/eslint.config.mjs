import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import turbo from "eslint-plugin-turbo";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: [
      "**/*.test.js",
      "**/*.fakeTest.js",
      "**/coverage/**/*",
      "**/cypress/**/*",
      "**/*.faketest.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "plugin:react/jsx-runtime"),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
      turbo,
      react,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.browser,
        google: "readonly",
      },

      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: __dirname,
      },
    },

    rules: {
      "no-debugger": "warn",
      "no-else-return": "error",
      "no-console": "error",
      "no-unused-expressions": "off",
      "no-unused-vars": "off",
      "no-use-before-define": "error",
      quotes: ["error", "double", { avoidEscape: true }],
      "object-shorthand": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": "off",
      "react/jsx-no-target-blank": "off",
      eqeqeq: "error",
      "no-undef": "error",
    },
  },
];

export default config;
