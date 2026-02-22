import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    label: "Email",
    placeholder: "name@company.com"
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Email");
    await userEvent.type(input, "alex@example.com");
    await expect(input).toHaveValue("alex@example.com");
  }
};

export const Invalid: Story = {
  args: {
    label: "Username",
    hint: "Use your work handle.",
    error: "Username is required"
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "aria-valid-attr-value",
            enabled: true
          }
        ]
      }
    }
  }
};
