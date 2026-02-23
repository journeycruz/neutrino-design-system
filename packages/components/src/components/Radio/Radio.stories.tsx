import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Radio, RadioGroup } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: Radio,
  subcomponents: { RadioGroup },
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
    <RadioGroup defaultValue="comfortable" legend="Density" name="density">
      <Radio label="Comfortable" value="comfortable" />
      <Radio label="Compact" value="compact" />
    </RadioGroup>
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
      <RadioGroup legend="Density" name="density-controlled" onValueChange={(nextValue) => setValue(nextValue)} value={value}>
        <Radio label="Comfortable" value="comfortable" />
        <Radio label="Compact" value="compact" />
      </RadioGroup>
    );
  }
};

export const Disabled: Story = {
  args: {
    disabled: true
  }
};

export const HorizontalWithValidation: Story = {
  render: () => (
    <RadioGroup
      defaultValue="compact"
      error="Choose a layout density before continuing."
      hint="This setting changes spacing density for tables and forms."
      legend="Density"
      name="density-horizontal"
      orientation="horizontal"
    >
      <Radio label="Comfortable" value="comfortable" />
      <Radio label="Compact" value="compact" />
      <Radio label="Dense" value="dense" />
    </RadioGroup>
  )
};

export const KeyboardNavigation: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" legend="Density" name="density-keyboard">
      <Radio label="Comfortable" value="comfortable" />
      <Radio label="Compact" value="compact" />
      <Radio label="Dense" value="dense" />
    </RadioGroup>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const comfortable = canvas.getByLabelText("Comfortable");
    const compact = canvas.getByLabelText("Compact");

    comfortable.focus();
    await userEvent.keyboard("{ArrowDown}");

    await expect(compact).toBeChecked();
    await expect(compact).toHaveFocus();
  }
};
