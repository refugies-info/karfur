import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./SearchHeader.module.scss";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import { ObjectId } from "mongodb";
import LocationDropdown from "../LocationDropdown";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import SearchFilter from "../SearchFilter";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Theme } from "types/interface";

interface Props {
  nbResults: number;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  needsSelected: ObjectId[];
  setNeedsSelected: Dispatch<SetStateAction<ObjectId[]>>;
  themesSelected: Theme[];
  departmentsSelected: string[];
  setDepartmentsSelected: Dispatch<SetStateAction<string[]>>;
  filterAge: AgeOptions[];
  setFilterAge:Dispatch<SetStateAction<AgeOptions[]>>;
  filterFrenchLevel: FrenchOptions[];
  setFilterFrenchLevel:Dispatch<SetStateAction<FrenchOptions[]>>;
  filterLanguage: string[];
  setFilterLanguage: Dispatch<SetStateAction<string[]>>;
}

const SearchHeader = (props: Props) => {
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
    setFilterLanguage,
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
    setThemeDisplayedValue(props.themesSelected.map(t => t.short.fr).join(", "))
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
      getPlacePredictions({ input: locationSearch })
    }
  }, [locationSearch, getPlacePredictions]);

  // FILTERS
  const languages = useSelector(allLanguesSelector);

  const [ageDisplayedValue, setAgeDisplayedValue] = useState("");
  useEffect(() => {
    if (filterAge.length) {
      const value = filterAge.map(option => ageFilters.find(a => a.key === option)?.value).join(", ");
      setAgeDisplayedValue(value);
    }
  }, [filterAge]);

  const [frenchLevelDisplayedValue, setFrenchLevelDisplayedValue] = useState("");
    useEffect(() => {
    if (filterFrenchLevel.length) {
      const value = filterFrenchLevel.map(option => frenchLevelFilter.find(a => a.key === option)?.value).join(", ");
      setFrenchLevelDisplayedValue(value);
    }
    }, [filterFrenchLevel]);

  const [languageDisplayedValue, setLanguageDisplayedValue] = useState("");
  useEffect(() => {
    if (filterLanguage.length) {
      const value = filterLanguage.map(option => languages.find(a => a.i18nCode === option)?.langueFr).join(", ");
      setLanguageDisplayedValue(value);
    }
  }, [filterLanguage, languages]);

  const resetFilters = () => {
    setSearch("");
    setNeedsSelected([]);
    setDepartmentsSelected([]);
    setFilterAge([]);
    setFilterFrenchLevel([]);
    setFilterLanguage([]);
  }

  return (
    <div className={styles.container}>
      <Container>
        <h1 className="h3 text-white">{props.nbResults} fiches disponibles pour votre recherche</h1>
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
              />
            </DropdownToggle>
            <DropdownMenu>
              <ThemeDropdown
                needsSelected={needsSelected}
                setNeedsSelected={setNeedsSelected}
                search={themeSearch}
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
              />
            </Button>
          </div>
        </div>

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
              options={languages.map((ln) => ({ key: ln.i18nCode, value: ln.langueFr }))}
            />
          </div>
          <Button
            className={styles.reset}
            onClick={resetFilters}
          >
            <EVAIcon
              name="refresh-outline"
              fill="white"
              className="mr-2"
            />
            Effacer tous les filtres
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default SearchHeader;
