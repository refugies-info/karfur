import typescriptEslint from "@typescript-eslint/eslint-plugin";
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

export default [{
    ignores: [
        "**/dist/**/*",
        "**/private/**/*",
        "**/config/**/*",
        "src/**/*.test.ts",
        "**/jest.config.js",
    ],
}, ...compat.extends("eslint:recommended").map(config => ({
    ...config,
    files: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx"],
})), {
    files: ["src/**/*.js", "src/**/*.ts", "src/**/*.tsx"],

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.commonjs,
            ...globals.jest,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 11,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                modules: true,
            },

            project: "./tsconfig.json",
        },
    },

    rules: {
        "no-else-return": "error",
        "no-console": "error",
        "no-unused-expressions": "error",
        "no-unused-vars": "off",
        "no-use-before-define": "error",
        quotes: ["error", "double"],
        "object-shorthand": "off",
        eqeqeq: "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-floating-promises": "error",
    },
}];