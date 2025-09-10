import eslint from "@eslint/js";
import path from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  eslint.configs.recommended,
  {
    ...tseslint.configs.recommended,
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
    },
  },
  {
    ignores: ["dist"],
  },
);
