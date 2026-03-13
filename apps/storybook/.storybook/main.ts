// This file has been automatically migrated to valid ESM format by Storybook.

import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/nextjs-vite";

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
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },
  viteFinal: async (config) => {
    config.assetsInclude = [
      ...(Array.isArray(config.assetsInclude)
        ? config.assetsInclude
        : config.assetsInclude
          ? [config.assetsInclude]
          : []),
      "**/*.lottie",
      "**/*.woff2",
    ];
    return config;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
