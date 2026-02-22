import { type PropsWithChildren } from "react";
import "../styles/theme.css";

export type DesignSystemProviderProps = PropsWithChildren<{
  className?: string;
}>;

export const DesignSystemProvider = ({ children, className }: DesignSystemProviderProps) => {
  const resolvedClassName = className ? `ns-root ${className}` : "ns-root";

  return <div className={resolvedClassName}>{children}</div>;
};
