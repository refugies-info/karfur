import { Id } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SearchButton from "~/components/UI/SearchButton";
import { useSearchEventName } from "~/hooks";
import { cls } from "~/lib/classname";
import { sortThemes } from "~/lib/sortThemes";
import { Event } from "~/lib/tracking";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { themesSelector } from "~/services/Themes/themes.selectors";
import { useSearchCounts } from "../SearchCountsContext";
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

const ThemeMenu = ({ mobile, isOpen, className }: Props) => {
  const counts = useSearchCounts();
  const { isMobile } = useWindowSize();

  const themesMenuContainerRef = useRef<HTMLDivElement | null>(null);
  const themesContainerRef = useRef<HTMLDivElement | null>(null);
  const needsContainerRef = useRef<HTMLDivElement | null>(null);

  const themes = useSelector(themesSelector);
  const sortedThemes = themes.sort(sortThemes);
  const needs = useSelector(needsSelector);
  const query = useSelector(searchQuerySelector);
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

  // reset selected theme when popup opens
  useEffect(() => {
    if (isOpen) {
      setSelectedThemeId(getInitialTheme(needs, sortedThemes, query.needs, query.themes, mobile));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const nbDispositifsByNeed = useMemo(() => {
    return (counts?.needs || {}) as Record<string, number>;
  }, [counts?.needs]);

  const nbDispositifsByTheme = useMemo(() => {
    return (counts?.themes || {}) as Record<string, number>;
  }, [counts?.themes]);

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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <ThemeMenuContext.Provider
      value={{ nbDispositifsByNeed, nbDispositifsByTheme, search, selectedThemeId, setSelectedThemeId: onClickTheme }}
    >
      <div className={cls(!isMobile && styles.container, className)} ref={themesMenuContainerRef}>
        <div className={cls(styles.searchBar, isMobile ? styles.searchBarSticky : "")}>
          <SearchButton onChange={handleSearch} />
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
