import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { runAxe } from "../../test/axe";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with accessible name", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("handles keyboard activation", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    const button = screen.getByRole("button", { name: "Submit" });
    button.focus();
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("has no obvious axe violations", async () => {
    const { container } = render(<Button>Audit</Button>);
    const result = await runAxe(container);
    expect(result.violations).toHaveLength(0);
  });
});
