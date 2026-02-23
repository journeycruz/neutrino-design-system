import {
  forwardRef,
  type AriaAttributes,
  type AriaRole,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from "react";
import "./Toast.css";

export type ToastVariant = "success" | "warning" | "error" | "info";
export type ToastTone = ToastVariant | "neutral";

export type ToastProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: ReactNode;
  tone?: ToastTone;
  variant?: ToastVariant;
  live?: AriaAttributes["aria-live"];
  onDismiss?: () => void;
  dismissLabel?: string;
  dismissOnEscape?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const getDefaultLiveRegionPoliteness = (tone: ToastTone): NonNullable<AriaAttributes["aria-live"]> => {
  if (tone === "error" || tone === "warning") {
    return "assertive";
  }

  return "polite";
};

const getLiveRegionRole = (live: AriaAttributes["aria-live"]): AriaRole | undefined => {
  if (live === "off") {
    return undefined;
  }

  return live === "assertive" ? "alert" : "status";
};

const renderDescription = (description?: ReactNode) => {
  if (!description) {
    return null;
  }

  return <div className="ns-toast-description">{description}</div>;
};

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  {
    title,
    description,
    tone,
    variant,
    live,
    onDismiss,
    dismissLabel = "Dismiss notification",
    dismissOnEscape = true,
    action,
    className,
    onKeyDown,
    ...rest
  },
  ref
) {
  const resolvedTone = tone ?? variant ?? "info";
  const resolvedLive = live ?? getDefaultLiveRegionPoliteness(resolvedTone);
  const resolvedRole = getLiveRegionRole(resolvedLive);

  const classes = ["ns-toast", `ns-toast--${resolvedTone}`, className].filter(Boolean).join(" ");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Escape" && dismissOnEscape && onDismiss) {
      event.preventDefault();
      onDismiss();
    }
  };

  return (
    <div
      {...rest}
      aria-atomic="true"
      aria-live={resolvedLive}
      className={classes}
      data-tone={resolvedTone}
      onKeyDown={handleKeyDown}
      ref={ref}
      role={resolvedRole}
    >
      <div className="ns-toast-content">
        <p className="ns-toast-title">{title}</p>
        {renderDescription(description)}
      </div>

      {action || onDismiss ? (
        <div className="ns-toast-controls">
          {action ? (
            <button className="ns-toast-action" onClick={action.onClick} type="button">
              {action.label}
            </button>
          ) : null}
          {onDismiss ? (
            <button aria-label={dismissLabel} className="ns-toast-dismiss" onClick={onDismiss} type="button">
              x
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
