import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ObjectId } from "mongodb";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import { Theme } from "types/interface";
import useLocale from "hooks/useLocale";
import SearchHeaderMobile from "./SearchHeader.mobile";
import SearchHeaderDesktop from "./SearchHeader.desktop";
import useWindowSize from "hooks/useWindowSize";

interface Props {
  searchMinified: boolean;
  nbResults: number;
  themesDisplayed: Theme[];
  resetFilters: () => void;

  searchState: [string, Dispatch<SetStateAction<string>>];
  needsSelectedState: [ObjectId[], Dispatch<SetStateAction<ObjectId[]>>];
  themesSelectedState: [ObjectId[], Dispatch<SetStateAction<ObjectId[]>>];
  departmentsSelectedState: [string[], Dispatch<SetStateAction<string[]>>];
  filterAgeState: [AgeOptions[], Dispatch<SetStateAction<AgeOptions[]>>];
  filterFrenchLevelState: [FrenchOptions[], Dispatch<SetStateAction<FrenchOptions[]>>];
  filterLanguageState: [string[], Dispatch<SetStateAction<string[]>>];
}

const SearchHeader = (props: Props) => {
  const { resetFilters } = props;
  const locale = useLocale();

  const [search, setSearch] = props.searchState;
  const [needsSelected, setNeedsSelected] = props.needsSelectedState;
  const [themesSelected, setThemesSelected] = props.themesSelectedState;
  const [departmentsSelected, setDepartmentsSelected] = props.departmentsSelectedState;
  const [filterAge, setFilterAge] = props.filterAgeState;
  const [filterFrenchLevel, setFilterFrenchLevel] = props.filterFrenchLevelState;
  const [filterLanguage, setFilterLanguage] = props.filterLanguageState;

  // KEYWORD
  const [searchFocused, setSearchFocused] = useState(false);

  // THEMES
  const [themesFocused, setThemesFocused] = useState(false);
  const [themeSearch, setThemeSearch] = useState("");
  const [themeDisplayedValue, setThemeDisplayedValue] = useState("");

  useEffect(() => {
    setThemeDisplayedValue(props.themesDisplayed.map((t) => t.short[locale] || t.short.fr).join(", "));
  }, [props.themesDisplayed, locale]);

  // LOCATION
  const [locationFocused, setLocationFocused] = useState(false);
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
        let depName = placeDetails?.address_components?.[1].long_name;
        if (depName === "Département de Paris") depName = "Paris"; // specific case to fix google API
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

  const { isMobile } = useWindowSize();

  return (
    <>
      {!isMobile ? (
        <SearchHeaderDesktop
          searchMinified={props.searchMinified}
          nbResults={props.nbResults}
          themesDisplayed={props.themesDisplayed}
          searchState={[search, setSearch]}
          needsSelectedState={[needsSelected, setNeedsSelected]}
          themesSelectedState={[themesSelected, setThemesSelected]}
          departmentsSelectedState={[departmentsSelected, setDepartmentsSelected]}
          filterAgeState={[filterAge, setFilterAge]}
          filterFrenchLevelState={[filterFrenchLevel, setFilterFrenchLevel]}
          filterLanguageState={[filterLanguage, setFilterLanguage]}
          locationFocusedState={[locationFocused, setLocationFocused]}
          searchFocusedState={[searchFocused, setSearchFocused]}
          locationSearchState={[locationSearch, setLocationSearch]}
          themeSearchState={[themeSearch, setThemeSearch]}
          themesFocusedState={[themesFocused, setThemesFocused]}
          resetFilters={resetFilters}
          isPlacePredictionsLoading={isPlacePredictionsLoading}
          placePredictions={placePredictions}
          onSelectPrediction={onSelectPrediction}
          themeDisplayedValue={themeDisplayedValue}
        />
      ) : (
        <SearchHeaderMobile
          searchState={[search, setSearch]}
          needsSelectedState={[needsSelected, setNeedsSelected]}
          themesSelectedState={[themesSelected, setThemesSelected]}
          departmentsSelectedState={[departmentsSelected, setDepartmentsSelected]}
          filterAgeState={[filterAge, setFilterAge]}
          filterFrenchLevelState={[filterFrenchLevel, setFilterFrenchLevel]}
          filterLanguageState={[filterLanguage, setFilterLanguage]}
          locationFocusedState={[locationFocused, setLocationFocused]}
          searchFocusedState={[searchFocused, setSearchFocused]}
          locationSearchState={[locationSearch, setLocationSearch]}
          themeSearchState={[themeSearch, setThemeSearch]}
          themesFocusedState={[themesFocused, setThemesFocused]}
          isPlacePredictionsLoading={isPlacePredictionsLoading}
          placePredictions={placePredictions}
          onSelectPrediction={onSelectPrediction}
          themeDisplayedValue={themeDisplayedValue}
        />
      )}
    </>
  );
};

export default SearchHeader;
