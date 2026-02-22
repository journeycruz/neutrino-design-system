import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Select } from "./Select";

const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "published", label: "Published" }
];

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    label: "Status",
    defaultValue: "draft",
    options
  }
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByLabelText("Status");
    await userEvent.selectOptions(select, "review");
    await expect(select).toHaveValue("review");
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const Invalid: Story = {
  args: {
    hint: "Select the publishing state.",
    error: "Status is required"
  }
};
