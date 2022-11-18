import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
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
import { SecondaryFilterOptions } from "../SecondaryFilter/SecondaryFilter";

interface Props {
  nbResults: number;
  themeDisplayedValue: string;

  // focusedStateProps
  locationFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
  searchFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
  themesFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];

  // filterProps
  isPlacePredictionsLoading: boolean;
  placePredictions: any[];
  onSelectPrediction: (placeId: string) => void;
  locationSearch: string;
  themeSearch: string;
  resetDepartment: () => void;
  resetTheme: () => void;
  resetSearch: () => void;
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

const SearchHeaderMobile = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    themeDisplayedValue,
    isPlacePredictionsLoading,
    placePredictions,
    locationSearch,
    themeSearch,
    onSelectPrediction,
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

  // state from SearchHeader
  const [searchFocused, setSearchFocused] = props.searchFocusedState;

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch]
  );

  // LOCATION
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = useCallback(
    () =>
      setLocationOpen((prevState) => {
        if (!prevState) Event("USE_SEARCH", "open filter", "location");
        return !prevState;
      }),
    [setLocationOpen]
  );

  // THEME
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleThemes = useCallback(
    () =>
      setThemesOpen((prevState) => {
        if (!prevState) Event("USE_SEARCH", "open filter", "theme");
        return !prevState;
      }),
    [setThemesOpen]
  );

  // FILTERS
  const [showFilters, setShowFilters] = useState(false);
  const nbFilters = query.age.length + query.frenchLevel.length + query.language.length;
  const toggleFilters = useCallback(
    () =>
      setShowFilters((prevState) => {
        if (!prevState) Event("USE_SEARCH", "open filter", "mobile filters");
        return !prevState;
      }),
    [setShowFilters]
  );
  const resetFilters = useCallback(() => {
    addToQuery({ age: [], frenchLevel: [], language: [] });
  }, [addToQuery]);

  // hide axeptio button when popup opens
  useEffect(() => {
    if (showFilters || locationOpen || themesOpen) {
      if (window.hideAxeptioButton) window.hideAxeptioButton();
    } else {
      if (window.showAxeptioButton) window.showAxeptioButton();
    }
  }, [locationOpen, themesOpen, showFilters]);

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
                onChange={onChangeSearchInput}
                inputValue={query.search}
                value={query.search}
                placeholder={t("Recherche.keywordPlaceholder", "Mission locale, titre de séjour...")}
                resetFilter={resetSearch}
                focusout={true}
              />
            </Button>
          </div>
        </Container>
      </div>
      <div className={styles.secondary_container}>
        <Dropdown isOpen={locationOpen} toggle={toggleLocation} className={cls(styles.dropdown, styles.separator)}>
          <DropdownToggle>
            <SearchInput
              label={t("Dispositif.Département", "Département")}
              icon={query.departments.length > 0 ? "pin" : "pin-outline"}
              active={locationOpen}
              setActive={() => {}}
              onChange={onChangeDepartmentInput}
              inputValue={locationSearch}
              loading={isPlacePredictionsLoading}
              value={query.departments.join(", ")}
              placeholder={t("Dispositif.Département", "Département")}
              smallIcon={true}
              noInput={true}
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile
              title={t("Dispositif.Départements", "Départements")}
              icon="pin-outline"
              close={toggleLocation}
              reset={resetDepartment}
              nbResults={props.nbResults}
            >
              <div className={styles.content}>
                <div className={styles.input}>
                  <EVAIcon name="search-outline" fill="dark" size={20} />
                  <input
                    type="text"
                    placeholder={t("Dispositif.Département", "Département")}
                    onChange={onChangeDepartmentInput}
                    value={locationSearch}
                    autoFocus
                  />
                </div>
              </div>
              <LocationDropdown predictions={placePredictions} onSelectPrediction={onSelectPrediction} mobile={true} />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>

        <Dropdown isOpen={themesOpen} toggle={toggleThemes} className={styles.dropdown}>
          <DropdownToggle>
            <SearchInput
              label={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              active={themesOpen}
              setActive={() => {}}
              onChange={onChangeThemeInput}
              inputValue={themeSearch}
              value={themeDisplayedValue}
              placeholder={t("Recherche.themes", "Thèmes")}
              smallIcon={true}
              noInput={true}
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu} persist>
            <DropdownMenuMobile
              title={t("Recherche.themes", "Thèmes")}
              icon="list-outline"
              close={toggleThemes}
              reset={resetTheme}
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
              <ThemeDropdown search={themeSearch} mobile={true} isOpen={themesOpen} />
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
                reset={resetFilters}
                nbResults={props.nbResults}
              >
                <div className={cls(styles.content, styles.more_filters)}>
                  <SecondaryFilter
                    mobile={true}
                    label={t("Recherche.filterAge", "Tranche d'âge")}
                    selected={query.age}
                    //@ts-ignore
                    setSelected={selectAgeOption}
                    options={ageOptions}
                    gaType="age"
                  />
                  <SecondaryFilter
                    mobile={true}
                    label={t("Recherche.filterFrenchLevel", "Niveau de français")}
                    selected={query.frenchLevel}
                    //@ts-ignore
                    setSelected={selectFrenchLevelOption}
                    options={frenchLevelOptions}
                    gaType="frenchLevel"
                  />
                  <SecondaryFilter
                    mobile={true}
                    label={t("Recherche.filterLanguage", "Fiches traduites en")}
                    selected={query.language}
                    setSelected={selectLanguageOption}
                    options={languagesOptions}
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
