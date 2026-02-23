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
    <FormField helpText="Choose a publishing state" label="Status" required>
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
    <FormField errorText="Enable notifications before continuing" helpText="Required for critical alerts" label="Alerts" required>
      <Switch label="Email alerts" />
    </FormField>
  )
};

export const HelperOnly: Story = {
  render: () => (
    <FormField helpText="These updates are sent weekly" label="Newsletter">
      <Checkbox label="Weekly updates" />
    </FormField>
  )
};

export const NativeTextarea: Story = {
  render: () => (
    <FormField helpText="Share enough detail for review" label="Change notes">
      {(props) => <textarea {...props} rows={4} />}
    </FormField>
  )
};

export const ComposedInput: Story = {
  render: () => (
    <FormField errorText="Field-level validation failed" helpText="Field-level guidance" label="Username" required>
      <Input hint="Control-level helper" label="Username" />
    </FormField>
  )
};

export const ComposedSelect: Story = {
  render: () => (
    <FormField errorText="Field-level validation failed" helpText="Field-level guidance" label="Status" required>
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
    <FormField errorText="Field-level validation failed" helpText="Field-level guidance" label="Newsletter" required>
      <Checkbox hint="Control-level helper" label="Newsletter" />
    </FormField>
  )
};

export const ComposedRadio: Story = {
  render: () => (
    <FormField errorText="Field-level validation failed" helpText="Field-level guidance" label="Density" required>
      <Radio hint="Control-level helper" label="Density" name="density-story" value="compact" />
    </FormField>
  )
};

export const BackwardCompatibility: Story = {
  render: () => (
    <FormField error="Legacy error prop still works" hint="Legacy hint prop still works" label="Legacy API">
      <input />
    </FormField>
  )
};
