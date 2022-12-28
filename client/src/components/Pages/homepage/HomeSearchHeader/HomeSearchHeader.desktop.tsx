import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import qs from "query-string";
import { useRouter } from "next/router";
import { cls } from "lib/classname";
import {
  inputFocusedSelector,
  searchQuerySelector,
  themesDisplayedValueSelector
} from "services/SearchResults/searchResults.selector";
import { setInputFocusedActionCreator } from "services/SearchResults/searchResults.actions";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import SearchInput from "components/Pages/recherche/SearchInput";
import LocationDropdown from "components/Pages/recherche/LocationDropdown";
import ThemeDropdown from "components/Pages/recherche/ThemeDropdown";
import { getPath } from "routes";
import styles from "./HomeSearchHeader.desktop.module.scss";
import commonStyles from "scss/components/searchHeader.module.scss";
import { useLoadingContext } from "pages";

interface Props {
  // filterProps
  locationSearch: string;
  themeSearch: string;
  resetDepartment: () => void;
  resetTheme: () => void;
  resetSearch: () => void;
  resetLocationSearch: () => void;
  onChangeDepartmentInput: (e: any) => void;
  onChangeThemeInput: (e: any) => void;
  onChangeSearchInput: (e: any) => void;
}

const HomeSearchHeaderDesktop = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const [, setGlobalLoading] = useLoadingContext();

  const {
    locationSearch,
    themeSearch,
    resetLocationSearch,
    resetDepartment,
    onChangeDepartmentInput,
    resetTheme,
    onChangeThemeInput,
    resetSearch,
    onChangeSearchInput
  } = props;

  const query = useSelector(searchQuerySelector);
  const inputFocused = useSelector(inputFocusedSelector);

  // LOCATION
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = useCallback(() => setLocationOpen((o) => !o), []);
  const setLocationActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("location", active)),
    [dispatch]
  );

  // THEME
  const [themesOpen, setThemesOpen] = useState(false);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const toggleThemes = useCallback(() => setThemesOpen((o) => !o), []);
  const setThemeActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("theme", active)),
    [dispatch]
  );

  // SEARCH
  const openSearch = useCallback(() => dispatch(setInputFocusedActionCreator("search", true)), [dispatch]);
  const setSearchActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("search", active)),
    [dispatch]
  );

  // prevent close dropdown on space
  const handleSpaceKey = useCallback((e: any) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
    }
  }, []);
  useEffect(() => {
    if (themesOpen || locationOpen) {
      document.addEventListener("keyup", handleSpaceKey);
    }

    return () => {
      document.removeEventListener("keyup", handleSpaceKey);
    };
  }, [themesOpen, locationOpen, handleSpaceKey]);

  return (
    <div className={styles.container}>
      <div className={styles.inputs}>
        <Dropdown
          isOpen={locationOpen || inputFocused.location}
          toggle={toggleLocation}
          className={commonStyles.dropdown}
        >
          <DropdownToggle>
            <SearchInput
              label={t("Dispositif.Département", "Département")}
              icon="pin-outline"
              active={locationOpen || inputFocused.location}
              setActive={setLocationActive}
              onChange={onChangeDepartmentInput}
              inputValue={locationSearch}
              inputPlaceholder={t("Recherche.department")}
              loading={false}
              value={query.departments.join(", ")}
              placeholder={t("Recherche.all", "Tous")}
              resetFilter={resetDepartment}
              onHomepage={true}
            />
          </DropdownToggle>
          <DropdownMenu>
            <LocationDropdown locationSearch={locationSearch} resetLocationSearch={resetLocationSearch} />
          </DropdownMenu>
        </Dropdown>

        <Dropdown isOpen={themesOpen || inputFocused.theme} toggle={toggleThemes} className={commonStyles.dropdown}>
          <DropdownToggle>
            <SearchInput
              label={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              active={inputFocused.theme || themesOpen}
              setActive={setThemeActive}
              onChange={onChangeThemeInput}
              inputValue={themeSearch}
              value={themeDisplayedValue}
              placeholder={t("Recherche.all", "Tous")}
              resetFilter={resetTheme}
              onHomepage={true}
            />
          </DropdownToggle>
          <DropdownMenu persist>
            <ThemeDropdown search={themeSearch} mobile={false} isOpen={themesOpen || inputFocused.theme} />
          </DropdownMenu>
        </Dropdown>

        <div className={cls(commonStyles.dropdown, inputFocused.search && "show")}>
          <Button onClick={openSearch}>
            <SearchInput
              label={t("Recherche.keyword", "Mot-clé")}
              icon="search-outline"
              active={inputFocused.search}
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
        onClick={() => {
          setGlobalLoading(true);
          router.push({
            pathname: getPath("/recherche", router.locale),
            query: qs.stringify({ ...query }, { arrayFormat: "comma" })
          });
        }}
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
