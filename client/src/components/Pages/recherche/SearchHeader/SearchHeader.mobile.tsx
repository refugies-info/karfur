import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import LocationDropdown from "../LocationDropdown";
import SecondaryFilter from "../SecondaryFilter";
import DropdownMenuMobile from "../DropdownMenuMobile";
import styles from "./SearchHeader.mobile.module.scss";

interface Props {
  nbResults: number;
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

const SearchHeaderMobile = (props: Props) => {
  const { t } = useTranslation();
  const { themeDisplayedValue, isPlacePredictionsLoading, placePredictions, onSelectPrediction } = props;
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);

  // state from SearchHeader
  const [locationFocused, setLocationFocused] = props.locationFocusedState;
  const [searchFocused, setSearchFocused] = props.searchFocusedState;
  const [locationSearch, setLocationSearch] = props.locationSearchState;
  const [themeSearch, setThemeSearch] = props.themeSearchState;
  const [themesFocused, setThemesFocused] = props.themesFocusedState;

  const [locationOpen, setLocationOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleLocation = () =>
    setLocationOpen((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "location");
      return !prevState;
    });
  const toggleThemes = () =>
    setThemesOpen((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "theme");
      return !prevState;
    });

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

  // FILTERS
  const [showFilters, setShowFilters] = useState(false);
  const languages = useSelector(allLanguesSelector);
  const nbFilters = query.age.length + query.frenchLevel.length + query.language.length;
  const toggleFilters = () =>
    setShowFilters((prevState) => {
      if (!prevState) Event("USE_SEARCH", "open filter", "mobile filters");
      return !prevState;
    });

  // hide axeptio button when popup opens
  useEffect(() => {
    if (showFilters || locationOpen || themesOpen) {
      if (window.hideAxeptioButton) window.hideAxeptioButton();
    } else {
      if (window.showAxeptioButton) window.showAxeptioButton();
    }
  }, [locationOpen, themesOpen, showFilters]);

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch]
  );

  return (
    <>
      <div className={styles.container}>
        <Container>
          <div className={styles.inputs}>
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
                resetFilter={() => addToQuery({ search: "" })}
              />
            </Button>
          </div>
        </Container>
      </div>
      <div className={styles.secondary_container}>
        <Dropdown
          isOpen={locationOpen || locationFocused}
          toggle={toggleLocation}
          className={cls(styles.dropdown, styles.separator)}
        >
          <DropdownToggle>
            <SearchInput
              label={t("Dispositif.Département", "Département")}
              icon="pin-outline"
              active={locationOpen || locationFocused}
              setActive={setLocationFocused}
              onChange={(evt) => setLocationSearch(evt.target.value)}
              inputValue={locationSearch}
              loading={isPlacePredictionsLoading}
              value={query.departments.join(", ")}
              placeholder={t("Dispositif.Département", "Département")}
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile
              title={t("Dispositif.Départements", "Départements")}
              icon="pin-outline"
              close={toggleLocation}
              reset={() => addToQuery({ departments: [] })}
              nbResults={props.nbResults}
            >
              <div className={styles.content}>
                <div className={styles.input}>
                  <EVAIcon name="search-outline" fill="dark" size={20} />
                  <input
                    type="text"
                    placeholder={t("Dispositif.Département", "Département")}
                    onChange={(evt) => setLocationSearch(evt.target.value)}
                    value={locationSearch}
                    autoFocus
                  />
                </div>
              </div>
              <LocationDropdown
                predictions={placePredictions}
                onSelectPrediction={(id: string) => {
                  onSelectPrediction(id);
                  setLocationSearch("");
                }}
                mobile={true}
              />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>

        <Dropdown isOpen={themesOpen || themesFocused} toggle={toggleThemes} className={styles.dropdown}>
          <DropdownToggle>
            <SearchInput
              label={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              active={themesFocused || themesOpen}
              setActive={setThemesFocused}
              onChange={(evt) => setThemeSearch(evt.target.value)}
              inputValue={themeSearch}
              value={themeDisplayedValue}
              placeholder={t("Recherche.themes", "Thèmes")}
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile
              title={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              close={toggleThemes}
              reset={() => {
                addToQuery({ needs: [], themes: [] });
              }}
              nbResults={props.nbResults}
            >
              <div className={styles.content}>
                <div className={styles.input}>
                  <EVAIcon name="search-outline" fill="dark" size={20} />
                  <input
                    type="text"
                    placeholder={t("Recherche.themesPlaceholder", "Rechercher dans les thèmes")}
                    onChange={onChangeThemeInput}
                    value={themeSearch}
                  />
                </div>
              </div>
              <ThemeDropdown search={themeSearch} mobile={true} />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>

        <div className={styles.right}>
          <Dropdown isOpen={showFilters} toggle={toggleFilters} className={cls(styles.dropdown, styles.filters)}>
            <DropdownToggle>
              <EVAIcon name="options-2-outline" fill="white" />
              {nbFilters > 0 && <span className={styles.badge}>{nbFilters}</span>}
            </DropdownToggle>
            <DropdownMenu className={styles.menu}>
              <DropdownMenuMobile
                title={t("Recherche.filters", "Filtres de recherche")}
                icon="options-2-outline"
                close={toggleFilters}
                reset={() => {
                  addToQuery({ age: [], frenchLevel: [], language: [] });
                }}
                nbResults={props.nbResults}
              >
                <div className={cls(styles.content, styles.more_filters)}>
                  <SecondaryFilter
                    mobile={true}
                    label={t("Recherche.filterAge", "Tranche d'âge")}
                    selected={query.age}
                    //@ts-ignore
                    setSelected={(selected: AgeOptions[]) => addToQuery({ age: selected as AgeOptions[] })}
                    options={ageFilters.map((filter) => ({ ...filter, value: t(filter.value) }))}
                    gaType="age"
                  />
                  <SecondaryFilter
                    mobile={true}
                    label={t("Recherche.filterFrenchLevel", "Niveau de français")}
                    selected={query.frenchLevel}
                    //@ts-ignore
                    setSelected={(selected: FrenchOptions[]) =>
                      addToQuery({ frenchLevel: selected as FrenchOptions[] })
                    }
                    options={frenchLevelFilter.map((filter) => ({ ...filter, value: t(filter.value) }))}
                    gaType="frenchLevel"
                  />
                  <SecondaryFilter
                    mobile={true}
                    label={t("Recherche.filterLanguage", "Fiches traduites en")}
                    selected={query.language}
                    setSelected={(selected: string[]) => addToQuery({ language: selected as string[] })}
                    options={languages.map((ln) => ({
                      key: ln.i18nCode,
                      value: (
                        <>
                          <i
                            className={`flag-icon flag-icon-${ln.langueCode}`}
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
              </DropdownMenuMobile>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default SearchHeaderMobile;
