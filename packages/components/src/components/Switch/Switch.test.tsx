import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("renders switch semantics", () => {
    render(<Switch label="Email alerts" />);
    expect(screen.getByRole("switch", { name: "Email alerts" })).toHaveAttribute("aria-checked", "false");
  });

  it("toggles with click and keyboard", () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Email alerts" onCheckedChange={onCheckedChange} />);
    const toggle = screen.getByRole("switch", { name: "Email alerts" });

    fireEvent.click(toggle);
    fireEvent.keyDown(toggle, { key: "Enter" });

    expect(onCheckedChange).toHaveBeenCalledTimes(2);
  });

  it("supports disabled state", () => {
    render(<Switch disabled label="Email alerts" />);
    expect(screen.getByRole("switch", { name: "Email alerts" })).toBeDisabled();
  });
});
