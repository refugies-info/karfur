import type { Config } from "tailwindcss";

const sharedConfig = require("@refugies-info/tailwind-config");

const config: Config = {
  presets: [sharedConfig],
  theme: sharedConfig.theme,
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};

export default config;
