import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Continue",
    variant: "primary"
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Continue" });
    await userEvent.click(button);
    await expect(button).toBeVisible();
  }
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Cancel"
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "color-contrast",
            enabled: true
          }
        ]
      }
    }
  }
};
