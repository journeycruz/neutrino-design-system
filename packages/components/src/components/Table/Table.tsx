import type { Key, ReactNode, TableHTMLAttributes } from "react";
import "./Table.css";

export type TableAlign = "left" | "center" | "right";
export type TableDensity = "compact" | "regular" | "comfortable";

export type TableColumn<Row extends Record<string, unknown>> = {
  key: keyof Row;
  header: ReactNode;
  align?: TableAlign;
  headerAlign?: TableAlign;
  headerClassName?: string;
  cellClassName?: string;
  rowHeader?: boolean;
  render?: (value: Row[keyof Row], row: Row, rowIndex: number) => ReactNode;
};

export type TableProps<Row extends Record<string, unknown>> = Omit<TableHTMLAttributes<HTMLTableElement>, "children"> & {
  caption?: string;
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  striped?: boolean;
  density?: TableDensity;
  dense?: boolean;
  rowKey?: keyof Row | ((row: Row, rowIndex: number) => Key);
  emptyMessage?: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  containerClassName?: string;
};

export const Table = <Row extends Record<string, unknown>>({
  caption,
  columns,
  rows,
  striped = false,
  density,
  dense = false,
  rowKey,
  emptyMessage = "No records to display",
  loading = false,
  loadingLabel = "Loading data",
  className,
  containerClassName,
  ...restTableProps
}: TableProps<Row>) => {
  const resolvedDensity = density ?? (dense ? "compact" : "regular");
  const hasRows = rows.length > 0;
  const bodyState = loading ? "loading" : hasRows ? "ready" : "empty";

  const getRowKey = (row: Row, rowIndex: number): Key => {
    if (typeof rowKey === "function") {
      return rowKey(row, rowIndex);
    }

    if (typeof rowKey === "string") {
      const value = row[rowKey];
      if (typeof value === "string" || typeof value === "number") {
        return value;
      }
    }

    return rowIndex;
  };

  const tableClasses = [
    "ns-table",
    striped ? "ns-table--striped" : "",
    dense ? "ns-table--dense" : "",
    `ns-table--density-${resolvedDensity}`,
    `ns-table--state-${bodyState}`,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={["ns-table-wrap", containerClassName].filter(Boolean).join(" ")}>
      <table aria-busy={loading || undefined} className={tableClasses} {...restTableProps}>
        {caption ? <caption className="ns-table-caption">{caption}</caption> : null}
        <thead className="ns-table-head">
          <tr>
            {columns.map((column) => (
              <th
                className={[
                  "ns-table-cell",
                  "ns-table-head-cell",
                  `ns-table-cell--${column.headerAlign ?? column.align ?? "left"}`,
                  column.headerClassName
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={String(column.key)}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="ns-table-body">
          {loading || !hasRows ? (
            <tr className="ns-table-state-row">
              <td className="ns-table-cell ns-table-state-cell" colSpan={Math.max(columns.length, 1)}>
                <span aria-live="polite" role="status">
                  {loading ? loadingLabel : emptyMessage}
                </span>
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={getRowKey(row, rowIndex)}>
                {columns.map((column) => {
                  const value = row[column.key];
                  const cellClasses = [
                    "ns-table-cell",
                    `ns-table-cell--${column.align ?? "left"}`,
                    column.cellClassName
                  ]
                    .filter(Boolean)
                    .join(" ");

                  if (column.rowHeader) {
                    return (
                      <th className={[cellClasses, "ns-table-row-header"].join(" ")} key={String(column.key)} scope="row">
                        {column.render ? column.render(value, row, rowIndex) : String(value ?? "")}
                      </th>
                    );
                  }

                  return (
                    <td className={cellClasses} key={String(column.key)}>
                      {column.render ? column.render(value, row, rowIndex) : String(value ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
