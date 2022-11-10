import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ObjectId } from "mongodb";
import { throttle } from "lodash";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { AgeOptions, FrenchOptions, SortOptions, TypeOptions } from "data/searchFilters";
import { Theme } from "types/interface";
import useLocale from "hooks/useLocale";
import { cls } from "lib/classname";
import SearchHeaderMobile from "./SearchHeader.mobile";
import SearchHeaderDesktop from "./SearchHeader.desktop";
import useWindowSize from "hooks/useWindowSize";
import ResultsFilter from "../ResultsFilter";
import styles from "./SearchHeader.module.scss";

const SCROLL_LIMIT = parseInt(styles.scrollLimit.replace("px", ""));

interface Props {
  searchMinified: boolean;
  nbResults: number;
  themesDisplayed: Theme[];
  resetFilters: () => void;
  nbDemarches: number;
  nbDispositifs: number;

  searchState: [string, Dispatch<SetStateAction<string>>];
  needsSelectedState: [ObjectId[], Dispatch<SetStateAction<ObjectId[]>>];
  themesSelectedState: [ObjectId[], Dispatch<SetStateAction<ObjectId[]>>];
  departmentsSelectedState: [string[], Dispatch<SetStateAction<string[]>>];
  filterAgeState: [AgeOptions[], Dispatch<SetStateAction<AgeOptions[]>>];
  filterFrenchLevelState: [FrenchOptions[], Dispatch<SetStateAction<FrenchOptions[]>>];
  filterLanguageState: [string[], Dispatch<SetStateAction<string[]>>];
  selectedSortState: [SortOptions, Dispatch<SetStateAction<SortOptions>>];
  selectedTypeState: [TypeOptions, Dispatch<SetStateAction<TypeOptions>>];
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
  const [selectedSort, setSelectedSort] = props.selectedSortState;
  const [selectedType, setSelectedType] = props.selectedTypeState;

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
      types: ["administrative_area_level_2", "locality", "postal_code"]
    }
  });

  const onSelectPrediction = (place_id: string) => {
    placesService?.getDetails({ placeId: place_id }, (placeDetails) => {
      const departement = (placeDetails?.address_components || []).find((comp) =>
        comp.types.includes("administrative_area_level_2")
      );
      let depName = departement?.long_name;
      if (depName === "Département de Paris") depName = "Paris"; // specific case to fix google API
      if (depName) {
        setDepartmentsSelected((deps) => {
          return [...new Set(depName ? [...deps, depName] : [...deps])];
        });
      }
    });
  };

  useEffect(() => {
    if (locationSearch) {
      getPlacePredictions({ input: locationSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationSearch]);

  const { isMobile } = useWindowSize();

  // SCROLL
  const [scrolled, setScrolled] = useState(true);
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (window.scrollY <= SCROLL_LIMIT) setScrolled(false);
      else if (window.scrollY >= SCROLL_LIMIT) setScrolled(true);
    }, 200);
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {scrolled && <div className={styles.placeholder}></div>}
      <div className={cls(scrolled && `${styles.scrolled} scrolled`)}>
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
            nbResults={props.nbResults}
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

        {!props.searchMinified && (
          <ResultsFilter
            nbDemarches={props.nbDemarches}
            nbDispositifs={props.nbDispositifs}
            nbThemesSelected={props.themesDisplayed.length}
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showSort={!search}
          />
        )}
      </div>
    </>
  );
};

export default SearchHeader;
