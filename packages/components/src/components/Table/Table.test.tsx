import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Table } from "./Table";

const columns = [
  { key: "token", header: "Token", rowHeader: true },
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

  it("renders row headers for columns configured with rowHeader", () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByRole("rowheader", { name: "--ns-color-text-default" })).toBeInTheDocument();
  });

  it("shows loading state and marks table as busy", () => {
    render(<Table columns={columns} loading loadingLabel="Loading table rows" rows={rows} />);
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Loading table rows");
  });

  it("shows empty state message", () => {
    render(<Table columns={columns} emptyMessage="No results" rows={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No results");
  });

  it("keeps dense prop support for backward compatibility", () => {
    const { container } = render(<Table columns={columns} dense rows={rows} />);
    expect(container.querySelector(".ns-table")).toHaveClass("ns-table--density-compact");
  });
});
