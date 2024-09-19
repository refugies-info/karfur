import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

import dsfrcolors from "./dsfr-colors";

console.log(dsfrcolors);

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      ...defaultTheme.screens,
      "xs": "280px",
      "2xl": "1400px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "2rem",
        xs: "1rem",
        sm: "1rem",
      },
    },
    extend: {
      colors: {
        ...dsfrcolors,
      },
    },
  },
};

export default config;
