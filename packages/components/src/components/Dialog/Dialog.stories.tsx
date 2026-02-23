import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "../Button/Button";
import { Dialog } from "./Dialog";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  args: {
    open: false,
    onOpenChange: () => {},
    title: "Archive project",
    description: "Archiving keeps history intact while removing the project from active views."
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: "aria-dialog-name",
            enabled: true
          }
        ]
      }
    }
  }
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog {...args} onOpenChange={setOpen} open={open}>
          Confirm to archive this project and notify collaborators.
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const openButton = canvas.getByRole("button", { name: "Open dialog" });
    await userEvent.click(openButton);

    const dialog = await canvas.findByRole("dialog", { name: "Archive project" });
    await waitFor(() => {
      expect(dialog).toHaveAttribute("data-state", "open");
      expect(dialog).toBeVisible();
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(canvas.queryByRole("dialog", { name: "Archive project" })).not.toBeInTheDocument();
    });
    await expect(openButton).toHaveFocus();
  }
};

export const Open: Story = {
  args: {
    open: true
  },
  render: (args) => (
    <Dialog {...args} onOpenChange={() => {}}>
      Confirm to archive this project and notify collaborators.
    </Dialog>
  )
};

export const CloseControls: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open protected dialog</Button>
        <Dialog {...args} closeOnBackdropClick={false} closeOnEscape={false} onOpenChange={setOpen} open={open}>
          This dialog ignores Escape and backdrop clicks.
          <div style={{ marginTop: "1rem" }}>
            <Button onClick={() => setOpen(false)} variant="secondary">
              Close from action
            </Button>
          </div>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const openButton = canvas.getByRole("button", { name: "Open protected dialog" });
    await userEvent.click(openButton);

    const dialog = await canvas.findByRole("dialog", { name: "Archive project" });
    await waitFor(() => {
      expect(dialog).toHaveAttribute("data-state", "open");
      expect(dialog).toBeVisible();
    });

    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("dialog", { name: "Archive project" })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Close from action" }));
    await waitFor(() => {
      expect(canvas.queryByRole("dialog", { name: "Archive project" })).not.toBeInTheDocument();
    });
  }
};

export const Nested: Story = {
  render: () => {
    const [outerOpen, setOuterOpen] = useState(false);
    const [innerOpen, setInnerOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOuterOpen(true)} variant="secondary">
          Open outer dialog
        </Button>
        <Dialog onOpenChange={setOuterOpen} open={outerOpen} title="Outer dialog">
          <p>Outer dialog content</p>
          <Button onClick={() => setInnerOpen(true)} variant="secondary">
            Open inner dialog
          </Button>
          <Dialog onOpenChange={setInnerOpen} open={innerOpen} title="Inner dialog">
            <p>Inner dialog content</p>
          </Dialog>
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const openOuterButton = canvas.getByRole("button", { name: "Open outer dialog" });
    await userEvent.click(openOuterButton);

    const outerDialog = await canvas.findByRole("dialog", { name: "Outer dialog" });
    await waitFor(() => {
      expect(outerDialog).toHaveAttribute("data-state", "open");
      expect(outerDialog).toBeVisible();
    });

    const openInnerButton = await canvas.findByRole("button", { name: "Open inner dialog" });
    await userEvent.click(openInnerButton);

    const innerDialog = await canvas.findByRole("dialog", { name: "Inner dialog" });
    await waitFor(() => {
      expect(innerDialog).toHaveAttribute("data-state", "open");
      expect(innerDialog).toBeVisible();
    });

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(canvas.queryByRole("dialog", { name: "Inner dialog" })).not.toBeInTheDocument();
    });
    await expect(openInnerButton).toHaveFocus();
  }
};

export const NestedStatic: Story = {
  render: () => {
    const [outerOpen, setOuterOpen] = useState(false);
    const [innerOpen, setInnerOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOuterOpen(true)} variant="secondary">
          Open outer dialog
        </Button>
        <Dialog onOpenChange={setOuterOpen} open={outerOpen} title="Outer dialog">
          <p>Outer dialog content</p>
          <Button onClick={() => setInnerOpen(true)} variant="secondary">
            Open inner dialog
          </Button>
          <Dialog onOpenChange={setInnerOpen} open={innerOpen} title="Inner dialog">
            <p>Inner dialog content</p>
          </Dialog>
        </Dialog>
      </>
    );
  }
};
