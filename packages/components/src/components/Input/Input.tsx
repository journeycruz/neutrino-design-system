import { forwardRef, useId, type InputHTMLAttributes } from "react";
import "./Input.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? `ns-input-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="ns-input-field">
      <label className="ns-input-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={ref}
        aria-invalid={ariaInvalid ?? Boolean(error)}
        aria-describedby={describedBy}
        className={["ns-input", className, error ? "ns-input--invalid" : ""].filter(Boolean).join(" ")}
        id={inputId}
        {...rest}
      />
      {hint ? (
        <p className="ns-input-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="ns-input-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
