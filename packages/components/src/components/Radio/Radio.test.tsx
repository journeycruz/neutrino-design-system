import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("supports grouped selection semantics", () => {
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

  it("supports disabled state", () => {
    render(<Radio disabled label="Comfortable" name="density" value="comfortable" />);
    expect(screen.getByLabelText("Comfortable")).toBeDisabled();
  });

  it("merges external aria-describedby with local hint", () => {
    render(<Radio aria-describedby="external-note" hint="Default option" label="Comfortable" name="density" value="comfortable" />);
    const radio = screen.getByLabelText("Comfortable");
    const describedBy = radio.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(describedBy).toContain("external-note");
    expect(describedBy.length).toBe(2);
  });
});
