import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("exposes accessible label and semantics", () => {
    render(<Checkbox label="Email notifications" name="notifications" />);
    const checkbox = screen.getByLabelText("Email notifications");
    expect(checkbox).toHaveAttribute("name", "notifications");
    expect(checkbox).toHaveAttribute("type", "checkbox");
  });

  it("toggles with click, space, and enter keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox label="Email notifications" onChange={onChange} />);
    const checkbox = screen.getByLabelText("Email notifications");

    await user.click(checkbox);
    checkbox.focus();
    await user.keyboard(" ");
    await user.keyboard("{Enter}");

    expect(onChange).toHaveBeenCalledTimes(3);
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

  it("supports indeterminate state semantics", () => {
    render(<Checkbox indeterminate label="Email notifications" />);
    const checkbox = screen.getByLabelText("Email notifications") as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
  });

  it("merges external aria-labelledby with internal label", () => {
    render(<Checkbox aria-labelledby="external-label" label="Email notifications" />);
    const checkbox = screen.getByRole("checkbox", { name: "Email notifications" });
    const labelledBy = checkbox.getAttribute("aria-labelledby")?.split(" ") ?? [];

    expect(labelledBy).toContain("external-label");
    expect(labelledBy.some((value) => value.endsWith("-label"))).toBe(true);
  });
});
