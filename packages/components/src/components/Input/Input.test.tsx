import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("associates label and input", () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("name", "email");
  });

  it("wires hint and error to aria-describedby", () => {
    render(<Input label="Username" hint="Use your work handle" error="Required" />);
    const input = screen.getByLabelText("Username");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const errorMessage = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", errorMessage.id);
    expect(describedBy.length).toBe(2);
    expect(errorMessage).toHaveTextContent("Required");
  });

  it("merges external aria-describedby with local hint and error", () => {
    render(<Input aria-describedby="external-note" label="Username" hint="Use your work handle" error="Required" />);
    const input = screen.getByLabelText("Username");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(3);
  });

  it("applies visual size classes and preserves numeric html size", () => {
    const { rerender } = render(<Input label="Search" size="lg" />);
    const input = screen.getByLabelText("Search");

    expect(input).toHaveClass("ns-input--lg");

    rerender(<Input label="Search" size={24} />);
    const resizedInput = screen.getByLabelText("Search");
    expect(resizedInput).toHaveAttribute("size", "24");
    expect(resizedInput).toHaveClass("ns-input--md");
  });

  it("supports composable prefix and suffix content", () => {
    render(<Input label="Website" prefix="https://" suffix=".com" />);

    expect(screen.getByText("https://")).toBeVisible();
    expect(screen.getByText(".com")).toBeVisible();
  });

  it("applies invalid, disabled, and readonly states", () => {
    const { rerender } = render(<Input label="Handle" state="invalid" />);
    let input = screen.getByLabelText("Handle");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.parentElement).toHaveClass("ns-input-control--invalid");

    rerender(<Input disabled label="Handle" />);
    input = screen.getByLabelText("Handle");
    expect(input).toBeDisabled();
    expect(input.parentElement).toHaveClass("ns-input-control--disabled");

    rerender(<Input label="Handle" readOnly />);
    input = screen.getByLabelText("Handle");
    expect(input).toHaveAttribute("aria-readonly", "true");
    expect(input).toHaveAttribute("readonly");
    expect(input.parentElement).toHaveClass("ns-input-control--readonly");
  });
});
