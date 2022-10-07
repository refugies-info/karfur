import React, { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { ObjectId } from "mongodb";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { cls } from "lib/classname";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import LocationDropdown from "../LocationDropdown";
import SearchFilter from "../SearchFilter";
import DropdownMenuMobile from "../DropdownMenuMobile";
import styles from "./SearchHeader.mobile.module.scss";

interface Props {
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

const SearchHeaderMobile = (props: Props) => {
  const { t } = useTranslation();
  const {
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
  const [showFilters, setShowFilters] = useState(false);
  const languages = useSelector(allLanguesSelector);
  const nbFilters = filterAge.length + filterFrenchLevel.length + filterLanguage.length;

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
                onChange={(evt) => setSearch(evt.target.value)}
                inputValue={search}
                value={search}
                placeholder={t("Recherche.keywordPlaceholder", "Mission locale, titre de séjour...")}
              />
            </Button>
          </div>
        </Container>
      </div>
      <div className={styles.secondary_container}>
        <Dropdown isOpen={locationOpen || locationFocused} toggle={toggleLocation} className={styles.dropdown}>
          <DropdownToggle>
            <SearchInput
              label={t("Dispositif.Département", "Département")}
              icon="pin-outline"
              active={locationOpen || locationFocused}
              setActive={setLocationFocused}
              onChange={(evt) => setLocationSearch(evt.target.value)}
              inputValue={locationSearch}
              loading={isPlacePredictionsLoading}
              value={departmentsSelected.join(", ")}
              placeholder={t("Dispositif.Département", "Département")}
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile
              title={t("Dispositif.Départements", "Départements")}
              icon="pin-outline"
              close={toggleLocation}
              reset={() => setDepartmentsSelected([])}
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
                departmentsSelected={departmentsSelected}
                setDepartmentsSelected={setDepartmentsSelected}
                predictions={placePredictions}
                onSelectPrediction={onSelectPrediction}
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
                setNeedsSelected([]);
                setThemesSelected([]);
              }}
            >
              <div className={styles.content}>
                <div className={styles.input}>
                  <EVAIcon name="search-outline" fill="dark" size={20} />
                  <input
                    type="text"
                    placeholder={t("Recherche.themesPlaceholder", "Rechercher dans les thèmes")}
                    onChange={(evt) => setThemeSearch(evt.target.value)}
                    value={themeSearch}
                    autoFocus
                  />
                </div>
              </div>
              <ThemeDropdown
                needsSelected={needsSelected}
                setNeedsSelected={setNeedsSelected}
                themesSelected={themesSelected}
                setThemesSelected={setThemesSelected}
                search={themeSearch}
                mobile={true}
              />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>
        <div className={styles.right}>
          <Dropdown
            isOpen={showFilters}
            toggle={() => setShowFilters(!showFilters)}
            className={cls(styles.dropdown, styles.filters)}
          >
            <DropdownToggle>
              <EVAIcon name="options-2-outline" fill="white" />
              {nbFilters > 0 && <span className={styles.badge}>{nbFilters}</span>}
            </DropdownToggle>
            <DropdownMenu className={styles.menu}>
              <DropdownMenuMobile
                title={t("Recherche.filters", "Filtres de recherche")}
                icon="options-2-outline"
                close={() => setShowFilters(!showFilters)}
                reset={() => {
                  setFilterAge([]);
                  setFilterFrenchLevel([]);
                  setFilterLanguage([]);
                }}
              >
                <div className={cls(styles.content, styles.more_filters)}>
                  <SearchFilter
                    mobile={true}
                    label={t("Recherche.filterAge", "Tranche d'âge")}
                    selected={filterAge}
                    setSelected={setFilterAge}
                    options={ageFilters.map(filter => ({...filter, value: t(filter.value)}))}
                  />
                  <SearchFilter
                    mobile={true}
                    label={t("Recherche.filterFrenchLevel", "Niveau de français")}
                    selected={filterFrenchLevel}
                    setSelected={setFilterFrenchLevel}
                    options={frenchLevelFilter.map(filter => ({...filter, value: t(filter.value)}))}
                  />
                  <SearchFilter
                    mobile={true}
                    label={t("Recherche.filterLanguage", "Fiches traduites en")}
                    selected={filterLanguage}
                    setSelected={setFilterLanguage}
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
