import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./SearchHeaderMobile.module.scss";
import { Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import { ObjectId } from "mongodb";
import LocationDropdown from "../LocationDropdown";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Theme } from "types/interface";
import SearchFilterMobile from "../SearchFilterMobile";
import { cls } from "lib/classname";
import DropdownMenuMobile from "../DropdownMenuMobile";

interface Props {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  needsSelected: ObjectId[];
  setNeedsSelected: Dispatch<SetStateAction<ObjectId[]>>;
  themesSelected: Theme[];
  departmentsSelected: string[];
  setDepartmentsSelected: Dispatch<SetStateAction<string[]>>;
  filterAge: AgeOptions[];
  setFilterAge: Dispatch<SetStateAction<AgeOptions[]>>;
  filterFrenchLevel: FrenchOptions[];
  setFilterFrenchLevel: Dispatch<SetStateAction<FrenchOptions[]>>;
  filterLanguage: string[];
  setFilterLanguage: Dispatch<SetStateAction<string[]>>;
}

const SearchHeaderMobile = (props: Props) => {
  const {
    search,
    setSearch,
    needsSelected,
    setNeedsSelected,
    departmentsSelected,
    setDepartmentsSelected,
    filterAge,
    setFilterAge,
    filterFrenchLevel,
    setFilterFrenchLevel,
    filterLanguage,
    setFilterLanguage
  } = props;

  // KEYWORD
  const [searchFocused, setSearchFocused] = useState(false);

  // THEMES
  const [themesFocused, setThemesFocused] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleThemes = () => setThemesOpen((prevState) => !prevState);
  const [themeSearch, setThemeSearch] = useState("");
  const [themeDisplayedValue, setThemeDisplayedValue] = useState("");

  useEffect(() => {
    setThemeDisplayedValue(props.themesSelected.map((t) => t.short.fr).join(", "));
  }, [props.themesSelected]);

  // LOCATION
  const [locationFocused, setLocationFocused] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = () => setLocationOpen((prevState) => !prevState);
  const [locationSearch, setLocationSearch] = useState("");

  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
    //@ts-ignore
    options: {
      componentRestrictions: { country: "fr" },
      types: ["(cities)"]
    }
  });

  const onSelectPrediction = (place_id: string) => {
    placesService?.getDetails({ placeId: place_id }, (placeDetails) => {
      setDepartmentsSelected((deps) => {
        const depName = placeDetails?.address_components?.[1].long_name;
        return [...new Set(depName ? [...deps, depName] : [...deps])];
      });
    });
  };

  useEffect(() => {
    if (locationSearch) {
      getPlacePredictions({ input: locationSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationSearch]);

  // FILTERS
  const [showFilters, setShowFilters] = useState(false);
  const languages = useSelector(allLanguesSelector);

  return (
    <>
      <div className={styles.container}>
        <Container>
          <div className={styles.inputs}>
            <SearchInput
              label="Mot-clé"
              icon="search-outline"
              active={searchFocused}
              setActive={setSearchFocused}
              onChange={(evt) => setSearch(evt.target.value)}
              inputValue={search}
              value={search}
              placeholder="Mission locale, titre de séjour..."
            />
          </div>
        </Container>
      </div>
      <div className={styles.secondary_container}>
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
              placeholder="Département"
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile title="Départements" icon="pin-outline" close={toggleLocation}>
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
              label="Thèmes"
              icon="list-outline"
              active={themesFocused || themesOpen}
              setActive={setThemesFocused}
              onChange={(evt) => setThemeSearch(evt.target.value)}
              inputValue={themeSearch}
              value={themeDisplayedValue}
              placeholder="Thèmes"
            />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile title="Thèmes" icon="list-outline" close={toggleThemes}>
              <ThemeDropdown needsSelected={needsSelected} setNeedsSelected={setNeedsSelected} search={themeSearch} />
            </DropdownMenuMobile>
          </DropdownMenu>
        </Dropdown>

        <Dropdown
          isOpen={showFilters}
          toggle={() => setShowFilters(!showFilters)}
          className={cls(styles.dropdown, styles.filters)}
        >
          <DropdownToggle>
            <EVAIcon name="search-outline" fill="white" />
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            <DropdownMenuMobile
              title="Filtres de recherche"
              icon="list-outline"
              close={() => setShowFilters(!showFilters)}
            >
              <div className={styles.subheader}>
                <SearchFilterMobile
                  label="Tranche d'âge"
                  selected={filterAge}
                  setSelected={setFilterAge}
                  options={ageFilters}
                />
                <SearchFilterMobile
                  label="Niveau de français"
                  selected={filterFrenchLevel}
                  setSelected={setFilterFrenchLevel}
                  options={frenchLevelFilter}
                />
                <SearchFilterMobile
                  label="Fiches traduites en"
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
    </>
  );
};

export default SearchHeaderMobile;
