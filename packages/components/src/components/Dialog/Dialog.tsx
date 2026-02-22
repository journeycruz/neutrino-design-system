import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type PropsWithChildren,
  type ReactNode
} from "react";
import "./Dialog.css";

export type DialogProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
}>;

export const Dialog = ({ open, onOpenChange, title, children }: DialogProps) => {
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(open);

  const getFocusableElements = () => {
    const dialog = containerRef.current;
    if (!dialog) {
      return [];
    }

    const candidates = dialog.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );

    return Array.from(candidates).filter((element) => {
      if (element.hasAttribute("disabled")) {
        return false;
      }

      if (element.getAttribute("aria-hidden") === "true") {
        return false;
      }

      return element.tabIndex >= 0;
    });
  };

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        if (previouslyFocusedElementRef.current?.isConnected) {
          previouslyFocusedElementRef.current.focus();
        }
      }

      wasOpenRef.current = false;
      return;
    }

    previouslyFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    wasOpenRef.current = true;

    const focusableElements = getFocusableElements();
    const initialFocusTarget = focusableElements[0] ?? containerRef.current;
    initialFocusTarget?.focus();
  }, [open]);

  if (!open) {
    return null;
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onOpenChange(false);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      containerRef.current?.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <div className="ns-dialog-overlay" onClick={() => onOpenChange(false)}>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="ns-dialog"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        ref={containerRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="ns-dialog-header">
          <h2 className="ns-dialog-title" id={titleId}>
            {title}
          </h2>
          <button aria-label="Close dialog" className="ns-dialog-close" onClick={() => onOpenChange(false)} type="button">
            x
          </button>
        </div>
        <div className="ns-dialog-body">{children}</div>
      </div>
    </div>
  );
};
