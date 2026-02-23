import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./Radio";

describe("Radio", () => {
  it("supports backward-compatible grouped selection with native fieldset", () => {
    render(
      <fieldset>
        <legend>Density</legend>
        <Radio defaultChecked label="Comfortable" name="density" value="comfortable" />
        <Radio label="Compact" name="density" value="compact" />
      </fieldset>
    );

    const comfortable = screen.getByLabelText("Comfortable");
    const compact = screen.getByLabelText("Compact");

    expect(comfortable).toBeChecked();
    expect(compact).not.toBeChecked();

    fireEvent.click(compact);
    expect(compact).toBeChecked();
    expect(comfortable).not.toBeChecked();
  });

  it("supports grouped selection semantics", () => {
    const onValueChange = vi.fn();

    render(
      <RadioGroup defaultValue="comfortable" legend="Density" name="density" onValueChange={onValueChange}>
        <Radio label="Comfortable" value="comfortable" />
        <Radio label="Compact" value="compact" />
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup", { name: "Density" })).toBeInTheDocument();

    const comfortable = screen.getByLabelText("Comfortable");
    const compact = screen.getByLabelText("Compact");

    expect(comfortable).toBeChecked();
    expect(compact).not.toBeChecked();

    fireEvent.click(compact);
    expect(compact).toBeChecked();
    expect(comfortable).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("compact", expect.any(Object));
  });

  it("moves checked state with arrow keys in a radio group", () => {
    render(
      <RadioGroup defaultValue="comfortable" legend="Density" name="density-keyboard">
        <Radio label="Comfortable" value="comfortable" />
        <Radio label="Compact" value="compact" />
        <Radio disabled label="Dense" value="dense" />
      </RadioGroup>
    );

    const comfortable = screen.getByLabelText("Comfortable");
    const compact = screen.getByLabelText("Compact");

    comfortable.focus();
    fireEvent.keyDown(comfortable, { key: "ArrowDown" });

    expect(compact).toBeChecked();
    expect(compact).toHaveFocus();
  });

  it("supports disabled state", () => {
    render(<Radio disabled label="Comfortable" name="density" value="comfortable" />);
    expect(screen.getByLabelText("Comfortable")).toBeDisabled();
  });

  it("applies invalid styles and a11y state when group has an error", () => {
    render(
      <RadioGroup error="Selection is required" legend="Density" name="density-invalid">
        <Radio label="Comfortable" value="comfortable" />
      </RadioGroup>
    );

    expect(screen.getByText("Selection is required")).toHaveAttribute("role", "alert");
    expect(screen.getByLabelText("Comfortable")).toHaveAttribute("aria-invalid", "true");
  });

  it("merges external aria-describedby with local hint", () => {
    render(<Radio aria-describedby="external-note" hint="Default option" label="Comfortable" name="density" value="comfortable" />);
    const radio = screen.getByLabelText("Comfortable");
    const describedBy = radio.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(2);
  });
});
