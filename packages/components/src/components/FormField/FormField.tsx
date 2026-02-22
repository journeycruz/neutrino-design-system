import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import "./FormField.css";

type ControlA11yProps = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-labelledby"?: string;
};

export type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: ReactElement<Record<string, unknown>> | ((props: ControlA11yProps) => ReactElement);
};

const mergeDescribedBy = (current: unknown, next: string | undefined) => {
  if (!next) {
    return typeof current === "string" ? current : undefined;
  }

  const merged = [typeof current === "string" ? current : undefined, next].filter(Boolean).join(" ");
  return merged || undefined;
};

export const FormField = ({ label, hint, error, children }: FormFieldProps) => {
  const fieldId = useId();
  const defaultControlId = `ns-form-field-${fieldId}`;
  const childControlId =
    isValidElement<Record<string, unknown>>(children) && typeof children.props.id === "string"
      ? children.props.id
      : undefined;
  const controlId = childControlId ?? defaultControlId;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const labelId = `${controlId}-label`;

  const baseProps: ControlA11yProps = {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-invalid": Boolean(error),
    "aria-labelledby": labelId
  };

  const renderedControl =
    typeof children === "function"
      ? children(baseProps)
      : isValidElement<Record<string, unknown>>(children)
        ? cloneElement(children, {
            ...baseProps,
            id: controlId,
            "aria-describedby": mergeDescribedBy(children.props["aria-describedby"], baseProps["aria-describedby"]),
            "aria-invalid": children.props["aria-invalid"] ?? baseProps["aria-invalid"],
            "aria-labelledby": children.props["aria-labelledby"] ?? baseProps["aria-labelledby"]
          })
        : null;

  return (
    <div className="ns-form-field">
      <label className="ns-form-field-label" htmlFor={controlId} id={labelId}>
        {label}
      </label>
      {renderedControl}
      {hint ? (
        <p className="ns-form-field-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="ns-form-field-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
};
