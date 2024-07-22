import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import { useScrollDirection } from "hooks/useScrollDirection";
import useWindowSize from "hooks/useWindowSize";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import ResultsFilter from "../ResultsFilter";
import Filters from "./Filters";
import styles from "./SearchHeader.module.scss";

const SCROLL_LIMIT = parseInt(styles.scrollLimit.replace("px", ""));

interface Props {
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
    [dispatch],
  );

  // KEYWORD
  const onChangeSearchInput = useCallback(
    (e: any) => {
      dispatch(addToQueryActionCreator({ search: e.target.value }));
      Event("USE_SEARCH", "use keyword filter", "use searchbar");
    },
    [dispatch],
  );
  const resetSearch = useCallback(() => addToQuery({ search: "" }), [addToQuery]);

  // THEMES
  const [themeSearch, setThemeSearch] = useState("");
  const resetThemeSearch = useCallback(() => setThemeSearch(""), []);

  const onChangeThemeInput = useCallback((e: any) => {
    setThemeSearch(e.target.value);
    Event("USE_SEARCH", "use theme filter", "use searchbar");
  }, []);
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
    [setLocationSearch],
  );
  const resetDepartment = useCallback(() => {
    setLocationSearch("");
    addToQuery({ departments: [], sort: "date" });
  }, [setLocationSearch, addToQuery]);

  // SCROLL
  const [scrolled, setScrolled] = useState(true);
  const [_scrollDirection, overScrollLimit] = useScrollDirection(SCROLL_LIMIT);
  useEffect(() => {
    if (!isMobile) {
      const newScrolled = !!overScrollLimit;
      setScrolled(newScrolled);
    }
  }, [overScrollLimit, isMobile]);

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
  };

  return (
    <>
      {scrolled ? (
        <div className={cls(styles.scrolled, styles.container)}>
          <Filters {...filterProps} isSmall />
        </div>
      ) : (
        <div ref={headerRef} className={styles.container}>
          {/* TODO: design big search */}
          <Filters {...filterProps} />
        </div>
      )}

      <ResultsFilter />
    </>
  );
};

export default SearchHeader;
