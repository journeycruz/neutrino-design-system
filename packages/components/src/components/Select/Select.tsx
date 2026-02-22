import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import "./Select.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  options: SelectOption[];
  hint?: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, hint, error, id, className, "aria-describedby": ariaDescribedBy, "aria-invalid": ariaInvalid, ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? `ns-select-${generatedId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="ns-select-field">
      <label className="ns-select-label" htmlFor={selectId}>
        {label}
      </label>
      <select
        ref={ref}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid ?? Boolean(error)}
        className={["ns-select", className, error ? "ns-select--invalid" : ""].filter(Boolean).join(" ")}
        id={selectId}
        {...rest}
      >
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? (
        <p className="ns-select-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="ns-select-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
