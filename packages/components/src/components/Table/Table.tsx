import type { ReactNode } from "react";
import "./Table.css";

export type TableAlign = "left" | "center" | "right";

export type TableColumn<Row extends Record<string, unknown>> = {
  key: keyof Row;
  header: string;
  align?: TableAlign;
  render?: (value: Row[keyof Row], row: Row) => ReactNode;
};

export type TableProps<Row extends Record<string, unknown>> = {
  caption?: string;
  columns: readonly TableColumn<Row>[];
  rows: Row[];
  striped?: boolean;
  dense?: boolean;
};

export const Table = <Row extends Record<string, unknown>>({
  caption,
  columns,
  rows,
  striped = false,
  dense = false
}: TableProps<Row>) => {
  return (
    <div className="ns-table-wrap">
      <table className={["ns-table", striped ? "ns-table--striped" : "", dense ? "ns-table--dense" : ""].filter(Boolean).join(" ")}>
        {caption ? <caption className="ns-table-caption">{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th className={`ns-table-cell ns-table-cell--${column.align ?? "left"}`} key={String(column.key)} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => {
                const value = row[column.key];
                return (
                  <td className={`ns-table-cell ns-table-cell--${column.align ?? "left"}`} key={String(column.key)}>
                    {column.render ? column.render(value, row) : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
