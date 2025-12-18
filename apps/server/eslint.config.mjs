import eslint from "@eslint/js";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, {
  ignores: ["dist"],
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: __dirname,
    },
  },
});
