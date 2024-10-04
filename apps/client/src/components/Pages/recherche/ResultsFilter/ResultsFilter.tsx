import { fr } from "@codegouvfr/react-dsfr";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { filterType, SortOptions, sortOptions, TypeOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { TabItem, TabsBar } from "~/components/UI/Tabs";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import {
  searchQuerySelector,
  searchResultsSelector,
  themesDisplayedSelector,
} from "~/services/SearchResults/searchResults.selector";
import styles from "./ResultsFilter.module.scss";

type TranslationFunction = (key: string, options?: object) => string;

const ResultsFilter = (): React.ReactNode => {
  const { t } = useTranslation() as { t: TranslationFunction };
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const themesDisplayed = useSelector(themesDisplayedSelector);
  const filteredResult = useSelector(searchResultsSelector);
  const [open, setOpen] = useState(false);

  const nbDemarches = useMemo(
    () => filteredResult.matches.filter(({ typeContenu }) => typeContenu === "demarche").length,
    [filteredResult.matches],
  );
  const nbDispositifs = useMemo(
    () => filteredResult.matches.filter(({ typeContenu }) => typeContenu === "dispositif").length,
    [filteredResult.matches],
  );
  const onlineResourceCount = useMemo(
    () => filteredResult.matches.filter((d) => d.metadatas?.location === "online").length,
    [filteredResult.matches],
  );

  const getCount = (type: TypeOptions) => {
    switch (type) {
      case "all":
        return `(${nbDemarches + nbDispositifs})`;
      case "demarche":
        return `(${nbDemarches})`;
      case "dispositif":
        const deptCount = query.departments.length;
        switch (deptCount) {
          case 0:
            return `(${nbDispositifs})`;

          case 1:
            return `${query.departments[0]} (${nbDispositifs})`;

          default:
            return `${query.departments[0]} + ${deptCount - 1} (${nbDispositifs})`;
        }
      case "ressource":
        return `(${onlineResourceCount})`;
      default:
        return "";
    }
  };

  const noResult = nbDemarches + nbDispositifs === 0;

  useEffect(() => {
    // if we select 1 theme, and sort option was "theme", change it
    if (themesDisplayed.length === 1 && query.sort === "theme") {
      dispatch(addToQueryActionCreator({ sort: "date" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themesDisplayed.length]);

  const selectType = useCallback(
    (key: TypeOptions) => {
      dispatch(addToQueryActionCreator({ type: key }));
      Event("USE_SEARCH", "use type filter", "click type");
    },
    [dispatch],
  );

  const toggleSort = useCallback(() => {
    setOpen((o) => {
      if (!o) Event("USE_SEARCH", "open filter", "sort");
      return !o;
    });
  }, []);

  const selectSort = useCallback(
    (key: SortOptions) => {
      dispatch(addToQueryActionCreator({ sort: key }));
      Event("USE_SEARCH", "click filter", "sort");
    },
    [dispatch],
  );

  const menuItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    if (open) {
      menuItemRefs.current[0]?.focus();
    }
  }, [open]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number): void => {
    if (event.key === "Tab") {
      event.preventDefault();
      const direction = event.shiftKey ? -1 : 1;
      const itemsCount = menuItemRefs.current.length;
      let nextIndex = (index + direction + itemsCount) % itemsCount;

      // Find the next focusable item
      while (nextIndex !== index) {
        if (menuItemRefs.current[nextIndex]) {
          menuItemRefs.current[nextIndex]?.focus();
          break;
        }
        nextIndex = (nextIndex + direction + itemsCount) % itemsCount;
      }
    }
  };

  return (
    <div className={cls(styles.container, noResult && styles.no_result)}>
      <div className={styles.grid}>
        <TabsBar>
          {filterType.map((option, i) => (
            <TabItem key={i} onClick={() => selectType(option.key)} isActive={query.type === option.key}>
              {t(option.value)} {getCount(option.key)}
            </TabItem>
          ))}
        </TabsBar>
        <DropdownMenu.Root open={open} modal={false} onOpenChange={toggleSort}>
          <DropdownMenu.Trigger className={styles.sort_button} asChild>
            <button aria-haspopup="true" aria-expanded={open}>
              <span className={styles.sort_label}>
                {t(sortOptions.find((opt) => opt.key === query.sort)?.value || "")}
              </span>
              <i className={fr.cx("ri-expand-up-down-line", "fr-icon--sm")}></i>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content sideOffset={10} className={styles.sort_menu_content}>
              {sortOptions
                .filter((option) => {
                  if (themesDisplayed.length === 1 && option.key === "theme") return false;
                  if (query.departments.length === 0 && option.key === "location") return false;
                  return true;
                })
                .map((option, i) => {
                  const isSelected = query.sort === option.key;
                  return (
                    <DropdownMenu.Item
                      key={i}
                      onSelect={() => selectSort(option.key)}
                      className={cls(styles.sort_menu_item)}
                      ref={(el) => {
                        menuItemRefs.current[i] = el;
                      }}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      tabIndex={0}
                    >
                      {t(option.value)}
                      {isSelected && <EVAIcon name="checkmark-outline" fill="blue" size={20} />}
                    </DropdownMenu.Item>
                  );
                })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};

export default ResultsFilter;
