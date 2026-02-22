import { forwardRef, type ButtonHTMLAttributes } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = "primary", className, type = "button", ...rest },
  ref
) {
  const classes = ["ns-button", `ns-button--${variant}`, className].filter(Boolean).join(" ");
  return (
    <button ref={ref} className={classes} type={type} {...rest}>
      {children}
    </button>
  );
});
