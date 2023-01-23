import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import HomeSearchHeaderDesktop from "./HomeSearchHeader.desktop";
import HomeSearchHeaderMobile from "./HomeSearchHeader.mobile";
import { useWindowSize } from "hooks";

interface Props {}

const HomeSearchHeader = (props: Props) => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch]
  );

  // KEYWORD
  const onChangeSearchInput = useCallback(
    (e: any) => dispatch(addToQueryActionCreator({ search: e.target.value })),
    [dispatch]
  );
  const resetSearch = useCallback(() => addToQuery({ search: "" }), [addToQuery]);

  // THEME
  const [themeSearch, setThemeSearch] = useState("");
  const onChangeThemeInput = useCallback((e: any) => setThemeSearch(e.target.value), []);
  const resetTheme = useCallback(() => {
    setThemeSearch("");
    addToQuery({ needs: [], themes: [] });
  }, [setThemeSearch, addToQuery]);

  const resetThemeSearch = useCallback(() => setThemeSearch(""), []);

  // LOCATION
  const [locationSearch, setLocationSearch] = useState("");
  const onChangeDepartmentInput = useCallback((e: any) => setLocationSearch(e.target.value), []);
  const resetDepartment = useCallback(() => {
    setLocationSearch("");
    addToQuery({ departments: [] });
  }, [setLocationSearch, addToQuery]);

  const resetLocationSearch = useCallback(() => setLocationSearch(""), []);

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
    onChangeSearchInput
  };

  return !isMobile ? <HomeSearchHeaderDesktop {...filterProps} /> : <HomeSearchHeaderMobile {...filterProps} />;
};

export default HomeSearchHeader;
