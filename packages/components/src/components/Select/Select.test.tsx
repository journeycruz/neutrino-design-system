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
