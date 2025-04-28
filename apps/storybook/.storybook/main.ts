import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
    "@storybook/addon-viewport",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  webpackFinal: async (config) => {
    if (config.module) {
      config.module.rules ||= [];

      config.module.rules.push({
        test: /\.lottie$/,
        type: "asset/resource",
      });

      config.module.rules.push({
        test: /\.woff2$/,
        type: "asset/resource",
      });
    }
    return config;
  },
};

export default config;
