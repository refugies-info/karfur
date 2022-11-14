import React, { Dispatch, ReactElement, SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { Theme } from "types/interface";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import LocationDropdown from "../LocationDropdown";
import SearchFilter from "../SearchFilter";
import styles from "./SearchHeader.desktop.module.scss";

interface Props {
  searchMinified: boolean;
  nbResults: number;
  themesDisplayed: Theme[];
  resetFilters: () => void;
  themeDisplayedValue: string;
  isPlacePredictionsLoading: boolean;
  placePredictions: any[];
  onSelectPrediction: (place_id: string) => void;

  // state from SearchHeader
  locationFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
  searchFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
  locationSearchState: [string, Dispatch<SetStateAction<string>>];
  themeSearchState: [string, Dispatch<SetStateAction<string>>];
  themesFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const SearchHeaderDesktop = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { resetFilters, themeDisplayedValue, isPlacePredictionsLoading, placePredictions, onSelectPrediction } = props;
  const query = useSelector(searchQuerySelector);

  // state from SearchHeader
  const [locationFocused, setLocationFocused] = props.locationFocusedState;
  const [searchFocused, setSearchFocused] = props.searchFocusedState;
  const [locationSearch, setLocationSearch] = props.locationSearchState;
  const [themeSearch, setThemeSearch] = props.themeSearchState;
  const [themesFocused, setThemesFocused] = props.themesFocusedState;

  const [locationOpen, setLocationOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleLocation = () => {
    setLocationOpen((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "location");
      return !prevState;
    });
  };
  const toggleThemes = () => {
    setThemesOpen((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "theme");
      return !prevState;
    });
  };

  const onChangeKeywordInput = useCallback(
    (e: any) => {
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event("USE_SEARCH", "use keyword filter", "use searchbar");
    },
    [dispatch]
  );

  const onChangeThemeInput = useCallback(
    (e: any) => {
      setThemeSearch(e.target.value);
      Event("USE_SEARCH", "use theme filter", "use searchbar");
    },
    [setThemeSearch]
  );

  const handleSpaceKey = useCallback((e: any) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    // prevent close dropdown on space
    if (themesOpen || locationOpen) {
      document.addEventListener("keyup", handleSpaceKey);
    }

    return () => {
      document.removeEventListener("keyup", handleSpaceKey);
    };
  }, [themesOpen, locationOpen, handleSpaceKey]);

  // FILTERS
  const languages = useSelector(allLanguesSelector);

  const [ageDisplayedValue, setAgeDisplayedValue] = useState("");
  useEffect(() => {
    if (query.age.length) {
      let ageDisplayedValue = "";
      const value = ageFilters.find((a) => a.key === query.age[0])?.value;
      if (value) ageDisplayedValue += t(value);
      if (query.age.length > 1) {
        ageDisplayedValue += `, +${query.age.length - 1}`;
      }
      setAgeDisplayedValue(ageDisplayedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.age]);

  const [frenchLevelDisplayedValue, setFrenchLevelDisplayedValue] = useState("");
  useEffect(() => {
    if (query.frenchLevel.length) {
      let frenchLevelDisplayedValue = "";
      const value = frenchLevelFilter.find((a) => a.key === query.frenchLevel[0])?.value;
      if (value) frenchLevelDisplayedValue += t(value);
      if (query.frenchLevel.length > 1) {
        frenchLevelDisplayedValue += `, +${query.frenchLevel.length - 1}`;
      }
      setFrenchLevelDisplayedValue(frenchLevelDisplayedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.frenchLevel]);

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
            <i key={code} className={cls(styles.flag, `flag-icon flag-icon-${code}`)} title={code} id={code} />
          ))}
        </>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.language, languages]);

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch]
  );

  return (
    <div className={styles.container}>
      <Container className={styles.container_inner}>
        {props.searchMinified ? (
          <h1 className="h1 text-white">{t("Recherche.titleHome", { count: props.nbResults })}</h1>
        ) : (
          <h1 className="h1 text-white">{t("Recherche.titleResults", { count: props.nbResults })}</h1>
        )}
        <div className={styles.inputs}>
          <Dropdown isOpen={locationOpen || locationFocused} toggle={toggleLocation} className={styles.dropdown}>
            <DropdownToggle>
              <SearchInput
                label={t("Dispositif.Département", "Département")}
                icon="pin-outline"
                active={locationOpen || locationFocused}
                setActive={setLocationFocused}
                onChange={(evt) => setLocationSearch(evt.target.value)}
                inputValue={locationSearch}
                inputPlaceholder={t("Recherche.department")}
                loading={isPlacePredictionsLoading}
                value={query.departments.join(", ")}
                placeholder={t("Recherche.all", "Tous")}
                resetFilter={() => {
                  setLocationSearch("");
                  addToQuery({ departments: [] });
                }}
              />
            </DropdownToggle>
            <DropdownMenu>
              <LocationDropdown
                predictions={placePredictions}
                onSelectPrediction={(id: string) => {
                  onSelectPrediction(id);
                  setLocationSearch("");
                }}
              />
            </DropdownMenu>
            {(locationOpen || locationFocused) && <div className={styles.backdrop} onClick={toggleLocation} />}
          </Dropdown>

          <Dropdown isOpen={themesOpen || themesFocused} toggle={toggleThemes} className={styles.dropdown}>
            <DropdownToggle>
              <SearchInput
                label={t("Recherche.themes", "Thèmes")}
                icon="list-outline"
                active={themesFocused || themesOpen}
                setActive={setThemesFocused}
                onChange={onChangeThemeInput}
                inputValue={themeSearch}
                value={themeDisplayedValue}
                placeholder={t("Recherche.all", "Tous")}
                resetFilter={() => {
                  setThemeSearch("");
                  addToQuery({ needs: [], themes: [] });
                }}
              />
            </DropdownToggle>
            <DropdownMenu>
              <ThemeDropdown search={themeSearch} mobile={false} />
            </DropdownMenu>
            {(themesOpen || themesFocused) && <div className={styles.backdrop} onClick={toggleThemes} />}
          </Dropdown>

          <div className={cls(styles.dropdown, searchFocused && "show")}>
            <Button onClick={() => setSearchFocused(true)}>
              <SearchInput
                label={t("Recherche.keyword", "Mot-clé")}
                icon="search-outline"
                active={searchFocused}
                setActive={setSearchFocused}
                onChange={onChangeKeywordInput}
                inputValue={query.search}
                value={query.search}
                placeholder={t("Recherche.keywordPlaceholder", "Mission locale, titre de séjour...")}
                focusout
                resetFilter={() => addToQuery({ search: "" })}
              />
            </Button>
          </div>
        </div>

        {!props.searchMinified && (
          <div className={styles.subheader}>
            <div className={styles.filters}>
              <SearchFilter
                mobile={false}
                label={query.age.length === 0 ? t("Recherche.filterAge", "Tranche d'âge") : ageDisplayedValue}
                selected={query.age}
                //@ts-ignore
                setSelected={(selected: AgeOptions[]) => addToQuery({ age: selected as AgeOptions[] })}
                options={ageFilters.map((filter) => ({ ...filter, value: t(filter.value) }))}
                gaType="age"
              />
              <SearchFilter
                mobile={false}
                label={
                  query.frenchLevel.length === 0
                    ? t("Recherche.filterFrenchLevel", "Niveau de français")
                    : frenchLevelDisplayedValue
                }
                selected={query.frenchLevel}
                //@ts-ignore
                setSelected={(selected: FrenchOptions[]) => addToQuery({ frenchLevel: selected as FrenchOptions[] })}
                options={frenchLevelFilter.map((filter) => ({ ...filter, value: t(filter.value) }))}
                gaType="frenchLevel"
              />
              <SearchFilter
                mobile={false}
                label={
                  query.language.length === 0
                    ? t("Recherche.filterLanguage", "Fiches traduites en")
                    : languageDisplayedValue
                }
                selected={query.language}
                setSelected={(selected: string[]) => addToQuery({ language: selected as string[] })}
                options={languages.map((ln) => ({
                  key: ln.i18nCode,
                  value: (
                    <>
                      <i
                        className={cls(styles.flag, `flag-icon flag-icon-${ln.langueCode}`)}
                        title={ln.langueCode}
                        id={ln.langueCode}
                      />
                      {ln.langueFr}
                    </>
                  )
                }))}
                gaType="language"
              />
            </div>
            <Button className={styles.reset} onClick={resetFilters}>
              <EVAIcon name="refresh-outline" fill="white" className="mr-2" />
              {t("Recherche.resetFilters", "Effacer tous les filtres")}
            </Button>
          </div>
        )}
      </Container>

      {searchFocused /* search backdrop placed here to cover only header */ && (
        <div className={cls(styles.backdrop, styles.search)} onClick={() => setSearchFocused(false)} />
      )}
    </div>
  );
};

export default SearchHeaderDesktop;
