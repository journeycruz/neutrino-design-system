import type { ReactNode } from "react";
import "./Toast.css";

export type ToastVariant = "success" | "warning" | "error" | "info";

export type ToastProps = {
  title: string;
  description?: ReactNode;
  variant?: ToastVariant;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const Toast = ({ title, description, variant = "info", onDismiss, action }: ToastProps) => {
  const role = variant === "error" || variant === "warning" ? "alert" : "status";

  return (
    <div className={["ns-toast", `ns-toast--${variant}`].join(" ")} role={role}>
      <div className="ns-toast-content">
        <p className="ns-toast-title">{title}</p>
        {description ? <p className="ns-toast-description">{description}</p> : null}
      </div>
      {action ? (
        <button className="ns-toast-action" onClick={action.onClick} type="button">
          {action.label}
        </button>
      ) : null}
      {onDismiss ? (
        <button aria-label="Dismiss notification" className="ns-toast-dismiss" onClick={onDismiss} type="button">
          x
        </button>
      ) : null}
    </div>
  );
};
