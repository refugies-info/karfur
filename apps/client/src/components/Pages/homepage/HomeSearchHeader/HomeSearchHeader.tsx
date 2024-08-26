import { useWindowSize } from "@/hooks";
import { addToQueryActionCreator } from "@/services/SearchResults/searchResults.actions";
import { SearchQuery } from "@/services/SearchResults/searchResults.reducer";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import HomeSearchHeaderDesktop from "./HomeSearchHeader.desktop";
import HomeSearchHeaderMobile from "./HomeSearchHeader.mobile";

interface Props {}

const HomeSearchHeader = (props: Props) => {
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
    (e: any) => dispatch(addToQueryActionCreator({ search: e.target.value })),
    [dispatch],
  );
  const resetSearch = useCallback(() => addToQuery({ search: "" }), [addToQuery]);

  // THEME
  const resetTheme = useCallback(() => {
    addToQuery({ needs: [], themes: [] });
  }, [addToQuery]);

  // LOCATION
  const resetDepartment = useCallback(() => {
    addToQuery({ departments: [] });
  }, [addToQuery]);

  const filterProps = {
    resetDepartment,
    resetTheme,
    resetSearch,
    onChangeSearchInput,
  };

  return !isMobile ? <HomeSearchHeaderDesktop {...filterProps} /> : <HomeSearchHeaderMobile {...filterProps} />;
};

export default HomeSearchHeader;
