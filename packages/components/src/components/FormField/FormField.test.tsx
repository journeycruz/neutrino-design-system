import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox } from "../Checkbox/Checkbox";
import { Input } from "../Input/Input";
import { Radio } from "../Radio/Radio";
import { Select } from "../Select/Select";
import { Switch } from "../Switch/Switch";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("wires label and generated id to native controls", () => {
    render(
      <FormField label="Project name">
        <input />
      </FormField>
    );

    const input = screen.getByLabelText("Project name");
    expect(input).toHaveAttribute("id");
  });

  it("keeps a provided control id aligned with label htmlFor", () => {
    render(
      <FormField label="Bio">
        <textarea id="bio-field" />
      </FormField>
    );

    const textarea = screen.getByLabelText("Bio");
    expect(textarea).toHaveAttribute("id", "bio-field");
  });

  it("merges existing aria-describedby values with generated hint and error ids", () => {
    render(
      <FormField error="Required" hint="Include a summary" label="Summary">
        <textarea aria-describedby="external-help" />
      </FormField>
    );

    const textarea = screen.getByRole("textbox", { name: "Summary" });
    const describedBy = textarea.getAttribute("aria-describedby")?.split(" ") ?? [];
    expect(describedBy).toContain("external-help");
    expect(describedBy.length).toBe(3);
  });

  it("applies describedBy and invalid state to Select", () => {
    render(
      <FormField error="Required" hint="Choose one" label="Status">
        <Select
          label="Status"
          options={[
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" }
          ]}
        />
      </FormField>
    );

    const select = screen.getByRole("combobox", { name: "Status" });
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select.getAttribute("aria-describedby")?.split(" ").length).toBe(2);
  });

  it("composes with Input hint semantics without dropping field-level metadata", () => {
    render(
      <FormField error="Field level error" hint="Field level hint" label="Username">
        <Input hint="Control hint" label="Username" />
      </FormField>
    );

    const input = screen.getByRole("textbox", { name: "Username" });
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(describedBy.length).toBe(3);
  });

  it("composes with Select hint semantics without dropping field-level metadata", () => {
    render(
      <FormField error="Field level error" hint="Field level hint" label="Status">
        <Select
          hint="Control hint"
          label="Status"
          options={[
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" }
          ]}
        />
      </FormField>
    );

    const select = screen.getByRole("combobox", { name: "Status" });
    const describedBy = select.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(describedBy.length).toBe(3);
  });

  it("integrates with Checkbox and Radio controls", () => {
    render(
      <>
        <FormField error="Required" hint="Pick one" label="Newsletter">
          <Checkbox label="Weekly updates" />
        </FormField>
        <FormField error="Required" hint="Pick one" label="Density">
          <Radio label="Compact" name="density" value="compact" />
        </FormField>
      </>
    );

    const checkbox = screen.getByRole("checkbox", { name: "Newsletter" });
    const radio = screen.getByRole("radio", { name: "Density" });
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(checkbox.getAttribute("aria-describedby")?.split(" ").length).toBe(2);
    expect(radio.getAttribute("aria-describedby")?.split(" ").length).toBe(2);
  });

  it("preserves grouped control hints while adding field-level metadata", () => {
    render(
      <>
        <FormField error="Required" hint="Pick one" label="Newsletter">
          <Checkbox hint="Control hint" label="Newsletter" />
        </FormField>
        <FormField error="Required" hint="Pick one" label="Density">
          <Radio hint="Control hint" label="Density" name="density-composed" value="compact" />
        </FormField>
      </>
    );

    const checkbox = screen.getByRole("checkbox", { name: "Newsletter" });
    const radio = screen.getByRole("radio", { name: "Density" });

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(checkbox.getAttribute("aria-describedby")?.split(" ").length).toBe(3);
    expect(radio.getAttribute("aria-describedby")?.split(" ").length).toBe(3);
  });

  it("integrates with Switch and applies invalid semantics", () => {
    render(
      <FormField error="Required" hint="Enable it" label="Email alerts">
        <Switch label="Email alerts" />
      </FormField>
    );

    const toggle = screen.getByRole("switch", { name: "Email alerts" });
    expect(toggle).toHaveAttribute("aria-invalid", "true");
    expect(toggle.getAttribute("aria-describedby")?.split(" ").length).toBe(2);
  });

  it("applies generated accessibility props through render-function children", () => {
    render(
      <FormField hint="Optional" label="Notes">
        {(props) => <textarea {...props} />}
      </FormField>
    );

    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(textarea).toHaveAttribute("id");
    expect(textarea).toHaveAttribute("aria-describedby");
    expect(textarea).toHaveAttribute("aria-labelledby");
  });
});
