import { GetDispositifsResponse, Id } from "@refugies-info/api-types";
import SearchButton from "components/UI/SearchButton";
import Separator from "components/UI/Separator";
import { queryDispositifsWithoutThemes } from "lib/recherche/queryContents";
import { sortThemes } from "lib/sortThemes";
import { Event } from "lib/tracking";
import debounce from "lodash/debounce";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { languei18nSelector } from "services/Langue/langue.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { hasErroredSelector, isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { needsSelector } from "services/Needs/needs.selectors";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { themesSelector } from "services/Themes/themes.selectors";
import { getInitialTheme } from "./functions";
import Needs from "./Needs";
import SearchResults from "./SearchResults";
import styles from "./ThemeMenu.module.css";
import { ThemeMenuContext } from "./ThemeMenuContext";
import Themes from "./Themes";

interface Props {
  mobile: boolean;
  isOpen: boolean;
}

const debouncedQuery = debounce(
  (
    query: SearchQuery,
    dispositifs: GetDispositifsResponse[],
    locale: string,
    callback: (res: GetDispositifsResponse[]) => void,
  ) => {
    return queryDispositifsWithoutThemes(query, dispositifs, locale).then((res) => callback(res));
  },
  500,
);

const ThemeMenu = (props: Props) => {
  const dispatch = useDispatch();

  const themes = useSelector(themesSelector);
  const sortedThemes = themes.sort(sortThemes);
  const needs = useSelector(needsSelector);
  const query = useSelector(searchQuerySelector);
  const allDispositifs = useSelector(activeDispositifsSelector);
  const initialTheme = getInitialTheme(needs, sortedThemes, query.needs, query.themes, props.mobile);

  const [selectedThemeId, setSelectedThemeId] = useState<Id | undefined>(initialTheme);

  const [search, setSearch] = useState(""); // TODO: use this when search restored in component

  const onClickTheme = useCallback(
    (themeId: Id) => {
      setSelectedThemeId((old) => {
        if (old === themeId && props.mobile) return null;
        return themeId;
      });
      Event("USE_SEARCH", "use theme filter", "click theme");
    },
    [setSelectedThemeId, props.mobile],
  );

  // fetch dispositifs if not done already
  const isDispositifsLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  const hasDispositifsError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  useEffect(() => {
    if (allDispositifs.length === 0 && !isDispositifsLoading && !hasDispositifsError) {
      dispatch(fetchActiveDispositifsActionsCreator());
    }
  }, [allDispositifs.length, isDispositifsLoading, hasDispositifsError, dispatch]);

  // reset selected theme when popup opens
  useEffect(() => {
    if (props.isOpen) {
      setSelectedThemeId(getInitialTheme(needs, sortedThemes, query.needs, query.themes, props.mobile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  const [nbDispositifsByNeed, setNbDispositifsByNeed] = useState<Record<string, number>>({});
  const [nbDispositifsByTheme, setNbDispositifsByTheme] = useState<Record<string, number>>({});

  // count dispositifs by need and theme
  const languei18nCode = useSelector(languei18nSelector);
  useEffect(() => {
    if (props.isOpen) {
      debouncedQuery(query, allDispositifs, languei18nCode, (dispositifs) => {
        const newNbDispositifsByNeed: Record<string, number> = {};
        const newNbDispositifsByTheme: Record<string, number> = {};
        for (const dispositif of dispositifs) {
          for (const needId of dispositif.needs || []) {
            newNbDispositifsByNeed[needId.toString()] = (newNbDispositifsByNeed[needId.toString()] || 0) + 1;
          }

          const themeId = dispositif.theme;
          if (!themeId) continue;
          newNbDispositifsByTheme[themeId.toString()] = (newNbDispositifsByTheme[themeId.toString()] || 0) + 1;
          for (const theme of dispositif.secondaryThemes || []) {
            newNbDispositifsByTheme[theme.toString()] = (newNbDispositifsByTheme[theme.toString()] || 0) + 1;
          }
        }

        setNbDispositifsByTheme(newNbDispositifsByTheme);
        setNbDispositifsByNeed(newNbDispositifsByNeed);
      });
    }
  }, [query, allDispositifs, needs, sortedThemes, props.mobile, languei18nCode, props.isOpen]);

  return (
    <ThemeMenuContext.Provider
      value={{ nbDispositifsByNeed, nbDispositifsByTheme, search, selectedThemeId, setSelectedThemeId: onClickTheme }}
    >
      <SearchButton onChange={(e) => setSearch(e.target.value)} />
      <Separator />
      <div className={styles.main}>
        {search ? (
          <SearchResults />
        ) : (
          <>
            <Themes />
            <Needs />
          </>
        )}
      </div>
    </ThemeMenuContext.Provider>
  );
};

export default memo(ThemeMenu);
