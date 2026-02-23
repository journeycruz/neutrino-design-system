import { cloneElement, isValidElement, useId, type AriaAttributes, type ReactElement, type ReactNode } from "react";
import "./FormField.css";

type ControlA11yProps = {
  id: string;
  "aria-describedby"?: AriaAttributes["aria-describedby"];
  "aria-errormessage"?: string;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
  "aria-labelledby"?: AriaAttributes["aria-labelledby"];
  "aria-required"?: boolean;
  required?: boolean;
};

export type FormFieldProps = {
  label: ReactNode;
  id?: string;
  required?: boolean;
  helpText?: ReactNode;
  errorText?: ReactNode;
  className?: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactElement<Record<string, unknown>> | ((props: ControlA11yProps) => ReactElement);
};

const splitAriaIds = (value: unknown) => {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(" ")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const mergeAriaIds = (...values: unknown[]) => {
  const merged = [...new Set(values.flatMap((value) => splitAriaIds(value)))];
  return merged.length > 0 ? merged.join(" ") : undefined;
};

const toClassName = (...values: Array<string | undefined | false>) => values.filter(Boolean).join(" ");

export const FormField = ({
  label,
  id,
  required = false,
  helpText,
  errorText,
  className,
  hint,
  error,
  children
}: FormFieldProps) => {
  const fieldId = useId();
  const baseId = id ?? `ns-form-field-${fieldId}`;
  const resolvedHelpText = helpText ?? hint;
  const resolvedErrorText = errorText ?? error;
  const hasError = Boolean(resolvedErrorText);
  const childControlId =
    isValidElement<Record<string, unknown>>(children) && typeof children.props.id === "string"
      ? children.props.id
      : undefined;
  const controlId = childControlId ?? baseId;
  const helpId = resolvedHelpText ? `${controlId}-field-help` : undefined;
  const errorId = resolvedErrorText ? `${controlId}-field-error` : undefined;
  const describedBy = mergeAriaIds(helpId, errorId);
  const labelId = `${controlId}-label`;
  const invalidState = hasError ? true : undefined;

  const baseProps: ControlA11yProps = {
    id: controlId,
    "aria-describedby": describedBy,
    "aria-errormessage": errorId,
    "aria-invalid": invalidState,
    "aria-labelledby": labelId,
    "aria-required": required || undefined,
    required: required || undefined
  };

  const withControlA11y = (control: ReactElement<Record<string, unknown>>) => {
    const hasAriaLabel = typeof control.props["aria-label"] === "string";
    const childLabelledBy = control.props["aria-labelledby"];

    return cloneElement(control, {
      ...baseProps,
      id: controlId,
      "aria-describedby": mergeAriaIds(control.props["aria-describedby"], baseProps["aria-describedby"]),
      "aria-errormessage": errorId ? control.props["aria-errormessage"] ?? errorId : control.props["aria-errormessage"],
      "aria-invalid": control.props["aria-invalid"] ?? baseProps["aria-invalid"],
      "aria-labelledby": hasAriaLabel ? childLabelledBy : childLabelledBy ?? baseProps["aria-labelledby"],
      "aria-required": control.props["aria-required"] ?? baseProps["aria-required"],
      required: control.props.required ?? baseProps.required
    });
  };

  const renderedControl = (() => {
    if (typeof children === "function") {
      const renderedChild = children(baseProps);
      return isValidElement<Record<string, unknown>>(renderedChild) ? withControlA11y(renderedChild) : null;
    }

    return isValidElement<Record<string, unknown>>(children) ? withControlA11y(children) : null;
  })();

  return (
    <div className={toClassName("ns-form-field", className, hasError && "ns-form-field--invalid", required && "ns-form-field--required")}>
      <label className="ns-form-field-label" htmlFor={controlId} id={labelId}>
        <span className="ns-form-field-label-text">{label}</span>
        {required ? (
          <span aria-hidden="true" className="ns-form-field-required-indicator">
            *
          </span>
        ) : null}
      </label>
      {renderedControl}
      {resolvedHelpText ? (
        <p className="ns-form-field-help ns-form-field-hint" id={helpId}>
          {resolvedHelpText}
        </p>
      ) : null}
      {resolvedErrorText ? (
        <p className="ns-form-field-error" id={errorId} role="alert">
          {resolvedErrorText}
        </p>
      ) : null}
    </div>
  );
};
