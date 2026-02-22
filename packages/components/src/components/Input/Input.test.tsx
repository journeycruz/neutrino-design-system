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
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")?.split(" ").length).toBe(2);
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("merges external aria-describedby with local hint and error", () => {
    render(<Input aria-describedby="external-note" label="Username" hint="Use your work handle" error="Required" />);
    const input = screen.getByLabelText("Username");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(3);
  });
});
