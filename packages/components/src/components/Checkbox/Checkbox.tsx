import { forwardRef, useId, type InputHTMLAttributes } from "react";
import "./Checkbox.css";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, id, className, "aria-describedby": ariaDescribedBy, ...rest },
  ref
) {
  const generatedId = useId();
  const checkboxId = id ?? `ns-checkbox-${generatedId}`;
  const hintId = hint ? `${checkboxId}-hint` : undefined;

  const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="ns-checkbox-field">
      <label className="ns-checkbox-label" htmlFor={checkboxId}>
        <input
          ref={ref}
          aria-describedby={describedBy}
          className={["ns-checkbox-input", className].filter(Boolean).join(" ")}
          id={checkboxId}
          type="checkbox"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {hint ? (
        <p className="ns-checkbox-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
