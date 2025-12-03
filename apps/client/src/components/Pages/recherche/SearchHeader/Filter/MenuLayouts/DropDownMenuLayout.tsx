import { cn } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import DropdownButton from "~/components/Pages/recherche/SearchHeader/Filter/DropdownButton";
import {
  type LayoutProps,
  useDropdownContext,
} from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { useSearchEventName } from "~/hooks";
import { Event } from "~/lib/tracking";
import styles from "./DropDownMenuLayout.module.scss";

export function DropDownMenuLayout({
  label,
  tooltip,
  value,
  icon,
  resetOptions,
  gaType,
  children,
}: LayoutProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const eventName = useSearchEventName();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { openDropdownId, setOpenDropdownId } = useDropdownContext();
  const dropdownId = useRef(gaType || label).current;

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
        buttonRef.current?.focus();
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
      setOpen(false);
    }
  }, [openDropdownId, dropdownId, open]);

  useEffect(() => {
    const dropdownNode = dropdownRef.current;
    const buttonNode = buttonRef.current;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        open &&
        dropdownNode &&
        buttonNode &&
        !dropdownNode.contains(target) &&
        !buttonNode.contains(target)
      ) {
        setOpen(false);
        setOpenDropdownId(null);
      }
    };

    const handleFocusChange = (event: FocusEvent) => {
      setTimeout(() => {
        const currentlyFocused = document.activeElement;
        if (
          open &&
          dropdownNode &&
          currentlyFocused &&
          currentlyFocused !== document.body &&
          !dropdownNode.contains(currentlyFocused) &&
          currentlyFocused !== buttonRef.current
        ) {
          setOpen(false);
          setOpenDropdownId(null);
        }
      }, 150);
    };

    document.addEventListener("mousedown", handleClickOutside);
    dropdownNode?.addEventListener("focusout", handleFocusChange);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      dropdownNode?.removeEventListener("focusout", handleFocusChange);
    };
  }, [open, setOpenDropdownId]);

  return (
    <div className={cn(styles.menuContainer, openDropdownId === label && (styles.open, "open"))}>
      <DropdownButton
        label={label}
        tooltip={tooltip}
        icon={icon}
        value={value ?? []}
        onClear={() => {
          buttonRef.current?.focus();
          resetOptions();
        }}
        isOpen={open}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => handleOpenChange(!open)}
        onKeyDown={handleKeyDown}
        ref={buttonRef}
      >
        {t(label as any)}
      </DropdownButton>

      {open && (
        <div
          className={styles.menu}
          ref={dropdownRef}
          role="menu"
          onKeyDown={handleDropdownKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  );
}
