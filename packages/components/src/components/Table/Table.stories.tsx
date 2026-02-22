import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./Table";

type TokenRow = {
  token: string;
  value: string;
  usage: string;
};

const columns = [
  { key: "token", header: "Token" },
  { key: "value", header: "Value" },
  { key: "usage", header: "Usage" }
] as const;

const rows: TokenRow[] = [
  { token: "--ns-color-text-default", value: "#171b22", usage: "Primary copy" },
  { token: "--ns-color-border-default", value: "#d8dde5", usage: "Input borders" },
  { token: "--ns-component-button-background-default", value: "#1f6fff", usage: "Primary actions" }
];

const meta = {
  title: "Components/Table",
  component: Table<TokenRow>,
  tags: ["autodocs"],
  args: {
    caption: "Token registry",
    columns,
    rows
  }
} satisfies Meta<typeof Table<TokenRow>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Striped: Story = {
  args: {
    striped: true
  }
};

export const Dense: Story = {
  args: {
    dense: true
  }
};
