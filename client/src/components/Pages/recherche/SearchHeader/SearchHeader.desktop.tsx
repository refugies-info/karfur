import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import {
  inputFocusedSelector,
  searchQuerySelector,
  themesDisplayedValueSelector
} from "services/SearchResults/searchResults.selector";
import { resetQueryActionCreator, setInputFocusedActionCreator } from "services/SearchResults/searchResults.actions";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import LocationDropdown from "../LocationDropdown";
import SecondaryFilter from "../SecondaryFilter";
import { SecondaryFilterOptions } from "../SecondaryFilter/SecondaryFilter";
import styles from "./SearchHeader.desktop.module.scss";
import commonStyles from "scss/components/searchHeader.module.scss";

interface Props {
  nbResults: number;
  searchMinified: boolean;

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
  ageOptions: SecondaryFilterOptions;
  frenchLevelOptions: SecondaryFilterOptions;
  languagesOptions: SecondaryFilterOptions;
  selectAgeOption: (selected: AgeOptions[]) => void;
  selectFrenchLevelOption: (selected: FrenchOptions[]) => void;
  selectLanguageOption: (selected: string[]) => void;
}

const SearchHeaderDesktop = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    locationSearch,
    themeSearch,
    resetLocationSearch,
    resetDepartment,
    onChangeDepartmentInput,
    resetTheme,
    onChangeThemeInput,
    resetSearch,
    onChangeSearchInput,
    ageOptions,
    selectAgeOption,
    frenchLevelOptions,
    selectFrenchLevelOption,
    languagesOptions,
    selectLanguageOption
  } = props;

  const query = useSelector(searchQuerySelector);
  const inputFocused = useSelector(inputFocusedSelector);

  // LOCATION
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = useCallback(() => {
    setLocationOpen((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "location");
      return !prevState;
    });
  }, []);
  const setLocationActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("location", active)),
    [dispatch]
  );

  // THEME
  const [themesOpen, setThemesOpen] = useState(false);
  const themeDisplayedValue = useSelector(themesDisplayedValueSelector);
  const toggleThemes = useCallback(() => {
    setThemesOpen((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "theme");
      return !prevState;
    });
  }, []);
  const setThemeActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("theme", active)),
    [dispatch]
  );

  // SEARCH
  const handleSpaceKey = useCallback((e: any) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
    }
  }, []);
  const setSearchActive = useCallback(
    (active: boolean) => dispatch(setInputFocusedActionCreator("search", active)),
    [dispatch]
  );

  const openSearch = useCallback(() => dispatch(setInputFocusedActionCreator("search", true)), [dispatch]);
  const closeSearch = useCallback(() => dispatch(setInputFocusedActionCreator("search", false)), [dispatch]);

  // AGE
  const [ageDisplayedValue, setAgeDisplayedValue] = useState("");
  useEffect(() => {
    if (query.age.length) {
      let ageDisplayedValue = "";
      const value = ageFilters.find((a) => a.key === query.age[0])?.value;
      // @ts-ignore
      if (value) ageDisplayedValue += t(value);
      if (query.age.length > 1) {
        ageDisplayedValue += `, +${query.age.length - 1}`;
      }
      setAgeDisplayedValue(ageDisplayedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.age]);

  // FRENCH LEVEL
  const [frenchLevelDisplayedValue, setFrenchLevelDisplayedValue] = useState("");
  useEffect(() => {
    if (query.frenchLevel.length) {
      let frenchLevelDisplayedValue = "";
      const value = frenchLevelFilter.find((a) => a.key === query.frenchLevel[0])?.value;
      // @ts-ignore
      if (value) frenchLevelDisplayedValue += t(value);
      if (query.frenchLevel.length > 1) {
        frenchLevelDisplayedValue += `, +${query.frenchLevel.length - 1}`;
      }
      setFrenchLevelDisplayedValue(frenchLevelDisplayedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.frenchLevel]);

  // LANGUAGE
  const languages = useSelector(allLanguesSelector);
  const [languageDisplayedValue, setLanguageDisplayedValue] = useState<string | ReactElement>("");
  useEffect(() => {
    if (query.language.length) {
      const langueCodes = query.language
        .map((option) => languages.find((a) => a.i18nCode === option)?.langueCode)
        .filter((ln) => !!ln);
      setLanguageDisplayedValue(
        <>
          {t("Recherche.fichesLanguageFilter")}
          {langueCodes.map((code, i) => (
            <span key={code} className={cls(styles.flag, `fi fi-${code}`)} title={code} id={code} />
          ))}
        </>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.language, languages]);

  // prevent close dropdown on space
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
      <Container className={styles.container_inner}>
        {props.searchMinified ? (
          <h1 className="h1 text-white">{t("Recherche.titleHome", { count: props.nbResults })}</h1>
        ) : (
          <h1 className="h1 text-white">{t("Recherche.titleResults", { count: props.nbResults })}</h1>
        )}
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
              />
            </DropdownToggle>
            <DropdownMenu className={styles.menu}>
              <LocationDropdown locationSearch={locationSearch} resetLocationSearch={resetLocationSearch} />
            </DropdownMenu>
            {(locationOpen || inputFocused.location) && <div className={styles.backdrop} onClick={toggleLocation} />}
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
              />
            </DropdownToggle>
            <DropdownMenu className={styles.menu} persist={themesOpen || inputFocused.theme}>
              <ThemeDropdown search={themeSearch} mobile={false} isOpen={themesOpen || inputFocused.theme} />
            </DropdownMenu>
            {(themesOpen || inputFocused.theme) && <div className={styles.backdrop} onClick={toggleThemes} />}
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
              />
            </Button>
          </div>
        </div>

        {!props.searchMinified && (
          <div className={styles.subheader}>
            <div className={styles.filters}>
              <SecondaryFilter
                mobile={false}
                label={query.age.length === 0 ? t("Recherche.filterAge", "Tranche d'âge") : ageDisplayedValue}
                selected={query.age}
                //@ts-ignore
                setSelected={selectAgeOption}
                options={ageOptions}
                gaType="age"
              />
              <SecondaryFilter
                mobile={false}
                label={
                  query.frenchLevel.length === 0
                    ? t("Recherche.filterFrenchLevel", "Niveau de français")
                    : frenchLevelDisplayedValue
                }
                selected={query.frenchLevel}
                //@ts-ignore
                setSelected={selectFrenchLevelOption}
                options={frenchLevelOptions}
                gaType="frenchLevel"
              />
              <SecondaryFilter
                mobile={false}
                label={
                  query.language.length === 0
                    ? t("Recherche.filterLanguage", "Fiches traduites en")
                    : languageDisplayedValue
                }
                selected={query.language}
                setSelected={selectLanguageOption}
                options={languagesOptions}
                gaType="language"
              />
            </div>
            <Button className={styles.reset} onClick={() => dispatch(resetQueryActionCreator())}>
              <EVAIcon name="refresh-outline" fill="white" className="me-2" />
              {t("Recherche.resetFilters", "Effacer tous les filtres")}
            </Button>
          </div>
        )}
      </Container>

      {inputFocused.search /* search backdrop placed here to cover only header */ && (
        <div className={cls(styles.backdrop, styles.search)} onClick={closeSearch} />
      )}
    </div>
  );
};

export default SearchHeaderDesktop;
