import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "surface",
      values: [{ name: "surface", value: "#ffffff" }]
    },
    a11y: {
      test: "error"
    }
  },
  decorators: [
    (Story) => Story()
  ]
};

export default preview;
