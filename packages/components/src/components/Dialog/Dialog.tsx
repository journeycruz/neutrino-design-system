import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
  type PropsWithChildren,
  type ReactNode
} from "react";
import "./Dialog.css";

const FOCUSABLE_SELECTOR =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

const EXIT_ANIMATION_MS = 200;

let openDialogCount = 0;
let previousBodyOverflow = "";

const lockBodyScroll = () => {
  if (openDialogCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }

  openDialogCount += 1;
};

const unlockBodyScroll = () => {
  if (openDialogCount === 0) {
    return;
  }

  openDialogCount -= 1;

  if (openDialogCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
};

const isFocusable = (element: HTMLElement) => {
  if (element.hasAttribute("disabled")) {
    return false;
  }

  if (element.getAttribute("aria-hidden") === "true") {
    return false;
  }

  if (element.tabIndex < 0) {
    return false;
  }

  if (element.getAttribute("inert") !== null) {
    return false;
  }

  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
};

const getFocusableElements = (container: HTMLElement | null) => {
  if (!container) {
    return [];
  }

  const candidates = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(candidates).filter(isFocusable);
};

const isTopMostDialog = (container: HTMLElement | null) => {
  if (!container) {
    return false;
  }

  const dialogs = Array.from(document.querySelectorAll<HTMLElement>("[data-ns-dialog-root='true']"));
  return dialogs[dialogs.length - 1] === container;
};

export type DialogProps = PropsWithChildren<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  titleId?: string;
  descriptionId?: string;
}>;

export const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  closeOnEscape = true,
  closeOnBackdropClick = true,
  initialFocusRef,
  titleId: titleIdProp,
  descriptionId: descriptionIdProp,
  children
}: DialogProps) => {
  const autoTitleId = useId();
  const autoDescriptionId = useId();
  const titleId = useMemo(() => titleIdProp ?? autoTitleId, [autoTitleId, titleIdProp]);
  const descriptionId = useMemo(() => descriptionIdProp ?? autoDescriptionId, [autoDescriptionId, descriptionIdProp]);
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(open);
  const isScrollLockedRef = useRef(false);
  const [isMounted, setIsMounted] = useState(open);
  const [state, setState] = useState<"open" | "closed">(open ? "open" : "closed");

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const focusInitialTarget = useCallback(() => {
    const dialog = containerRef.current;
    if (!dialog) {
      return;
    }

    const fromRef = initialFocusRef?.current;
    if (fromRef && dialog.contains(fromRef) && isFocusable(fromRef)) {
      fromRef.focus();
      return;
    }

    const focusableElements = getFocusableElements(dialog);
    const initialFocusTarget = focusableElements[0] ?? dialog;
    initialFocusTarget.focus();
  }, [initialFocusRef]);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const dialog = containerRef.current;
    if (!dialog) {
      return;
    }

    const focusableElements = getFocusableElements(dialog);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!activeElement || !dialog.contains(activeElement)) {
      event.preventDefault();
      (event.shiftKey ? lastElement : firstElement).focus();
      return;
    }

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }, []);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      previouslyFocusedElementRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }

    if (!open) {
      setState("closed");

      wasOpenRef.current = false;
      return;
    }

    setIsMounted(true);
    wasOpenRef.current = true;
  }, [open]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (open) {
      const frame = window.requestAnimationFrame(() => {
        setState("open");
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    const timeout = window.setTimeout(() => {
      setIsMounted(false);

      const restoreTarget = previouslyFocusedElementRef.current;
      if (restoreTarget?.isConnected) {
        restoreTarget.focus();
      }
    }, EXIT_ANIMATION_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isMounted, open]);

  useEffect(() => {
    if (!open || !isMounted) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      focusInitialTarget();
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [focusInitialTarget, isMounted, open]);

  useEffect(() => {
    if (!open || !isMounted) {
      return;
    }

    if (!isScrollLockedRef.current) {
      lockBodyScroll();
      isScrollLockedRef.current = true;
    }

    return () => {
      if (isScrollLockedRef.current) {
        unlockBodyScroll();
        isScrollLockedRef.current = false;
      }
    };
  }, [isMounted, open]);

  useEffect(() => {
    if (!open || !isMounted) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopMostDialog(containerRef.current)) {
        return;
      }

      if (event.key === "Escape") {
        if (!closeOnEscape) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }

      if (event.key === "Tab") {
        trapFocus(event);
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [close, closeOnEscape, isMounted, open, trapFocus]);

  useEffect(
    () => () => {
      if (isScrollLockedRef.current) {
        unlockBodyScroll();
        isScrollLockedRef.current = false;
      }
    },
    []
  );

  if (!isMounted) {
    return null;
  }

  const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (!closeOnBackdropClick) {
      return;
    }

    if (!isTopMostDialog(containerRef.current)) {
      return;
    }

    close();
  };

  return (
    <div className="ns-dialog-overlay" data-state={state} onClick={onOverlayClick}>
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="ns-dialog"
        data-ns-dialog-root="true"
        data-state={state}
        onClick={(event) => event.stopPropagation()}
        ref={containerRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="ns-dialog-header">
          <h2 className="ns-dialog-title" id={titleId}>
            {title}
          </h2>
          <button aria-label="Close dialog" className="ns-dialog-close" onClick={close} type="button">
            x
          </button>
        </div>
        <div className="ns-dialog-body">
          {description ? (
            <div className="ns-dialog-description" id={descriptionId}>
              {description}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
};
