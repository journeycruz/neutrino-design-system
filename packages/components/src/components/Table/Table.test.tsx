import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./Table";

const columns = [
  { key: "token", header: "Token" },
  { key: "value", header: "Value", align: "right" as const }
] as const;

const rows = [
  { token: "--ns-color-text-default", value: "#171b22" },
  { token: "--ns-color-border-default", value: "#d8dde5" }
];

describe("Table", () => {
  it("renders semantic table structure", () => {
    render(<Table caption="Token values" columns={columns} rows={rows} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader")).toHaveLength(2);
  });

  it("renders row data", () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText("--ns-color-text-default")).toBeInTheDocument();
    expect(screen.getByText("#d8dde5")).toBeInTheDocument();
  });
});
