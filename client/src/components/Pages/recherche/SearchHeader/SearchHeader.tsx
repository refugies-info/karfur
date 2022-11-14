import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "lodash";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Theme } from "types/interface";
import useLocale from "hooks/useLocale";
import { cls } from "lib/classname";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
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
}

const SearchHeader = (props: Props) => {
  const { resetFilters } = props;
  const locale = useLocale();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);

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
        const oldDeps = query.departments;
        dispatch(
          addToQueryActionCreator({
            departments: [...new Set(depName ? [...oldDeps, depName] : [...oldDeps])]
          })
        );
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
          />
        )}
      </div>
    </>
  );
};

export default SearchHeader;
