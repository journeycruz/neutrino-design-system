import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

const config: StorybookConfig = {
  stories: [
    "../../../packages/components/src/**/*.stories.@(ts|tsx)",
    "../src/contracts/**/*.stories.@(ts|tsx)"
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest", "@chromatic-com/storybook"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (viteConfig) => {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      "@neutrino/components": resolve(rootDir, "packages/components/src/index.ts")
    };
    return viteConfig;
  }
};

export default config;
