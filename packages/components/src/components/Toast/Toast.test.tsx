import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("renders toast content with polite live region defaults", () => {
    render(<Toast description="Changes have been saved" title="Saved" tone="success" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("status")).toHaveAttribute("aria-atomic", "true");
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("supports dismiss action", () => {
    const onDismiss = vi.fn();
    render(<Toast onDismiss={onDismiss} title="Network issue" variant="error" />);
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("uses alert role with assertive live region for warning and error tones", () => {
    const { rerender } = render(<Toast title="Warning" tone="warning" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");

    rerender(<Toast title="Error" tone="error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("dismisses on Escape when dismiss callback is provided", () => {
    const onDismiss = vi.fn();
    render(<Toast onDismiss={onDismiss} title="Network issue" tone="error" />);

    fireEvent.keyDown(screen.getByRole("alert"), { key: "Escape" });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("allows opting out of live announcements", () => {
    render(<Toast live="off" title="Silent toast" tone="neutral" />);

    const toast = screen.getByText("Silent toast").closest("div[aria-live='off']");
    expect(toast).toBeInTheDocument();
    expect(toast).not.toHaveAttribute("role");
  });

  it("keeps variant prop compatibility and supports tone override", () => {
    const { rerender } = render(<Toast title="Legacy success" variant="success" />);
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "success");

    rerender(<Toast title="Tone wins" tone="warning" variant="success" />);
    expect(screen.getByRole("alert")).toHaveAttribute("data-tone", "warning");
  });
});
