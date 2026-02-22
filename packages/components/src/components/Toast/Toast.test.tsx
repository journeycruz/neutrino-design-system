import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("renders toast content", () => {
    render(<Toast description="Changes have been saved" title="Saved" variant="success" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("supports dismiss action", () => {
    const onDismiss = vi.fn();
    render(<Toast onDismiss={onDismiss} title="Network issue" variant="error" />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses alert role for warning and error variants", () => {
    const { rerender } = render(<Toast title="Warning" variant="warning" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    rerender(<Toast title="Error" variant="error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
