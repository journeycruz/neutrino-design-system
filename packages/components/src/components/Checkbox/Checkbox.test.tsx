import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("exposes accessible label and semantics", () => {
    render(<Checkbox label="Email notifications" name="notifications" />);
    const checkbox = screen.getByLabelText("Email notifications");
    expect(checkbox).toHaveAttribute("name", "notifications");
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("toggles with click and keyboard", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Email notifications" onChange={onChange} />);
    const checkbox = screen.getByLabelText("Email notifications");

    fireEvent.click(checkbox);
    fireEvent.keyDown(checkbox, { key: " " });

    expect(onChange).toHaveBeenCalled();
  });

  it("supports disabled state", () => {
    render(<Checkbox disabled label="Email notifications" />);
    expect(screen.getByLabelText("Email notifications")).toBeDisabled();
  });

  it("merges external aria-describedby with local hint", () => {
    render(<Checkbox aria-describedby="external-note" hint="Managed by policy" label="Email notifications" />);
    const checkbox = screen.getByLabelText("Email notifications");
    const describedBy = checkbox.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(2);
  });
});
