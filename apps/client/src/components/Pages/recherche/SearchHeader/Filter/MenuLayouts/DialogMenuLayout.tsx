import Button from "@codegouvfr/react-dsfr/Button";
import * as Dialog from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import DropdownButton from "~/components/Pages/recherche/SearchHeader/Filter/DropdownButton";
import { LayoutProps } from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchResultsSelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./DialogMenuLayout.module.scss";

export function DialogMenuLayout({ label, value, icon, resetOptions, gaType, filterCount, children }: LayoutProps) {
  const { t } = useTranslation();
  const searchResults = useSelector(searchResultsSelector);
  const totalResults = searchResults.matches.length;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setIsAnimatingOut(true);
      setTimeout(() => {
        setIsAnimatingOut(false);
        setOpen(false);
      }, 600);
    } else {
      setOpen(true);
    }

    if (newOpen) {
      Event("USE_SEARCH", "open filter", gaType);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <DropdownButton
          label={label}
          icon={icon}
          count={filterCount}
          value={value ?? []}
          onClear={resetOptions}
          isOpen={open}
          aria-haspopup="menu"
          aria-expanded={open}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleOpenChange(!open);
            }
          }}
        />
      </Dialog.Trigger>
      {open && (
        <Dialog.Portal>
          <Dialog.Content
            className={cls(
              styles.dialogMenu,
              open && !isAnimatingOut && styles.isOpen,
              open && !isAnimatingOut && styles.slideIn,
              isAnimatingOut && styles.slideOut,
            )}
          >
            <Dialog.Title className={styles.dialogTitle}>
              {label}
              <Dialog.Close asChild>
                <Button
                  title={t("Recherche.seeAllButtonWithCount", { count: totalResults })}
                  iconId="fr-icon-close-line"
                  priority="tertiary no outline"
                ></Button>
              </Dialog.Close>
            </Dialog.Title>
            <div className={styles.dialogInnerContent}>{children}</div>

            <div className={styles.dialogFooter}>
              <Button
                priority="tertiary"
                iconId="ri-eraser-line"
                onClick={() => {
                  resetOptions();
                  dispatch(addToQueryActionCreator({ sort: "date" }));
                }}
              >
                {t("Recherche.clear")}
              </Button>
              <Dialog.Close asChild>
                <Button>{t("Recherche.seeAllButtonWithCount", { count: totalResults })}</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

type DialogMenuLayoutTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export const DialogMenuLayoutTitle = ({ children, className }: DialogMenuLayoutTitleProps) => {
  return <div className={cls(styles.dialogSubTitle, className)}>{children}</div>;
};
