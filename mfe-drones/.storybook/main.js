/** @type { import('@storybook/react-webpack5').StorybookConfig } */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-webpack5",
  webpackFinal: async (webpackConfig) => {
    const sharedPath = path.resolve(__dirname, "../../shared");
    console.log(">>> shared alias path:", sharedPath);

    webpackConfig.resolve.alias = {
      ...webpackConfig.resolve.alias,
      shared: sharedPath,
    };
    return webpackConfig;
  },
};
export default config;
