// This file has been automatically migrated to valid ESM format by Storybook.

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs";

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-themes"),
    getAbsolutePath("@storybook/addon-docs"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/nextjs"),
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

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
