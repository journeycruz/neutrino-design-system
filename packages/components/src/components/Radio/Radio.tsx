import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FieldsetHTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode
} from "react";
import "./Radio.css";

type RadioGroupContextValue = {
  name?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  onRadioChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  onRadioKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const mergeTokens = (...values: Array<string | undefined>) => {
  const merged = values.filter(Boolean).join(" ").trim();
  return merged || undefined;
};

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  hint?: string;
  invalid?: boolean;
};

export type RadioGroupProps = Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, "onChange"> & {
  children: ReactNode;
  name: string;
  legend?: string;
  hint?: string;
  error?: string;
  invalid?: boolean;
  required?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  orientation?: "vertical" | "horizontal";
};

const RADIO_NAVIGATION_KEYS = new Set(["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp", "Home", "End"]);

export const RadioGroup = ({
  children,
  className,
  defaultValue,
  disabled,
  error,
  hint,
  id,
  invalid,
  legend,
  name,
  onValueChange,
  orientation = "vertical",
  required,
  value,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}: RadioGroupProps) => {
  const generatedId = useId();
  const groupId = id ?? `ns-radio-group-${generatedId}`;
  const legendId = legend ? `${groupId}-legend` : undefined;
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = error ? `${groupId}-error` : undefined;
  const describedBy = mergeTokens(ariaDescribedBy, hintId, errorId);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;
  const fieldsetRef = useRef<HTMLFieldSetElement | null>(null);

  const onRadioChange = (nextValue: string, event: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue, event);
  };

  const onRadioKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!RADIO_NAVIGATION_KEYS.has(event.key) || !fieldsetRef.current) {
      return;
    }

    const radios = Array.from(fieldsetRef.current.querySelectorAll<HTMLInputElement>('input[type="radio"]')).filter(
      (radio) => !radio.disabled && radio.name === name
    );

    if (radios.length <= 1) {
      return;
    }

    const currentIndex = radios.findIndex((radio) => radio === event.currentTarget);
    if (currentIndex < 0) {
      return;
    }

    event.preventDefault();

    const lastIndex = radios.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowDown" || event.key === "ArrowRight"
            ? currentIndex === lastIndex
              ? 0
              : currentIndex + 1
            : currentIndex === 0
              ? lastIndex
              : currentIndex - 1;

    const nextRadio = radios[nextIndex];
    if (!nextRadio) {
      return;
    }

    nextRadio.focus();

    if (!nextRadio.checked) {
      nextRadio.click();
    }
  };

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      disabled,
      invalid: invalid || Boolean(error),
      name,
      onRadioChange,
      onRadioKeyDown,
      required,
      value: selectedValue
    }),
    [disabled, error, invalid, name, required, selectedValue]
  );

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <fieldset
        {...rest}
        aria-describedby={describedBy}
        aria-invalid={invalid || Boolean(error) || undefined}
        className={["ns-radio-group", className].filter(Boolean).join(" ")}
        data-orientation={orientation}
        disabled={disabled}
        id={groupId}
        ref={fieldsetRef}
      >
        {legend ? (
          <legend className="ns-radio-group-legend" id={legendId}>
            {legend}
          </legend>
        ) : null}
        <div
          aria-label={legend ? undefined : ariaLabel}
          aria-labelledby={legend ? legendId : ariaLabelledBy}
          className="ns-radio-group-options"
          role="radiogroup"
        >
          {children}
        </div>
        {hint ? (
          <p className="ns-radio-group-hint" id={hintId}>
            {hint}
          </p>
        ) : null}
        {error ? (
          <p className="ns-radio-group-error" id={errorId} role="alert">
            {error}
          </p>
        ) : null}
      </fieldset>
    </RadioGroupContext.Provider>
  );
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    label,
    hint,
    id,
    className,
    invalid,
    checked,
    disabled,
    name,
    onChange,
    onKeyDown,
    required,
    value,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  },
  ref
) {
  const group = useContext(RadioGroupContext);
  const generatedId = useId();
  const radioId = id ?? `ns-radio-${generatedId}`;
  const hintId = hint ? `${radioId}-hint` : undefined;
  const describedBy = mergeTokens(ariaDescribedBy, hintId);
  const radioValue = typeof value === "string" ? value : String(value ?? "");
  const isGrouped = Boolean(group);
  const isChecked = checked ?? (isGrouped ? group?.value === radioValue : undefined);
  const isDisabled = disabled ?? group?.disabled;
  const isRequired = required ?? group?.required;
  const isInvalid = ariaInvalid ?? invalid ?? group?.invalid;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.defaultPrevented || !group) {
      return;
    }

    group.onRadioChange(event.currentTarget.value, event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !group) {
      return;
    }

    group.onRadioKeyDown(event);
  };

  return (
    <div
      className={["ns-radio-field", isDisabled ? "ns-radio-field--disabled" : undefined].filter(Boolean).join(" ")}
      data-invalid={Boolean(isInvalid) || undefined}
    >
      <label className="ns-radio-label" htmlFor={radioId}>
        <input
          {...rest}
          aria-describedby={describedBy}
          aria-invalid={isInvalid}
          checked={isChecked}
          className={["ns-radio-input", className].filter(Boolean).join(" ")}
          disabled={isDisabled}
          id={radioId}
          name={name ?? group?.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={ref}
          required={isRequired}
          type="radio"
          value={value}
        />
        <span className="ns-radio-text">{label}</span>
      </label>
      {hint ? (
        <p className="ns-radio-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
