import { useId, useState, type AriaAttributes, type KeyboardEvent } from "react";
import "./Switch.css";

export type SwitchProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  "aria-describedby"?: AriaAttributes["aria-describedby"];
  "aria-invalid"?: AriaAttributes["aria-invalid"];
  "aria-labelledby"?: AriaAttributes["aria-labelledby"];
  onCheckedChange?: (checked: boolean) => void;
};

export const Switch = ({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-labelledby": ariaLabelledBy,
  onCheckedChange
}: SwitchProps) => {
  const generatedId = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const currentChecked = isControlled ? checked : internalChecked;

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

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== " " && event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    toggle();
  };

  return (
    <div className="ns-switch-field">
      <span className="ns-switch-label" id={`ns-switch-${generatedId}`}>
        {label}
      </span>
      <button
        aria-checked={currentChecked}
        aria-disabled={disabled}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
        aria-labelledby={ariaLabelledBy ?? `ns-switch-${generatedId}`}
        className={["ns-switch", currentChecked ? "ns-switch--checked" : ""].filter(Boolean).join(" ")}
        disabled={disabled}
        id={id}
        onClick={toggle}
        onKeyDown={onKeyDown}
        role="switch"
        type="button"
      >
        <span className="ns-switch-thumb" />
      </button>
    </div>
  );
};
