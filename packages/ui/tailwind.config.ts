import type { Config } from "tailwindcss";

const sharedConfig = require("@refugies-info/tailwind-config");

const config: Config = {
  presets: [sharedConfig],
  theme: sharedConfig.theme,
  content: ["./src/**/*.tsx", "./src/**/*.ts", "./src/**/*.jsx", "./src/**/*.js", "./src/**/*.mdx", "./src/**/*.md"], // Add this line to fix the error
};

console.log(sharedConfig.content);

export default config;
