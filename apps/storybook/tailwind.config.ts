import { fr } from "@codegouvfr/react-dsfr";
import type { Config } from "tailwindcss";

console.log(fr.colors.decisions.text);

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "grey": {
          "1000-50": "#fff",
          "1000-50-hover": "#f6f6f6",
          "1000-50-active": "#ededed",
          "975-75": "#f6f6f6",
          // Add more grey shades...
        },
        "blue-france": {
          "975-75": "#f5f5fe",
          "975-75-hover": "#dcdcfc",
          "975-75-active": "#cbcbfa",
          "950-100": "#ececfe",
          // Add more blue france shades...
        },
        "red-marianne": {
          "975-75": "#fef4f4",
          "975-75-hover": "#fcd7d7",
          "975-75-active": "#fac4c4",
          "950-100": "#fee9e9",
          // Add more red marianne shades...
        },
        "info": {
          "950-100": "#e8edff",
          "950-100-hover": "#c2d1ff",
          "950-100-active": "#a9bfff",
          "425-625": "#0063cb",
          // Add more info shades...
        },
        "success": {
          "950-100": "#b8fec9",
          "950-100-hover": "#46fd89",
          "950-100-active": "#34eb7b",
          "425-625": "#18753c",
          // Add more success shades...
        },
        "warning": {
          "950-100": "#ffe9e6",
          "950-100-hover": "#ffc6bd",
          "950-100-active": "#ffb0a2",
          "425-625": "#b34000",
          // Add more warning shades...
        },
        "error": {
          "950-100": "#ffe9e9",
          "950-100-hover": "#ffc5c5",
          "950-100-active": "#ffafaf",
          "425-625": "#ce0500",
          // Add more error shades...
        },
        "green-tilleul-verveine": {
          "975-75": "#fef7da",
          "975-75-hover": "#fce552",
          "975-75-active": "#ebd54c",
          "950-100": "#fceeac",
          // Add more green tilleul verveine shades...
        },
      },
    },
  },
  plugins: [],
};
export default config;
