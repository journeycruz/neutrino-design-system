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
    tone: "success",
    onDismiss: fn()
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "error"]
    },
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"]
    },
    live: {
      control: "select",
      options: ["polite", "assertive", "off"]
    }
  }
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Success: Story = {};

export const Warning: Story = {
  args: {
    title: "Token drift detected",
    description: "Review semantic aliases before release.",
    tone: "warning"
  }
};

export const Error: Story = {
  args: {
    title: "Build failed",
    description: "Fix CI checks and retry.",
    tone: "error"
  }
};

export const Neutral: Story = {
  args: {
    title: "Maintenance complete",
    description: "No further action is required.",
    tone: "neutral"
  }
};

export const Actionable: Story = {
  args: {
    title: "Update available",
    description: "Apply migration notes to continue.",
    tone: "info",
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

export const LegacyVariantCompatibility: Story = {
  args: {
    title: "Legacy API",
    description: "Variant still maps to semantic toast tones.",
    tone: undefined,
    variant: "success"
  }
};
