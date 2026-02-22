import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "../Checkbox/Checkbox";
import { Input } from "../Input/Input";
import { Radio } from "../Radio/Radio";
import { Select } from "../Select/Select";
import { Switch } from "../Switch/Switch";
import { FormField } from "./FormField";

const meta = {
  title: "Components/FormField",
  component: FormField,
  tags: ["autodocs"],
  args: {
    label: "Field",
    children: <input />
  }
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Valid: Story = {
  render: () => (
    <FormField hint="Choose a publishing state" label="Status">
      <Select
        label="Status"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" }
        ]}
      />
    </FormField>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole("combobox", { name: "Status" });
    await userEvent.selectOptions(select, "published");
    await expect(select).toHaveValue("published");
  }
};

export const Invalid: Story = {
  render: () => (
    <FormField error="Enable notifications before continuing" hint="Required for critical alerts" label="Alerts">
      <Switch label="Email alerts" />
    </FormField>
  )
};

export const HelperOnly: Story = {
  render: () => (
    <FormField hint="These updates are sent weekly" label="Newsletter">
      <Checkbox label="Weekly updates" />
    </FormField>
  )
};

export const NativeTextarea: Story = {
  render: () => (
    <FormField hint="Share enough detail for review" label="Change notes">
      {(props) => <textarea {...props} rows={4} />}
    </FormField>
  )
};

export const ComposedInput: Story = {
  render: () => (
    <FormField error="Field-level validation failed" hint="Field-level guidance" label="Username">
      <Input hint="Control-level helper" label="Username" />
    </FormField>
  )
};

export const ComposedSelect: Story = {
  render: () => (
    <FormField error="Field-level validation failed" hint="Field-level guidance" label="Status">
      <Select
        hint="Control-level helper"
        label="Status"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" }
        ]}
      />
    </FormField>
  )
};

export const ComposedCheckbox: Story = {
  render: () => (
    <FormField error="Field-level validation failed" hint="Field-level guidance" label="Newsletter">
      <Checkbox hint="Control-level helper" label="Newsletter" />
    </FormField>
  )
};

export const ComposedRadio: Story = {
  render: () => (
    <FormField error="Field-level validation failed" hint="Field-level guidance" label="Density">
      <Radio hint="Control-level helper" label="Density" name="density-story" value="compact" />
    </FormField>
  )
};
