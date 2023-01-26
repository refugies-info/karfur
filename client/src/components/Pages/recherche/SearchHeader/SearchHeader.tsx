import React, { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useScrollDirection } from "hooks/useScrollDirection";
import useWindowSize from "hooks/useWindowSize";
import { ageFilters, AgeOptions, frenchLevelFilter, FrenchOptions } from "data/searchFilters";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
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
}

const SearchHeader = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();
  const headerRef = useRef<HTMLDivElement | null>(null);

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch]
  );

  // KEYWORD
  const onChangeSearchInput = useCallback(
    (e: any) => {
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event("USE_SEARCH", "use keyword filter", "use searchbar");
    },
    [dispatch]
  );
  const resetSearch = useCallback(() => addToQuery({ search: "" }), [addToQuery]);

  // THEMES
  const [themeSearch, setThemeSearch] = useState("");
  const resetThemeSearch = useCallback(() => setThemeSearch(""), []);

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
  const [locationSearch, setLocationSearch] = useState("");
  const resetLocationSearch = useCallback(() => setLocationSearch(""), []);

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

  // AGE
  const ageOptions = useMemo(() => {
    // @ts-ignore
    return ageFilters.map((filter) => ({ ...filter, value: t(filter.value) as string }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const selectAgeOption = useCallback(
    (selected: AgeOptions[]) => addToQuery({ age: selected as AgeOptions[] }),
    [addToQuery]
  );

  // FRENCH LEVEL
  const frenchLevelOptions = useMemo(() => {
    // @ts-ignore
    return frenchLevelFilter.map((filter) => ({ ...filter, value: t(filter.value) as string }));
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
          <span
            className={cls(!isMobile && styles.flag, `fi fi-${ln.langueCode}`)}
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
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [scrollDirection, overScrollLimit] = useScrollDirection(SCROLL_LIMIT);
  useEffect(() => {
    if (!isMobile) {
      const newScrolled = !!(scrollDirection === "up" && overScrollLimit);
      setScrolled(newScrolled);
      if (newScrolled) {
        setPlaceholderHeight(headerRef.current?.offsetHeight || 0);
      }
    }
  }, [scrollDirection, overScrollLimit, isMobile]);

  const filterProps = {
    locationSearch,
    resetLocationSearch,
    themeSearch,
    resetThemeSearch,
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
      {scrolled && <div className={styles.placeholder} style={{ height: placeholderHeight }}></div>}
      <div ref={headerRef} className={cls(scrolled && `${styles.scrolled} scrolled`)}>
        {!isMobile ? (
          <SearchHeaderDesktop searchMinified={props.searchMinified} nbResults={props.nbResults} {...filterProps} />
        ) : (
          <SearchHeaderMobile nbResults={props.nbResults} {...filterProps} />
        )}

        {!props.searchMinified && <ResultsFilter />}
      </div>
    </>
  );
};

export default SearchHeader;
