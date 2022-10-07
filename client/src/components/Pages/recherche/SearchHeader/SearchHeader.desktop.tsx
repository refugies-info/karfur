import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { ObjectId } from "mongodb";
import { Theme } from "types/interface";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { allLanguesSelector } from "services/Langue/langue.selectors";
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
  themeDisplayedValue: string
  isPlacePredictionsLoading: boolean
  placePredictions: any[]
  onSelectPrediction: (place_id: string) => void

  // state from recherche
  searchState: [string, Dispatch<SetStateAction<string>>];
  needsSelectedState: [ObjectId[], Dispatch<SetStateAction<ObjectId[]>>];
  themesSelectedState: [ObjectId[], Dispatch<SetStateAction<ObjectId[]>>];
  departmentsSelectedState: [string[], Dispatch<SetStateAction<string[]>>];
  filterAgeState: [AgeOptions[], Dispatch<SetStateAction<AgeOptions[]>>];
  filterFrenchLevelState: [FrenchOptions[], Dispatch<SetStateAction<FrenchOptions[]>>];
  filterLanguageState: [string[], Dispatch<SetStateAction<string[]>>];

  // state from SearchHeader
  locationFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
  searchFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
  locationSearchState: [string, Dispatch<SetStateAction<string>>];
  themeSearchState: [string, Dispatch<SetStateAction<string>>];
  themesFocusedState: [boolean, Dispatch<SetStateAction<boolean>>];
}

