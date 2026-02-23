import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import "./Tabs.css";

export type TabItem = {
  id: string;
  label: string;
  panel: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  defaultTabId?: string;
  orientation?: "horizontal" | "vertical";
  activationMode?: "automatic" | "manual";
  ariaLabel?: string;
  ariaLabelledBy?: string;
};

export const Tabs = ({
  items,
  defaultTabId,
  orientation = "horizontal",
  activationMode = "automatic",
  ariaLabel = "Tabs",
  ariaLabelledBy
}: TabsProps) => {
  const tabsId = useId();
  const firstEnabled = items.find((item) => !item.disabled);
  const initialActiveItem = items.find((item) => item.id === defaultTabId && !item.disabled) ?? firstEnabled;
  const [activeId, setActiveId] = useState(initialActiveItem?.id);
  const [focusedId, setFocusedId] = useState(initialActiveItem?.id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = useMemo(() => items.findIndex((item) => item.id === activeId), [activeId, items]);
  const focusedIndex = useMemo(() => items.findIndex((item) => item.id === focusedId), [focusedId, items]);

  const findNextEnabledIndex = (startIndex: number, direction: 1 | -1) => {
    if (!items.length || items.every((item) => item.disabled)) {
      return -1;
    }

    let nextIndex = startIndex;
    for (let attempt = 0; attempt < items.length; attempt += 1) {
      nextIndex = (nextIndex + direction + items.length) % items.length;
      if (!items[nextIndex].disabled) {
        return nextIndex;
      }
    }

    return -1;
  };

  const keyMap =
    orientation === "vertical"
      ? {
          previous: "ArrowUp",
          next: "ArrowDown"
        }
      : {
          previous: "ArrowLeft",
          next: "ArrowRight"
        };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items.length) {
      return;
    }

    if (
      event.key !== keyMap.next &&
      event.key !== keyMap.previous &&
      event.key !== "Home" &&
      event.key !== "End" &&
      event.key !== "Enter" &&
      event.key !== " "
    ) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      if (activationMode !== "manual") {
        return;
      }

      if (focusedId) {
        event.preventDefault();
        setActiveId(focusedId);
      }
      return;
    }

    const enabledIndexes = items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0);
    if (enabledIndexes.length === 0) {
      return;
    }

    event.preventDefault();

    const focusedElement = document.activeElement;
    const focusedDomIndex = tabRefs.current.findIndex((element) => element === focusedElement);
    let nextIndex = focusedDomIndex >= 0 ? focusedDomIndex : focusedIndex >= 0 ? focusedIndex : activeIndex >= 0 ? activeIndex : 0;

    if (event.key === keyMap.next) {
      nextIndex = findNextEnabledIndex(nextIndex, 1);
    } else if (event.key === keyMap.previous) {
      nextIndex = findNextEnabledIndex(nextIndex, -1);
    } else if (event.key === "Home") {
      nextIndex = enabledIndexes[0];
    } else if (event.key === "End") {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex < 0) {
      return;
    }

    const nextId = items[nextIndex].id;
    setFocusedId(nextId);
    if (activationMode === "automatic") {
      setActiveId(nextId);
    }
    tabRefs.current[nextIndex]?.focus();
  };

  const activeTab = items.find((item) => item.id === activeId && !item.disabled) ?? firstEnabled;
  const selectedTabId = activeTab?.id;
  const focusableTabId = activationMode === "manual" ? (focusedId ?? selectedTabId) : selectedTabId;

  return (
    <div className={["ns-tabs", orientation === "vertical" ? "ns-tabs--vertical" : ""].filter(Boolean).join(" ")}>
      <div
        aria-label={ariaLabelledBy ? undefined : ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-orientation={orientation}
        className={["ns-tabs-list", orientation === "vertical" ? "ns-tabs-list--vertical" : ""].filter(Boolean).join(" ")}
        onKeyDown={onKeyDown}
        role="tablist"
      >
        {items.map((item, index) => {
          const selected = selectedTabId === item.id;
          const tabId = `${tabsId}-tab-${item.id}`;
          const panelId = `${tabsId}-panel-${item.id}`;
          const focusable = focusableTabId === item.id;
          return (
            <button
              aria-controls={panelId}
              aria-disabled={item.disabled ? true : undefined}
              aria-selected={selected}
              className={["ns-tab", selected ? "ns-tab--active" : "", item.disabled ? "ns-tab--disabled" : ""].filter(Boolean).join(" ")}
              disabled={item.disabled}
              id={tabId}
              key={item.id}
              onFocus={() => {
                if (!item.disabled) {
                  setFocusedId(item.id);
                }
              }}
              onClick={() => {
                if (!item.disabled) {
                  setFocusedId(item.id);
                  setActiveId(item.id);
                }
              }}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={focusable && !item.disabled ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        const selected = selectedTabId === item.id;
        return (
          <div
            aria-labelledby={`${tabsId}-tab-${item.id}`}
            className="ns-tab-panel"
            hidden={!selected}
            id={`${tabsId}-panel-${item.id}`}
            key={item.id}
            role="tabpanel"
            tabIndex={selected ? 0 : -1}
          >
            {item.panel}
          </div>
        );
      })}
    </div>
  );
};
