import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./Select";

const options = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" }
];

describe("Select", () => {
  it("associates label and select", () => {
    render(<Select label="Status" name="status" options={options} />);
    expect(screen.getByLabelText("Status")).toHaveAttribute("name", "status");
  });

  it("fires onChange and supports controlled value", () => {
    const onChange = vi.fn();
    render(<Select label="Status" onChange={onChange} options={options} value="draft" />);
    const select = screen.getByLabelText("Status");
    fireEvent.change(select, { target: { value: "published" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports disabled state", () => {
    render(<Select disabled label="Status" options={options} />);
    expect(screen.getByLabelText("Status")).toBeDisabled();
  });

  it("renders a placeholder option when provided", () => {
    render(<Select defaultValue="" label="Status" options={options} placeholder="Select status" />);

    const select = screen.getByLabelText("Status");
    expect(select).toHaveValue("");
    expect(select).toHaveClass("ns-select--placeholder");

    fireEvent.change(select, { target: { value: "published" } });
    expect(select).toHaveValue("published");
    expect(select).not.toHaveClass("ns-select--placeholder");
  });

  it("links error text through aria-errormessage", () => {
    render(<Select error="Status is required" label="Status" options={options} />);

    const select = screen.getByLabelText("Status");
    const error = screen.getByText("Status is required");

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-errormessage", error.id);
  });

  it("forwards keyboard events for external handlers", () => {
    const onKeyDown = vi.fn();
    render(<Select label="Status" onKeyDown={onKeyDown} options={options} />);

    const select = screen.getByLabelText("Status");
    fireEvent.keyDown(select, { key: "ArrowDown" });

    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("supports Home and End keyboard navigation", () => {
    render(<Select defaultValue="published" label="Status" options={options} />);

    const select = screen.getByLabelText("Status");
    fireEvent.keyDown(select, { key: "Home" });
    expect(select).toHaveValue("draft");

    fireEvent.keyDown(select, { key: "End" });
    expect(select).toHaveValue("archived");
  });

  it("merges external aria-describedby with local hint and error", () => {
    render(
      <Select aria-describedby="external-note" error="Required" hint="Pick one" label="Status" options={options} />
    );

    const select = screen.getByLabelText("Status");
    const describedBy = select.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(3);
  });
});
