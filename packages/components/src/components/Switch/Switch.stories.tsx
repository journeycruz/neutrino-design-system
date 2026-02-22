import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    label: "Email alerts"
  }
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Uncontrolled: Story = {
  args: {
    defaultChecked: true
  }
};

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Switch checked={checked} label="Email alerts" onCheckedChange={setChecked} />;
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: "Email alerts" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultChecked: true
  }
};
