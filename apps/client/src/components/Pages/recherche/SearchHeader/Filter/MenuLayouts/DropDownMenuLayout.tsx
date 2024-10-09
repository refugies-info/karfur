import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DropdownButton from "~/components/Pages/recherche/SearchHeader/Filter/DropdownButton";
import { LayoutProps } from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { Event } from "~/lib/tracking";
import styles from "./DropDownMenuLayout.module.scss";

export function DropDownMenuLayout({ label, value, icon, resetOptions, gaType, children }: LayoutProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      Event("USE_SEARCH", "open filter", gaType);
    }
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={handleOpenChange} modal={false}>
      <DropdownMenu.Trigger asChild>
        <DropdownButton
          label={label}
          icon={icon}
          value={value ?? []}
          onClear={resetOptions}
          isOpen={open}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {t(label as any)}
        </DropdownButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" className={styles.menu} sideOffset={4}>
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
