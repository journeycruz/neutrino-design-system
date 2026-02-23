import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const LeftIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16">
    <path d="M6.2 3.2a.75.75 0 1 1 1.1-1l5 5.5a.75.75 0 0 1 0 1L7.3 14.2a.75.75 0 1 1-1.1-1L10.7 8 6.2 3.2Z" />
  </svg>
);

const RightIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 16 16">
    <path d="M9.8 12.8a.75.75 0 1 1-1.1 1l-5-5.5a.75.75 0 0 1 0-1l5-5.5a.75.75 0 0 1 1.1 1L5.3 8l4.5 4.8Z" />
  </svg>
);

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Continue",
    variant: "primary",
    size: "md"
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["primary", "secondary"]
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"]
    }
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

export const WithIcons: Story = {
  args: {
    children: "Review",
    startIcon: <LeftIcon />,
    endIcon: <RightIcon />
  }
};

export const Loading: Story = {
  args: {
    children: "Submitting",
    loading: true,
    loadingText: "Submitting request"
  }
};

export const IconOnly: Story = {
  args: {
    "aria-label": "Open details",
    startIcon: <LeftIcon />,
    size: "sm"
  }
};