const SearchHeaderDesktop = (props: Props) => {
  const {
    resetFilters,
    themeDisplayedValue,
    isPlacePredictionsLoading,
    placePredictions,
    onSelectPrediction,
  } = props;

  // state from recherche
  const [search, setSearch] = props.searchState;
  const [needsSelected, setNeedsSelected] = props.needsSelectedState;
  const [themesSelected, setThemesSelected] = props.themesSelectedState;
  const [departmentsSelected, setDepartmentsSelected] = props.departmentsSelectedState;
  const [filterAge, setFilterAge] = props.filterAgeState;
  const [filterFrenchLevel, setFilterFrenchLevel] = props.filterFrenchLevelState;
  const [filterLanguage, setFilterLanguage] = props.filterLanguageState;

  // state from SearchHeader
  const [locationFocused, setLocationFocused] = props.locationFocusedState;
  const [searchFocused, setSearchFocused] = props.searchFocusedState;
  const [locationSearch, setLocationSearch] = props.locationSearchState;
  const [themeSearch, setThemeSearch] = props.themeSearchState;
  const [themesFocused, setThemesFocused] = props.themesFocusedState;

  const [locationOpen, setLocationOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleLocation = () => setLocationOpen((prevState) => !prevState);
  const toggleThemes = () => setThemesOpen((prevState) => !prevState);

  // FILTERS
  const languages = useSelector(allLanguesSelector);

  const [ageDisplayedValue, setAgeDisplayedValue] = useState("");
  useEffect(() => {
    if (filterAge.length) {
      const value = filterAge.map((option) => ageFilters.find((a) => a.key === option)?.value).join(", ");
      setAgeDisplayedValue(value);
    }
  }, [filterAge]);

  const [frenchLevelDisplayedValue, setFrenchLevelDisplayedValue] = useState("");
  useEffect(() => {
    if (filterFrenchLevel.length) {
      const value = filterFrenchLevel
        .map((option) => frenchLevelFilter.find((a) => a.key === option)?.value)
        .join(", ");
      setFrenchLevelDisplayedValue(value);
    }
  }, [filterFrenchLevel]);

  const [languageDisplayedValue, setLanguageDisplayedValue] = useState("");
  useEffect(() => {
    if (filterLanguage.length) {
      const value = filterLanguage.map((option) => languages.find((a) => a.i18nCode === option)?.langueFr).join(", ");
      setLanguageDisplayedValue(value);
    }
  }, [filterLanguage, languages]);

  return (
    <div className={styles.container}>
      <Container className={styles.container_inner}>
        {props.searchMinified ? (
          <h1 className="h3 text-white">Trouver l'information parmi nos {props.nbResults} fiches</h1>
        ) : (
          <h1 className="h3 text-white">{props.nbResults} fiches disponibles pour votre recherche</h1>
        )}
        <div className={styles.inputs}>
          <Dropdown isOpen={locationOpen || locationFocused} toggle={toggleLocation} className={styles.dropdown}>
            <DropdownToggle>
              <SearchInput
                label="Département"
                icon="pin-outline"
                active={locationOpen || locationFocused}
                setActive={setLocationFocused}
                onChange={(evt) => setLocationSearch(evt.target.value)}
                inputValue={locationSearch}
                loading={isPlacePredictionsLoading}
                value={departmentsSelected.join(", ")}
                placeholder="Tous"
                resetFilter={() => setDepartmentsSelected([])}
              />
            </DropdownToggle>
            <DropdownMenu>
              <LocationDropdown
                departmentsSelected={departmentsSelected}
                setDepartmentsSelected={setDepartmentsSelected}
                predictions={placePredictions}
                onSelectPrediction={onSelectPrediction}
              />
            </DropdownMenu>
          </Dropdown>

          <Dropdown isOpen={themesOpen || themesFocused} toggle={toggleThemes} className={styles.dropdown}>
            <DropdownToggle>
              <SearchInput
                label="Thèmes"
                icon="list-outline"
                active={themesFocused || themesOpen}
                setActive={setThemesFocused}
                onChange={(evt) => setThemeSearch(evt.target.value)}
                inputValue={themeSearch}
                value={themeDisplayedValue}
                placeholder="Tous"
                resetFilter={() => {
                  setNeedsSelected([]);
                  setThemesSelected([]);
                }}
              />
            </DropdownToggle>
            <DropdownMenu>
              <ThemeDropdown
                needsSelected={needsSelected}
                setNeedsSelected={setNeedsSelected}
                themesSelected={themesSelected}
                setThemesSelected={setThemesSelected}
                search={themeSearch}
                mobile={false}
              />
            </DropdownMenu>
          </Dropdown>

          <div className={styles.dropdown}>
            <Button onClick={() => setSearchFocused(true)}>
              <SearchInput
                label="Mot-clé"
                icon="search-outline"
                active={searchFocused}
                setActive={setSearchFocused}
                onChange={(evt) => setSearch(evt.target.value)}
                inputValue={search}
                value={search}
                placeholder="Mission locale, titre de séjour..."
                focusout
                resetFilter={() => setSearch("")}
              />
            </Button>
          </div>
        </div>

        {!props.searchMinified && (
          <div className={styles.subheader}>
            <div className={styles.filters}>
              <SearchFilter
                label={filterAge.length === 0 ? "Tranche d'âge" : ageDisplayedValue}
                selected={filterAge}
                setSelected={setFilterAge}
                options={ageFilters}
              />
              <SearchFilter
                label={filterFrenchLevel.length === 0 ? "Niveau de français" : frenchLevelDisplayedValue}
                selected={filterFrenchLevel}
                setSelected={setFilterFrenchLevel}
                options={frenchLevelFilter}
              />
              <SearchFilter
                label={filterLanguage.length === 0 ? "Fiches traduites en" : languageDisplayedValue}
                selected={filterLanguage}
                setSelected={setFilterLanguage}
                options={languages.map((ln) => ({
                  key: ln.i18nCode,
                  value: (
                    <>
                      <i className={`flag-icon flag-icon-${ln.langueCode}`} title={ln.langueCode} id={ln.langueCode} />
                      {ln.langueFr}
                    </>
                  )
                }))}
              />
            </div>
            <Button className={styles.reset} onClick={resetFilters}>
              <EVAIcon name="refresh-outline" fill="white" className="mr-2" />
              Effacer tous les filtres
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchHeaderDesktop;
