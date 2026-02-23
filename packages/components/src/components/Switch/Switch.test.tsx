import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders switch semantics and default state label", () => {
    render(<Switch label="Email alerts" />);
    const toggle = screen.getByRole("switch", { name: "Email alerts Off" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles in uncontrolled mode with click", () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Email alerts" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: /Email alerts/i });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles in uncontrolled mode with keyboard", () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Email alerts" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: /Email alerts/i });

    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports controlled updates", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(<Switch checked={false} label="Email alerts" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: /Email alerts/i });

    fireEvent.click(toggle);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle).toHaveAttribute("aria-checked", "false");

    rerender(<Switch checked label="Email alerts" onCheckedChange={onCheckedChange} />);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("merges external aria-describedby with local hint", () => {
    render(
      <Switch
        aria-describedby="external-note"
        hint="Managed by organization policy"
        label="Email alerts"
      />
    );
    const toggle = screen.getByRole("switch", { name: /Email alerts/i });
    const describedBy = toggle.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(2);
  });

  it("supports disabled state", () => {
    const onCheckedChange = vi.fn();
    render(<Switch disabled label="Email alerts" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: /Email alerts/i });
    fireEvent.click(toggle);
    expect(toggle).toBeDisabled();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("updates accessible on/off labels", () => {
    const { rerender } = render(<Switch checked={false} label="Dark mode" offLabel="Disabled" onLabel="Enabled" />);
    expect(screen.getByRole("switch", { name: "Dark mode Disabled" })).toHaveAttribute("aria-checked", "false");

    rerender(<Switch checked label="Dark mode" offLabel="Disabled" onLabel="Enabled" />);
    expect(screen.getByRole("switch", { name: "Dark mode Enabled" })).toHaveAttribute("aria-checked", "true");
  });

  it("has no obvious axe violations", async () => {
    const { container } = render(<Switch hint="Changes apply to all alerts" label="Email alerts" />);
    const result = await runAxe(container);
    expect(result.violations).toHaveLength(0);
  });
});
