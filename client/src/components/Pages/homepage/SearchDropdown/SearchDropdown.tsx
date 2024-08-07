import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import LocationDropdown from "components/Pages/recherche/LocationDropdown";
import ThemeDropdown from "components/Pages/recherche/ThemeDropdown";
import EVAIcon from "components/UI/EVAIcon";
import { cls } from "lib/classname";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { searchQuerySelector, themesDisplayedValueSelector } from "services/SearchResults/searchResults.selector";
import SearchInput from "../SearchInput";
import styles from "./SearchDropdown.module.css";

interface Props {
  mode: "department" | "theme";
  reset: () => void;
}

const SearchDropdown: React.FC<Props> = ({ mode, reset }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const query = useSelector(searchQuerySelector);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);

  const iconColor = useMemo(() => {
    return open ? "white" : "black";
  }, [open]);

  return (
    <DropdownMenu.Root open={open} onOpenChange={() => setOpen((o) => !o)}>
      <DropdownMenu.Trigger>
        {mode === "department" && (
          <div className={styles.container}>
            <div className={cls(styles.iconContainer, open && styles.iconContainerActive)}>
              <EVAIcon name="pin-outline" fill={iconColor} />
            </div>
            <div className={styles.content}>
                <span className={styles.label}>{t("Dispositif.Département", "Département")}</span>
                <span className={styles.value}>{t("Recherche.all", "Tous")}</span>
              </div>
          </div>
          // <SearchInput
          //   label={t("Dispositif.Département", "Département")}
          //   icon="pin-outline"
          //   active={open}
          //   value={query.departments.join(", ")}
          //   placeholder={t("Recherche.all", "Tous")}
          //   resetFilter={reset}
          //   onHomepage={true}
          //   inputValue=""
          //   setActive={() => {}}
          //   noInput
          // />
        )}
        {mode === "theme" && (
          <SearchInput
            label={t("Recherche.themes", "Thèmes")}
            icon="list-outline"
            active={open}
            value={themeDisplayedValue.join(", ")}
            placeholder={t("Recherche.all", "Tous")}
            resetFilter={reset}
            onHomepage={true}
            inputValue=""
            setActive={() => {}}
            noInput
          />
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu} avoidCollisions>
          {mode === "department" && <LocationDropdown />}
          {mode === "theme" && <ThemeDropdown mobile={false} isOpen={open} />}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SearchDropdown;
