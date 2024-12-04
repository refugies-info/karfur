import { Id } from "@refugies-info/api-types";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDispositifCounts } from "~/components/Pages/recherche/ThemeMenu/useDispositifCounts";
import SearchButton from "~/components/UI/SearchButton";
import { useSearchEventName, useWindowSize } from "~/hooks";
import { cls } from "~/lib/classname";
import { filterDispositifs } from "~/lib/recherche/queryContents";
import { sortThemes } from "~/lib/sortThemes";
import { Event } from "~/lib/tracking";
import { fetchActiveDispositifsActionsCreator } from "~/services/ActiveDispositifs/activeDispositifs.actions";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { hasErroredSelector, isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { themesSelector } from "~/services/Themes/themes.selectors";
import { getInitialTheme } from "./functions";
import Needs from "./Needs";
import SearchResults from "./SearchResults";
import styles from "./ThemeMenu.module.scss";
import { ThemeMenuContext } from "./ThemeMenuContext";
import Themes from "./Themes";

interface Props {
  mobile: boolean;
  isOpen: boolean;
  className?: string;
}

const ThemeMenu = ({ mobile, isOpen, className, ...props }: Props) => {
  const dispatch = useDispatch();
  const { isMobile } = useWindowSize();

  const themesMenuContainerRef = useRef<HTMLDivElement | null>(null);
  const themesContainerRef = useRef<HTMLDivElement | null>(null);
  const needsContainerRef = useRef<HTMLDivElement | null>(null);

  const themes = useSelector(themesSelector);
  const sortedThemes = themes.sort(sortThemes);
  const needs = useSelector(needsSelector);
  const query = useSelector(searchQuerySelector);
  const dispositifs = useSelector(activeDispositifsSelector);
  const matches = useMemo(() => {
    return filterDispositifs(query, dispositifs, false, "theme");
  }, [query, dispositifs]);
  const initialTheme = getInitialTheme(needs, sortedThemes, query.needs, query.themes, mobile);
  const eventName = useSearchEventName();

  const [selectedThemeId, setSelectedThemeId] = useState<Id | undefined>(initialTheme);

  const [search, setSearch] = useState(""); // TODO: use this when search restored in component

  const onClickTheme = useCallback(
    (themeId: Id) => {
      setSelectedThemeId((old) => {
        if (old === themeId && mobile) return null;
        return themeId;
      });
      Event(eventName, "use theme filter", "click theme");
    },
    [setSelectedThemeId, mobile, eventName],
  );

  // fetch dispositifs if not done already
  const isDispositifsLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  const hasDispositifsError = useSelector(hasErroredSelector(LoadingStatusKey.FETCH_ACTIVE_DISPOSITIFS));
  useEffect(() => {
    if (matches.length === 0 && !isDispositifsLoading && !hasDispositifsError) {
      dispatch(fetchActiveDispositifsActionsCreator());
    }
  }, [matches.length, isDispositifsLoading, hasDispositifsError, dispatch]);

  // reset selected theme when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedThemeId(getInitialTheme(needs, sortedThemes, query.needs, query.themes, mobile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // count dispositifs by need and theme
  const { nbDispositifsByNeed, nbDispositifsByTheme } = useDispositifCounts(isOpen);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" && themesContainerRef.current && needsContainerRef.current) {
        const firstNeedItem = needsContainerRef.current.querySelector<HTMLElement>("button");
        setTimeout(() => firstNeedItem?.focus(), 100);
      } else if (event.key === "ArrowLeft" && themesContainerRef.current && needsContainerRef.current) {
        const firstThemeItem = themesContainerRef.current.querySelector<HTMLElement>("button");
        setTimeout(() => firstThemeItem?.focus(), 100);
      }
    };

    const container = themesMenuContainerRef.current;

    if (container) {
      container.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, []);

  return (
    <ThemeMenuContext.Provider
      value={{ nbDispositifsByNeed, nbDispositifsByTheme, search, selectedThemeId, setSelectedThemeId: onClickTheme }}
    >
      <div className={cls(!isMobile && styles.container, className)} ref={themesMenuContainerRef}>
        <div className={cls(styles.searchBar, isMobile ? styles.searchBarSticky : "")}>
          <SearchButton onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.main}>
          {search ? (
            <SearchResults />
          ) : (
            <>
              <Themes ref={themesContainerRef} />
              {!isMobile && <Needs ref={needsContainerRef} />}
            </>
          )}
        </div>
      </div>
    </ThemeMenuContext.Provider>
  );
};

export default memo(ThemeMenu);
