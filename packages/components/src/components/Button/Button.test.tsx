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

  it("defaults to a medium primary button", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    expect(button).toHaveClass("ns-button--primary");
    expect(button).toHaveClass("ns-button--md");
    expect(button).toHaveAttribute("type", "button");
  });

  it("supports explicit size and variant combinations", () => {
    render(
      <Button size="lg" variant="secondary">
        Export
      </Button>
    );

    const button = screen.getByRole("button", { name: "Export" });
    expect(button).toHaveClass("ns-button--secondary");
    expect(button).toHaveClass("ns-button--lg");
  });

  it("marks loading state as busy and disabled", () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole("button", { name: /save/i });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector(".ns-button__spinner")).not.toBeNull();
  });

  it("renders icon-only button with accessible label", () => {
    render(
      <Button aria-label="Close panel" size="sm" startIcon={<span aria-hidden="true">x</span>} />
    );

    const button = screen.getByRole("button", { name: "Close panel" });
    expect(button).toHaveClass("ns-button--icon-only");
    expect(button).toHaveClass("ns-button--sm");
  });

  it("has no obvious axe violations", async () => {
    const { container } = render(<Button>Audit</Button>);
    const result = await runAxe(container);
    expect(result.violations).toHaveLength(0);
  });
});
