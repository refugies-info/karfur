import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DropdownButton from "~/components/Pages/recherche/SearchHeader/Filter/DropdownButton";
import { LayoutProps, useDropdownContext } from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { useSearchEventName } from "~/hooks";
import { Event } from "~/lib/tracking";
import styles from "./DropDownMenuLayout.module.scss";

export function DropDownMenuLayout({ label, tooltip, value, icon, resetOptions, gaType, children }: LayoutProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const eventName = useSearchEventName();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { openDropdownId, setOpenDropdownId } = useDropdownContext();
  const dropdownId = label; // Use a unique ID for each dropdown, such as `label`

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen) {
        setOpenDropdownId(dropdownId);
        Event(eventName, "open filter", gaType);
      } else {
        setOpenDropdownId(null);
      }
      setOpen(newOpen);
    },
    [dropdownId, eventName, gaType, setOpenDropdownId],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || (!open && event.key === "ArrowDown")) {
        event.preventDefault();
        handleOpenChange(!open);
      } else if (event.key === "Escape" || (open && event.key === "ArrowUp")) {
        setOpen(false);
        setOpenDropdownId(null);
      }
    },
    [open, handleOpenChange, setOpenDropdownId],
  );

  const handleDropdownKeyDown = (event: KeyboardEvent) => {
    const focusableElements = dropdownRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements) {
      const focusArray = Array.from(focusableElements);
      const currentIndex = focusArray.indexOf(document.activeElement as HTMLElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusArray.length;
        focusArray[nextIndex]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + focusArray.length) % focusArray.length;
        focusArray[prevIndex]?.focus();
      } else if (event.key === "Escape") {
        setOpen(false);
        setOpenDropdownId(null);
      }
    }
  };

  useEffect(() => {
    if (open) {
      const firstFocusableElement = dropdownRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (firstFocusableElement) {
        setTimeout(() => firstFocusableElement.focus(), 0);
      }
    }
  }, [open]);

  useEffect(() => {
    if (openDropdownId !== dropdownId && open) {
      setOpen(false); // Close this dropdown if another dropdown is opened
    }
  }, [openDropdownId, dropdownId, open]);

  // Close dropdown if the user tabs away
  useEffect(() => {
    const handleFocusOut = (event: FocusEvent) => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget as Node)) {
        setOpen(false);
        setOpenDropdownId(null);
      }
    };

    const dropdownNode = dropdownRef.current;
    dropdownNode?.addEventListener("focusout", handleFocusOut);

    return () => {
      dropdownNode?.removeEventListener("focusout", handleFocusOut);
    };
  }, [open, setOpenDropdownId]);

  return (
    <div className={styles.menuContainer}>
      <DropdownButton
        label={label}
        tooltip={tooltip}
        icon={icon}
        value={value ?? []}
        onClear={resetOptions}
        isOpen={open}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => handleOpenChange(!open)}
        onKeyDown={handleKeyDown}
      >
        {t(label as any)}
      </DropdownButton>

      {open && (
        <div className={styles.menu} ref={dropdownRef} role="menu" onKeyDown={handleDropdownKeyDown}>
          {children}
        </div>
      )}
    </div>
  );
}
