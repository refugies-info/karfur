import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "reactstrap";
import { getPath } from "routes";
import LocationMenu from "~/components/Pages/recherche/LocationMenu";
import ThemeMenu from "~/components/Pages/recherche/ThemeMenu";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { cls } from "~/lib/classname";
import commonStyles from "~/scss/components/searchHeader.module.scss";
import { searchQuerySelector, themesDisplayedValueSelector } from "~/services/SearchResults/searchResults.selector";
import SearchDropdown from "../SearchDropdown";
import SearchInput from "../SearchInput";
import styles from "./HomeSearchHeader.desktop.module.scss";

interface Props {
  resetDepartment: () => void;
  resetTheme: () => void;
  resetSearch: () => void;
  onChangeSearchInput: (e: any) => void;
}

const HomeSearchHeaderDesktop = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const { resetDepartment, resetTheme, resetSearch, onChangeSearchInput } = props;

  const query = useSelector(searchQuerySelector);

  // LOCATION
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = useCallback(() => setLocationOpen((o) => !o), []);

  // THEME
  const [themesOpen, setThemesOpen] = useState(false);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const toggleThemes = useCallback(() => setThemesOpen((o) => !o), []);

  // SEARCH
  const [searchActive, setSearchActive] = useState(false);
  const openSearch = useCallback(() => setSearchActive(true), []);

  const submitForm = useCallback(() => {
    router.push({
      pathname: getPath("/recherche", router.locale),
      query: qs.stringify({ ...query }, { arrayFormat: "comma" }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const handleKey = (e: any) => {
      if (e.key === "Escape") {
        if (locationOpen) toggleLocation();
        if (themesOpen) toggleThemes();
      }
      if (e.key === "Enter") {
        if (locationOpen || themesOpen || searchActive) {
          submitForm();
        }
      }
    };
    document.addEventListener("keyup", handleKey);

    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  }, [toggleLocation, toggleThemes, locationOpen, themesOpen, searchActive, submitForm]);

  return (
    <div className={styles.container}>
      <div className={styles.inputs}>
        <SearchDropdown
          icon="pin-outline"
          label={t("Dispositif.Département", "Département")}
          values={query.departments}
          resetFilter={resetDepartment}
          open={locationOpen}
          setOpen={setLocationOpen}
        >
          <LocationMenu />
        </SearchDropdown>

        <SearchDropdown
          icon="list-outline"
          label={t("Recherche.themes", "Thèmes")}
          values={themeDisplayedValue}
          resetFilter={resetTheme}
          open={themesOpen}
          setOpen={setThemesOpen}
        >
          <ThemeMenu mobile={false} isOpen={true} />
        </SearchDropdown>

        <div className={cls(commonStyles.dropdown, searchActive && "show")}>
          <Button onClick={openSearch}>
            <SearchInput
              label={t("Recherche.keyword", "Mot-clé")}
              icon="search-outline"
              active={searchActive}
              setActive={setSearchActive}
              onChange={onChangeSearchInput}
              inputValue={query.search}
              value={query.search}
              placeholder={t("Recherche.keywordPlaceholder", "Mission locale, titre de séjour...")}
              focusout
              resetFilter={resetSearch}
              onHomepage={true}
            />
          </Button>
        </div>
      </div>
      <Button
        onClick={submitForm}
        className={commonStyles.submit}
        disabled={
          !query.search && query.departments.length === 0 && query.themes.length === 0 && query.needs.length === 0
        }
      >
        <EVAIcon name="search-outline" fill="white" size={24} className={commonStyles.icon} />
        <span className={commonStyles.label}>{t("Rechercher")}</span>
      </Button>
    </div>
  );
};

export default HomeSearchHeaderDesktop;
