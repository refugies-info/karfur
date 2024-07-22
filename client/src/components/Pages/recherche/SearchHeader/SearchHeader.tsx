import { useCallback, useEffect, useState } from "react";
import { Container } from "reactstrap";
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

const SCROLL_LIMIT = 500;

interface Props {
  nbResults: number;
}

const SearchHeader = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();

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
      setScrolled(!!overScrollLimit);
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
      <div className={styles.title}>
        <Container>
          <h1>{t("Recherche.title")}</h1>
          <p>{t("Recherche.subtitle", { count: props.nbResults })}</p>
        </Container>
      </div>
      <div className={styles.filters}>
        <div className={cls(styles.stickybar, scrolled && styles.scrolled)}>
          <Filters {...filterProps} isSmall={scrolled} />
        </div>
      </div>

      <ResultsFilter />
    </>
  );
};

export default SearchHeader;
