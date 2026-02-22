import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Toast } from "./Toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  tags: ["autodocs"],
  args: {
    title: "Changes saved",
    description: "The design token set is now published.",
    variant: "success",
    onDismiss: fn()
  }
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Warning: Story = {
  args: {
    title: "Token drift detected",
    description: "Review semantic aliases before release.",
    variant: "warning"
  }
};

export const Error: Story = {
  args: {
    title: "Build failed",
    description: "Fix CI checks and retry.",
    variant: "error"
  }
};

export const Actionable: Story = {
  args: {
    title: "Update available",
    description: "Apply migration notes to continue.",
    variant: "info",
    action: {
      label: "Review",
      onClick: fn()
    }
  },
  play: async ({ args, canvasElement }: { args: { action?: { onClick: () => void }; onDismiss?: () => void }; canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Review" }));
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss notification" }));
    await expect(args.action?.onClick).toHaveBeenCalled();
    await expect(args.onDismiss).toHaveBeenCalled();
  }
};
