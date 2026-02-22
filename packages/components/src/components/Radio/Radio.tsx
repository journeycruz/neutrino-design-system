import { forwardRef, useId, type InputHTMLAttributes } from "react";
import "./Radio.css";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, hint, id, className, "aria-describedby": ariaDescribedBy, ...rest },
  ref
) {
  const generatedId = useId();
  const radioId = id ?? `ns-radio-${generatedId}`;
  const hintId = hint ? `${radioId}-hint` : undefined;

  const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="ns-radio-field">
      <label className="ns-radio-label" htmlFor={radioId}>
        <input
          ref={ref}
          aria-describedby={describedBy}
          className={["ns-radio-input", className].filter(Boolean).join(" ")}
          id={radioId}
          type="radio"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {hint ? (
        <p className="ns-radio-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
