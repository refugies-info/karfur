import type { Id } from "@refugies-info/api-types";
import { useWindowSize } from "@refugies-info/ui";
import { type ChangeEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import SearchButton from "~/components/UI/SearchButton";
import { useSearchEventName } from "~/hooks";
import { cls } from "~/lib/classname";
import { sortThemes } from "~/lib/sortThemes";
import { Event } from "~/lib/tracking";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { allThemesSelector } from "~/services/Themes/themes.selectors";
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

  const themes = useSelector(allThemesSelector);
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
      const target = event.target as HTMLElement;
      const isInTabList = target.closest('[role="tablist"]');

      if (isInTabList && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        const tabs = Array.from(
          themesContainerRef.current?.querySelectorAll('[role="tab"]') || [],
        ) as HTMLElement[];
        const currentIndex = tabs.findIndex((tab) => tab === target);

        if (currentIndex !== -1) {
          let nextIndex: number;
          if (event.key === "ArrowDown") {
            nextIndex = currentIndex + 1 >= tabs.length ? 0 : currentIndex + 1;
          } else {
            nextIndex = currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;
          }
          const nextTab = tabs[nextIndex];
          if (nextTab) {
            nextTab.click();
            setTimeout(() => nextTab.focus(), 0);
          }
        }
      }

      if (isInTabList && (event.key === "Home" || event.key === "End")) {
        event.preventDefault();
        const tabs = Array.from(
          themesContainerRef.current?.querySelectorAll('[role="tab"]') || [],
        ) as HTMLElement[];
        const targetTab = event.key === "Home" ? tabs[0] : tabs[tabs.length - 1];
        if (targetTab) {
          targetTab.click();
          setTimeout(() => targetTab.focus(), 0);
        }
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
      value={{
        nbDispositifsByNeed,
        nbDispositifsByTheme,
        search,
        selectedThemeId,
        setSelectedThemeId: onClickTheme,
      }}
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
