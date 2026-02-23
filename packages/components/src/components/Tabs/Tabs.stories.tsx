import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    items: [
      { id: "overview", label: "Overview", panel: "Overview content" },
      { id: "tokens", label: "Tokens", panel: "Token guidelines" },
      { id: "accessibility", label: "Accessibility", panel: "A11y checklist" }
    ]
  }
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const overviewTab = canvas.getByRole("tab", { name: "Overview" });
    overviewTab.focus();

    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("tab", { name: "Tokens" })).toHaveFocus();
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Token guidelines");

    await userEvent.keyboard("{End}");
    await expect(canvas.getByRole("tab", { name: "Accessibility" })).toHaveFocus();
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("A11y checklist");
  }
};

export const ManualActivation: Story = {
  args: {
    activationMode: "manual"
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const overviewTab = canvas.getByRole("tab", { name: "Overview" });

    overviewTab.focus();
    await userEvent.keyboard("{ArrowRight}");

    const tokensTab = canvas.getByRole("tab", { name: "Tokens" });
    await expect(tokensTab).toHaveFocus();
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Overview content");

    await userEvent.keyboard("{Enter}");
    await expect(tokensTab).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Token guidelines");
  }
};

export const Vertical: Story = {
  args: {
    orientation: "vertical"
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const overviewTab = canvas.getByRole("tab", { name: "Overview" });

    overviewTab.focus();
    await userEvent.keyboard("{ArrowDown}");

    const tokensTab = canvas.getByRole("tab", { name: "Tokens" });
    await expect(tokensTab).toHaveFocus();
    await expect(tokensTab).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  }
};

export const WithDisabled: Story = {
  args: {
    items: [
      { id: "overview", label: "Overview", panel: "Overview content" },
      { id: "tokens", label: "Tokens", panel: "Token guidelines", disabled: true },
      { id: "accessibility", label: "Accessibility", panel: "A11y checklist" }
    ]
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const overviewTab = canvas.getByRole("tab", { name: "Overview" });
    const tokensTab = canvas.getByRole("tab", { name: "Tokens" });
    const accessibilityTab = canvas.getByRole("tab", { name: "Accessibility" });

    await expect(tokensTab).toBeDisabled();
    overviewTab.focus();
    await userEvent.keyboard("{ArrowRight}");

    await expect(accessibilityTab).toHaveFocus();
    await expect(accessibilityTab).toHaveAttribute("aria-selected", "true");
  }
};
