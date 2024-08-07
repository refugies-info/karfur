import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import LocationDropdown from "components/Pages/recherche/LocationDropdown";
import ThemeDropdown from "components/Pages/recherche/ThemeDropdown";
import React, { useState } from "react";
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

  return (
    <DropdownMenu.Root open={open} onOpenChange={() => setOpen((o) => !o)}>
      <DropdownMenu.Trigger>
        {mode === "department" && (
          <SearchInput
            label={t("Dispositif.Département", "Département")}
            icon="pin-outline"
            active={open}
            value={query.departments.join(", ")}
            placeholder={t("Recherche.all", "Tous")}
            resetFilter={reset}
            onHomepage={true}
            inputValue=""
            setActive={() => {}}
            noInput
          />
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
