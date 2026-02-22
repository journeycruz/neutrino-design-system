import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    label: "Email notifications"
  }
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByLabelText("Email notifications");
    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  }
};

export const Checked: Story = {
  args: {
    defaultChecked: true
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: "This setting is managed by your admin"
  }
};
