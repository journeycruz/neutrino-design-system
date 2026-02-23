import { useId, useState, type ButtonHTMLAttributes, type KeyboardEvent, type MouseEvent } from "react";
import "./Switch.css";

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "role" | "type" | "onChange"> & {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  hint?: string;
  size?: "sm" | "md";
  onLabel?: string;
  offLabel?: string;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export const Switch = ({
  label,
  checked,
  defaultChecked = false,
  hint,
  size = "md",
  onLabel = "On",
  offLabel = "Off",
  disabled = false,
  id,
  className,
  onClick,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  onCheckedChange,
  ...rest
}: SwitchProps) => {
  const generatedId = useId();
  const switchId = id ?? `ns-switch-${generatedId}`;
  const labelId = `${switchId}-label`;
  const hintId = hint ? `${switchId}-hint` : undefined;
  const stateId = `${switchId}-state`;

  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const currentChecked = isControlled ? checked : internalChecked;

  const describedBy = [ariaDescribedBy, hintId].filter(Boolean).join(" ") || undefined;
  const labelledBy =
    ariaLabel && !ariaLabelledBy
      ? undefined
      : Array.from(new Set([ariaLabelledBy, labelId, stateId].filter(Boolean).join(" ").split(" ")))
          .join(" ")
          .trim();

  const setChecked = (nextChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
  };

  const toggle = () => {
    if (disabled) {
      return;
    }
    setChecked(!currentChecked);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    toggle();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key !== " " && event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    toggle();
  };

  return (
    <div className={["ns-switch-field", disabled ? "ns-switch-field--disabled" : ""].filter(Boolean).join(" ")}>
      <span className="ns-switch-label" id={labelId}>
        {label}
      </span>
      <button
        aria-checked={currentChecked}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-labelledby={labelledBy}
        className={[
          "ns-switch",
          `ns-switch--size-${size}`,
          currentChecked ? "ns-switch--checked" : "",
          className
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={disabled}
        id={switchId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="switch"
        type="button"
        {...rest}
      >
        <span aria-hidden="true" className="ns-switch-track" />
        <span className="ns-switch-thumb" />
        <span className="ns-switch-sr-only" id={stateId}>
          {currentChecked ? onLabel : offLabel}
        </span>
      </button>
      {hint ? (
        <p className="ns-switch-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
    </div>
  );
};
