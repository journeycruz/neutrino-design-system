import { forwardRef, useEffect, useId, useState, type SelectHTMLAttributes } from "react";
import "./Select.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: string;
  error?: string;
};

const isDefinedValue = (value: SelectHTMLAttributes<HTMLSelectElement>["value"]) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return String(value).trim().length > 0;
};

const isDefinedDefaultValue = (value: SelectHTMLAttributes<HTMLSelectElement>["defaultValue"]) => {
  if (value === undefined || value === null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return String(value).trim().length > 0;
};

const getFocusableOptionIndex = (options: HTMLOptionsCollection, direction: "first" | "last") => {
  const optionList = Array.from(options);
  if (direction === "first") {
    return optionList.findIndex((option) => !option.disabled);
  }

  for (let index = optionList.length - 1; index >= 0; index -= 1) {
    if (!optionList[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    options,
    placeholder,
    hint,
    error,
    id,
    className,
    value,
    defaultValue,
    onChange,
    onKeyDown,
    disabled,
    multiple,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  },
  ref
) {
  const generatedId = useId();
  const selectId = id ?? `ns-select-${generatedId}`;
  const hintId = hint ? `${selectId}-hint` : undefined;
  const errorId = error ? `${selectId}-error` : undefined;
  const describedBy = [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;
  const shouldRenderPlaceholder = Boolean(placeholder) && !multiple;
  const [hasValue, setHasValue] = useState(() => isDefinedValue(value) || isDefinedDefaultValue(defaultValue));

  useEffect(() => {
    if (value !== undefined) {
      setHasValue(isDefinedValue(value));
    }
  }, [value]);

  const handleChange: SelectHTMLAttributes<HTMLSelectElement>["onChange"] = (event) => {
    if (value === undefined) {
      setHasValue(Boolean(event.currentTarget.value));
    }

    onChange?.(event);
  };

  const handleKeyDown: SelectHTMLAttributes<HTMLSelectElement>["onKeyDown"] = (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || disabled || multiple) {
      return;
    }

    if (event.key !== "Home" && event.key !== "End") {
      return;
    }

    const targetIndex = getFocusableOptionIndex(event.currentTarget.options, event.key === "Home" ? "first" : "last");
    if (targetIndex < 0) {
      return;
    }

    const nextOption = event.currentTarget.options[targetIndex];
    if (!nextOption || nextOption.value === event.currentTarget.value) {
      return;
    }

    event.preventDefault();
    event.currentTarget.value = nextOption.value;
    if (value === undefined) {
      setHasValue(Boolean(nextOption.value));
    }
    event.currentTarget.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const resolvedDefaultValue =
    shouldRenderPlaceholder && value === undefined && defaultValue === undefined ? "" : defaultValue;

  return (
    <div className="ns-select-field">
      <label className="ns-select-label" htmlFor={selectId}>
        {label}
      </label>
      <div className="ns-select-control">
        <select
          ref={ref}
          aria-describedby={describedBy}
          aria-errormessage={error ? errorId : undefined}
          aria-invalid={ariaInvalid ?? Boolean(error)}
          className={[
            "ns-select",
            className,
            error ? "ns-select--invalid" : "",
            disabled ? "ns-select--disabled" : "",
            shouldRenderPlaceholder && !hasValue ? "ns-select--placeholder" : ""
          ]
            .filter(Boolean)
            .join(" ")}
          data-has-value={hasValue ? "true" : "false"}
          defaultValue={resolvedDefaultValue}
          disabled={disabled}
          id={selectId}
          multiple={multiple}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={value}
          {...rest}
        >
          {shouldRenderPlaceholder ? (
            <option className="ns-select-option ns-select-option--placeholder" disabled value="">
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option className="ns-select-option" disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className="ns-select-indicator">
          <svg className="ns-select-indicator-icon" viewBox="0 0 12 8">
            <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </span>
      </div>
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
