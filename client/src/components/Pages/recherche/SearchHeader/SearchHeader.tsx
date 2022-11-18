import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { Theme } from "types/interface";
import useLocale from "hooks/useLocale";
import { useScrollDirection } from "hooks/useScrollDirection";
import useWindowSize from "hooks/useWindowSize";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import SearchHeaderMobile from "./SearchHeader.mobile";
import SearchHeaderDesktop from "./SearchHeader.desktop";
import ResultsFilter from "../ResultsFilter";
import styles from "./SearchHeader.module.scss";

const SCROLL_LIMIT = parseInt(styles.scrollLimit.replace("px", ""));

interface Props {
  searchMinified: boolean;
  nbResults: number;
  themesDisplayed: Theme[];
  resetFilters: () => void;
}

const SearchHeader = (props: Props) => {
  const { resetFilters } = props;
  const { t } = useTranslation();
  const locale = useLocale();
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();
  const query = useSelector(searchQuerySelector);

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch]
  );

  // KEYWORD
  const [searchFocused, setSearchFocused] = useState(false);
  const onChangeSearchInput = useCallback(
    (e: any) => {
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event("USE_SEARCH", "use keyword filter", "use searchbar");
    },
    [dispatch]
  );
  const resetSearch = useCallback(() => addToQuery({ search: "" }), [addToQuery]);

  // THEMES
  const [themesFocused, setThemesFocused] = useState(false);
  const [themeSearch, setThemeSearch] = useState("");
  const [themeDisplayedValue, setThemeDisplayedValue] = useState("");

  useEffect(() => {
    setThemeDisplayedValue(props.themesDisplayed.map((t) => t.short[locale] || t.short.fr).join(", "));
  }, [props.themesDisplayed, locale]);

  const onChangeThemeInput = useCallback(
    (e: any) => {
      setThemeSearch(e.target.value);
      Event("USE_SEARCH", "use theme filter", "use searchbar");
    },
    [setThemeSearch]
  );
  const resetTheme = useCallback(() => {
    setThemeSearch("");
    addToQuery({ needs: [], themes: [] });
  }, [setThemeSearch, addToQuery]);

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

  const onChangeDepartmentInput = useCallback(
    (e: any) => {
      setLocationSearch(e.target.value);
    },
    [setLocationSearch]
  );
  const resetDepartment = useCallback(() => {
    setLocationSearch("");
    addToQuery({ departments: [] });
  }, [setLocationSearch, addToQuery]);

  const onSelectPrediction = useCallback(
    (id: string) => {
      placesService?.getDetails({ placeId: id }, (placeDetails) => {
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
      setLocationSearch("");
    },
    [dispatch, setLocationSearch, query.departments, placesService]
  );
  useEffect(() => {
    if (locationSearch) {
      getPlacePredictions({ input: locationSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationSearch]);

  // AGE
  const ageOptions = useMemo(() => {
    return ageFilters.map((filter) => ({ ...filter, value: t(filter.value) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selectAgeOption = useCallback(
    (selected: AgeOptions[]) => addToQuery({ age: selected as AgeOptions[] }),
    [addToQuery]
  );

  // FRENCH LEVEL
  const frenchLevelOptions = useMemo(() => {
    return frenchLevelFilter.map((filter) => ({ ...filter, value: t(filter.value) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selectFrenchLevelOption = useCallback(
    (selected: FrenchOptions[]) => addToQuery({ frenchLevel: selected as FrenchOptions[] }),
    [addToQuery]
  );

  // LANGUAGE
  const languages = useSelector(allLanguesSelector);
  const languagesOptions = useMemo(() => {
    return languages.map((ln) => ({
      key: ln.i18nCode,
      value: (
        <>
          <i
            className={cls(!isMobile && styles.flag, `flag-icon flag-icon-${ln.langueCode}`)}
            title={ln.langueCode}
            id={ln.langueCode}
          />
          {ln.langueFr}
        </>
      )
    }));
  }, [languages, isMobile]);
  const selectLanguageOption = useCallback(
    (selected: string[]) => addToQuery({ language: selected as string[] }),
    [addToQuery]
  );

  // SCROLL
  const [scrolled, setScrolled] = useState(true);
  const [scrollDirection, overScrollLimit] = useScrollDirection(SCROLL_LIMIT);
  useEffect(() => {
    setScrolled(() => !!(scrollDirection === "up" && overScrollLimit));
  }, [scrollDirection, overScrollLimit]);

  const focusedStateProps = {
    locationFocusedState: [locationFocused, setLocationFocused] as [boolean, Dispatch<SetStateAction<boolean>>],
    searchFocusedState: [searchFocused, setSearchFocused] as [boolean, Dispatch<SetStateAction<boolean>>],
    themesFocusedState: [themesFocused, setThemesFocused] as [boolean, Dispatch<SetStateAction<boolean>>]
  };
  const filterProps = {
    isPlacePredictionsLoading,
    placePredictions,
    onSelectPrediction,
    locationSearch,
    themeSearch,
    resetDepartment,
    resetTheme,
    resetSearch,
    onChangeDepartmentInput,
    onChangeThemeInput,
    onChangeSearchInput,
    ageOptions,
    frenchLevelOptions,
    languagesOptions,
    selectAgeOption,
    selectFrenchLevelOption,
    selectLanguageOption
  };

  return (
    <>
      {scrolled && <div className={styles.placeholder}></div>}
      <div className={cls(scrolled && `${styles.scrolled} scrolled`)}>
        {!isMobile ? (
          <SearchHeaderDesktop
            searchMinified={props.searchMinified}
            nbResults={props.nbResults}
            themesDisplayed={props.themesDisplayed}
            resetFilters={resetFilters}
            themeDisplayedValue={themeDisplayedValue}
            {...focusedStateProps}
            {...filterProps}
          />
        ) : (
          <SearchHeaderMobile
            nbResults={props.nbResults}
            themeDisplayedValue={themeDisplayedValue}
            {...focusedStateProps}
            {...filterProps}
          />
        )}

        {!props.searchMinified && <ResultsFilter nbThemesSelected={props.themesDisplayed.length} />}
      </div>
    </>
  );
};

export default SearchHeader;
