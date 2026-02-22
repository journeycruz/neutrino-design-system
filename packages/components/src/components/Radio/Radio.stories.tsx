import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Radio } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  args: {
    label: "Comfortable",
    name: "density",
    value: "comfortable"
  }
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Group: Story = {
  render: () => (
    <fieldset>
      <legend>Density</legend>
      <Radio defaultChecked label="Comfortable" name="density" value="comfortable" />
      <Radio label="Compact" name="density" value="compact" />
    </fieldset>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const compact = canvas.getByLabelText("Compact");
    await userEvent.click(compact);
    await expect(compact).toBeChecked();
  }
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("comfortable");
    return (
      <fieldset>
        <legend>Density</legend>
        <Radio
          checked={value === "comfortable"}
          label="Comfortable"
          name="density-controlled"
          onChange={() => setValue("comfortable")}
          value="comfortable"
        />
        <Radio
          checked={value === "compact"}
          label="Compact"
          name="density-controlled"
          onChange={() => setValue("compact")}
          value="compact"
        />
      </fieldset>
    );
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};
