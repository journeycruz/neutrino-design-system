import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type KeyboardEvent
} from "react";
import "./Checkbox.css";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
  indeterminate?: boolean;
};

const mergeAriaValues = (...values: Array<string | undefined>) => {
  const merged = values
    .flatMap((value) => (value ? value.split(" ") : []))
    .map((value) => value.trim())
    .filter(Boolean);

  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    label,
    hint,
    id,
    className,
    indeterminate = false,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    "aria-checked": ariaChecked,
    onKeyDown,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const checkboxId = id ?? `ns-checkbox-${generatedId}`;
  const hintId = hint ? `${checkboxId}-hint` : undefined;
  const labelTextId = `${checkboxId}-label`;

  const describedBy = mergeAriaValues(ariaDescribedBy, hintId);
  const labelledBy = mergeAriaValues(ariaLabelledBy, labelTextId);

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const assignRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || event.currentTarget.disabled) {
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="ns-checkbox-field">
      <label className="ns-checkbox-label" htmlFor={checkboxId}>
        <input
          ref={assignRef}
          aria-checked={indeterminate ? "mixed" : ariaChecked}
          aria-describedby={describedBy}
          aria-labelledby={labelledBy}
          className={["ns-checkbox-input", className].filter(Boolean).join(" ")}
          id={checkboxId}
          onKeyDown={handleKeyDown}
          type="checkbox"
          {...rest}
        />
        <span className="ns-checkbox-label-text" id={labelTextId}>
          {label}
        </span>
      </label>
      {hint ? (
        <p className="ns-checkbox-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
