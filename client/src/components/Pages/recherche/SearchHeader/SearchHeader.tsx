import React, { useEffect, useState } from "react";
import styles from "./SearchHeader.module.scss";
import { Button, Container, Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import SearchInput from "../SearchInput";
import ThemeDropdown from "../ThemeDropdown";
import { ObjectId } from "mongodb";
import LocationDropdown from "../LocationDropdown";

import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

type Prediction = {
  place_id: string;
  description: string;
};

interface Props {}

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

  return (
    <div className={styles.container}>
      <Container>
        <h1 className="h3 text-white">135 fiches disponibles pour votre recherche</h1>
        <div className={styles.filters}>
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
      </Container>
    </div>
  );
};

export default SearchHeader;
