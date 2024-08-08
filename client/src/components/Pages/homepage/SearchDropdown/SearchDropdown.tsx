import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import LocationDropdown from "components/Pages/recherche/LocationDropdown";
import ThemeDropdown from "components/Pages/recherche/ThemeDropdown";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { searchQuerySelector, themesDisplayedValueSelector } from "services/SearchResults/searchResults.selector";
import SearchButton from "./SearchButton";
import styles from "./SearchDropdown.module.css";

interface Props {
  mode: "department" | "theme";
  resetFilter: () => void;
}

const SearchDropdown: React.FC<Props> = ({ mode, resetFilter }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const query = useSelector(searchQuerySelector);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);

  const onClickCross = useCallback(
    () => {
      resetFilter();
    },
    [resetFilter],
  );

  return (
    <DropdownMenu.Root open={open} onOpenChange={() => setOpen((o) => !o)}>
      {mode === "department" ? (
        <SearchButton
          open={open}
          icon="pin-outline"
          label={t("Dispositif.Département", "Département")}
          values={query.departments}
          onClickCross={onClickCross}
        />
      ) : mode === "theme" ? (
        <SearchButton
          open={open}
          icon="list-outline"
          label={t("Recherche.themes", "Thèmes")}
          values={themeDisplayedValue}
          onClickCross={onClickCross}
        />
      ) : null}
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.menu} avoidCollisions>
          {mode === "department" ? (
            <LocationDropdown />
          ) : mode === "theme" ? (
            <ThemeDropdown mobile={false} isOpen={open} />
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SearchDropdown;
