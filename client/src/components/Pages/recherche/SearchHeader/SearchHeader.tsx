import React, { useState } from "react";
import styles from "./SearchHeader.module.scss";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import { ObjectId } from "mongodb";
import LocationDropdown from "../LocationDropdown";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import SearchFilter from "../SearchFilter";
import { ageFilters, frenchLevelFilter } from "data/searchFilters";
import { useSelector } from "react-redux";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

interface Props {
  nbResults: number
}

const SearchHeader = (props: Props) => {
  // SEARCH
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // THEMES
  const [themesFocused, setThemesFocused] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const toggleThemes = () => setThemesOpen((prevState) => !prevState);
  const [needsSelected, setNeedsSelected] = useState<ObjectId[]>([]);

  // LOCATION
  const [locationFocused, setLocationFocused] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const toggleLocation = () => setLocationOpen((prevState) => !prevState);
  const [departmentsSelected, setDepartmentsSelected] = useState<string[]>([]);

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

  // FILTERS
  const languages = useSelector(allLanguesSelector);

  const [filterAge, setFilterAge] = useState<string[]>([]);
  const [filterFrenchLevel, setFilterFrenchLevel] = useState<string[]>([]);
  const [filterLanguage, setFilterLanguage] = useState<string[]>([]);

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
                onChange={(evt) => getPlacePredictions({ input: evt.target.value })}
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
                value={needsSelected.join(", ")}
                placeholder="Tous"
              />
            </DropdownToggle>
            <DropdownMenu>
              <ThemeDropdown needsSelected={needsSelected} setNeedsSelected={setNeedsSelected} />
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
                value={search}
                placeholder="Mission locale, titre de séjour..."
              />
            </Button>
          </div>
        </div>

        <div className={styles.subheader}>
          <div className={styles.filters}>
            <SearchFilter
              label={filterAge.length === 0 ? "Tranche d'âge" : filterAge.join(", ")}
              selected={filterAge}
              setSelected={setFilterAge}
              options={ageFilters}
            />
            <SearchFilter
              label={filterFrenchLevel.length === 0 ? "Niveau de français" : filterFrenchLevel.join(", ")}
              selected={filterFrenchLevel}
              setSelected={setFilterFrenchLevel}
              options={frenchLevelFilter}
            />
            <SearchFilter
              label={filterLanguage.length === 0 ? "Fiches traduites en" : filterLanguage.join(", ")}
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
