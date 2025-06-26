import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import turbo from "eslint-plugin-turbo";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends("plugin:react/recommended", "plugin:react/jsx-runtime"),

    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
        turbo,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 11,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "no-debugger": "warn",
        "no-else-return": "error",
        "no-console": "error",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",
        "@typescript-eslint/no-unused-vars": "off",

        quotes: ["error", "double", {
            avoidEscape: true,
        }],

        "object-shorthand": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "react/prop-types": "off",
        "react/no-unescaped-entities": "off",
        "react/no-unknown-property": "off",
        "react/jsx-no-target-blank": "off",
        eqeqeq: "error",
        "no-undef": "error",
    },
}]);