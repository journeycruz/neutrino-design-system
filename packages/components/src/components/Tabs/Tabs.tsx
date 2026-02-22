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
};

export const Tabs = ({ items, defaultTabId }: TabsProps) => {
  const tabsId = useId();
  const firstEnabled = items.find((item) => !item.disabled);
  const initialActiveItem = items.find((item) => item.id === defaultTabId && !item.disabled) ?? firstEnabled;
  const [activeId, setActiveId] = useState(initialActiveItem?.id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = useMemo(() => items.findIndex((item) => item.id === activeId), [activeId, items]);

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

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!items.length) {
      return;
    }

    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
      return;
    }

    const enabledIndexes = items.map((item, index) => (item.disabled ? -1 : index)).filter((index) => index >= 0);
    if (enabledIndexes.length === 0) {
      return;
    }

    event.preventDefault();

    const focusedElement = document.activeElement;
    const focusedIndex = tabRefs.current.findIndex((element) => element === focusedElement);
    let nextIndex = focusedIndex >= 0 ? focusedIndex : activeIndex >= 0 ? activeIndex : 0;

    if (event.key === "ArrowRight") {
      nextIndex = findNextEnabledIndex(nextIndex, 1);
    } else if (event.key === "ArrowLeft") {
      nextIndex = findNextEnabledIndex(nextIndex, -1);
    } else if (event.key === "Home") {
      nextIndex = enabledIndexes[0];
    } else if (event.key === "End") {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex < 0) {
      return;
    }

    setActiveId(items[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  const activeTab = items.find((item) => item.id === activeId && !item.disabled) ?? firstEnabled;

  return (
    <div className="ns-tabs">
      <div aria-label="Tabs" className="ns-tabs-list" onKeyDown={onKeyDown} role="tablist">
        {items.map((item, index) => {
          const selected = activeTab?.id === item.id;
          const panelId = `${tabsId}-panel-${item.id}`;
          return (
            <button
              aria-controls={panelId}
              aria-disabled={item.disabled ? true : undefined}
              aria-selected={selected}
              className={["ns-tab", selected ? "ns-tab--active" : "", item.disabled ? "ns-tab--disabled" : ""].filter(Boolean).join(" ")}
              disabled={item.disabled}
              id={`${tabsId}-tab-${item.id}`}
              key={item.id}
              onClick={() => {
                if (!item.disabled) {
                  setActiveId(item.id);
                }
              }}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeTab ? (
          <div
          aria-labelledby={`${tabsId}-tab-${activeTab.id}`}
          className="ns-tab-panel"
          id={`${tabsId}-panel-${activeTab.id}`}
          role="tabpanel"
          tabIndex={0}
        >
          {activeTab.panel}
        </div>
      ) : null}
    </div>
  );
};
