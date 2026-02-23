import { useState } from "react";
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders as a dialog with accessible title", () => {
    render(
      <Dialog onOpenChange={() => {}} open title="Delete item">
        Body
      </Dialog>
    );

    expect(screen.getByRole("dialog", { name: "Delete item" })).toBeInTheDocument();
  });

  it("wires an accessible description when provided", () => {
    render(
      <Dialog description="This cannot be undone." onOpenChange={() => {}} open title="Delete item">
        Body
      </Dialog>
    );

    const dialog = screen.getByRole("dialog", { name: "Delete item" });
    const description = screen.getByText("This cannot be undone.");

    expect(dialog).toHaveAttribute("aria-describedby", description.id);
  });

  it("closes on Escape", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange} open title="Settings">
        Body
      </Dialog>
    );

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on Escape when disabled", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog closeOnEscape={false} onOpenChange={onOpenChange} open title="Settings">
        Body
      </Dialog>
    );

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("closes on overlay click", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange} open title="Settings">
        Body
      </Dialog>
    );

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not close on overlay click when disabled", () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog closeOnBackdropClick={false} onOpenChange={onOpenChange} open title="Settings">
        Body
      </Dialog>
    );

    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("traps focus while open", () => {
    render(
      <Dialog onOpenChange={() => {}} open title="Trap focus">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Dialog>
    );

    const secondButton = screen.getByRole("button", { name: "Second" });
    const closeButton = screen.getByRole("button", { name: "Close dialog" });

    closeButton.focus();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(secondButton);

    secondButton.focus();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);
  });

  it("restores trigger focus after close", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Open dialog";
    document.body.append(trigger);
    trigger.focus();

    const { rerender } = render(
      <Dialog onOpenChange={() => {}} open title="Settings">
        Body
      </Dialog>
    );

    rerender(
      <Dialog onOpenChange={() => {}} open={false} title="Settings">
        Body
      </Dialog>
    );

    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
    trigger.remove();
  });

  it("restores focus to outer trigger when nested dialog closes", async () => {
    const NestedDialogHarness = () => {
      const [outerOpen, setOuterOpen] = useState(false);
      const [innerOpen, setInnerOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOuterOpen(true)} type="button">
            Open outer dialog
          </button>
          <Dialog onOpenChange={setOuterOpen} open={outerOpen} title="Outer dialog">
            <button onClick={() => setInnerOpen(true)} type="button">
              Open inner dialog
            </button>
            <Dialog onOpenChange={setInnerOpen} open={innerOpen} title="Inner dialog">
              Inner body
            </Dialog>
          </Dialog>
        </>
      );
    };

    render(<NestedDialogHarness />);

    fireEvent.click(screen.getByRole("button", { name: "Open outer dialog" }));
    const openInnerButton = screen.getByRole("button", { name: "Open inner dialog" });
    openInnerButton.focus();
    fireEvent.click(openInnerButton);

    const dialogs = screen.getAllByRole("dialog");
    const innerDialog = dialogs[dialogs.length - 1];

    fireEvent.keyDown(innerDialog, { key: "Escape" });

    await waitForElementToBeRemoved(() => screen.queryByRole("dialog", { name: "Inner dialog" }));
    expect(openInnerButton).toHaveFocus();
  });
});
