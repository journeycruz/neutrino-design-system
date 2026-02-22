import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Tabs } from "./Tabs";

const items = [
  { id: "overview", label: "Overview", panel: "Overview panel" },
  { id: "settings", label: "Settings", panel: "Settings panel" },
  { id: "usage", label: "Usage", panel: "Usage panel" }
];

const itemsWithDisabled = [
  { id: "overview", label: "Overview", panel: "Overview panel" },
  { id: "settings", label: "Settings", panel: "Settings panel", disabled: true },
  { id: "usage", label: "Usage", panel: "Usage panel" }
];

describe("Tabs", () => {
  it("renders tablist and active tabpanel", () => {
    render(<Tabs items={items} />);
    expect(screen.getByRole("tablist", { name: "Tabs" })).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview panel");
  });

  it("supports keyboard navigation", () => {
    render(<Tabs items={items} />);
    const firstTab = screen.getByRole("tab", { name: "Overview" });
    firstTab.focus();
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveAttribute("aria-selected", "true");
  });

  it("uses roving tabindex and supports Home/End", () => {
    render(<Tabs items={items} />);

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    const settingsTab = screen.getByRole("tab", { name: "Settings" });
    const usageTab = screen.getByRole("tab", { name: "Usage" });
    const tablist = screen.getByRole("tablist");

    expect(overviewTab).toHaveAttribute("tabindex", "0");
    expect(settingsTab).toHaveAttribute("tabindex", "-1");
    expect(usageTab).toHaveAttribute("tabindex", "-1");

    overviewTab.focus();
    fireEvent.keyDown(tablist, { key: "End" });
    expect(usageTab).toHaveFocus();
    expect(usageTab).toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(tablist, { key: "Home" });
    expect(overviewTab).toHaveFocus();
    expect(overviewTab).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled tabs during keyboard navigation", () => {
    render(<Tabs items={itemsWithDisabled} />);

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    const settingsTab = screen.getByRole("tab", { name: "Settings" });
    const usageTab = screen.getByRole("tab", { name: "Usage" });
    const tablist = screen.getByRole("tablist");

    expect(settingsTab).toBeDisabled();

    overviewTab.focus();
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(usageTab).toHaveFocus();
    expect(usageTab).toHaveAttribute("aria-selected", "true");
  });
});
