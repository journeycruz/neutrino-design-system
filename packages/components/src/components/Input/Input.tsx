import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import "./Input.css";

export type InputSize = "sm" | "md" | "lg";

export type InputState = "default" | "invalid";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  hint?: string;
  error?: string;
  size?: InputSize | number;
  state?: InputState;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

const mergeIds = (...ids: Array<string | undefined>) => {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  return unique.length > 0 ? unique.join(" ") : undefined;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    id,
    className,
    size = "md",
    state = "default",
    prefix,
    suffix,
    disabled,
    readOnly,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? `ns-input-${generatedId}`;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const isAriaInvalid = ariaInvalid === true || ariaInvalid === "true";
  const isInvalid = state === "invalid" || Boolean(error) || isAriaInvalid;
  const describedBy = mergeIds(ariaDescribedBy, hintId, errorId);
  const visualSize = typeof size === "number" ? "md" : size;
  const htmlSize = typeof size === "number" ? size : undefined;

  const controlClassName = [
    "ns-input-control",
    isInvalid ? "ns-input-control--invalid" : "",
    disabled ? "ns-input-control--disabled" : "",
    readOnly ? "ns-input-control--readonly" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const inputClassName = ["ns-input", `ns-input--${visualSize}`, isInvalid ? "ns-input--invalid" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="ns-input-field">
      <label className="ns-input-label" htmlFor={inputId}>
        {label}
      </label>
      <div className={controlClassName}>
        {prefix ? <span className="ns-input-affix ns-input-affix--prefix">{prefix}</span> : null}
        <input
          ref={ref}
          aria-describedby={describedBy}
          aria-errormessage={error ? errorId : undefined}
          aria-invalid={ariaInvalid ?? isInvalid}
          aria-readonly={readOnly || undefined}
          className={inputClassName}
          disabled={disabled}
          id={inputId}
          readOnly={readOnly}
          size={htmlSize}
          {...rest}
        />
        {suffix ? <span className="ns-input-affix ns-input-affix--suffix">{suffix}</span> : null}
      </div>
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
