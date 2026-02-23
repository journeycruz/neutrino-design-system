import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  loadingText?: string;
  loadingIndicator?: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    startIcon,
    endIcon,
    loading = false,
    loadingText = "Loading",
    loadingIndicator,
    className,
    type = "button",
    disabled,
    "aria-busy": ariaBusy,
    ...rest
  },
  ref
) {
  const hasLabel = children !== undefined && children !== null && !(typeof children === "string" && children.trim() === "");
  const isIconOnly = !hasLabel && (startIcon !== undefined || endIcon !== undefined);
  const isDisabled = disabled || loading;
  const leadingVisual = loading ? loadingIndicator ?? <span aria-hidden="true" className="ns-button__spinner" /> : startIcon;
  const classes = [
    "ns-button",
    `ns-button--${variant}`,
    `ns-button--${size}`,
    loading ? "ns-button--loading" : "",
    isIconOnly ? "ns-button--icon-only" : "",
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} aria-busy={ariaBusy ?? (loading || undefined)} className={classes} disabled={isDisabled} type={type} {...rest}>
      {leadingVisual ? (
        <span aria-hidden="true" className="ns-button__icon ns-button__icon--start">
          {leadingVisual}
        </span>
      ) : null}
      {hasLabel ? <span className="ns-button__label">{children}</span> : null}
      {!loading && endIcon ? (
        <span aria-hidden="true" className="ns-button__icon ns-button__icon--end">
          {endIcon}
        </span>
      ) : null}
      {loading ? <span className="ns-button__sr-only">{loadingText}</span> : null}
    </button>
  );
});
