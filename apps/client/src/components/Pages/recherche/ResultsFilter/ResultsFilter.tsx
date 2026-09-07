import { fr } from "@codegouvfr/react-dsfr";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { filterType, type SortOptions, sortOptions, type TypeOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { TabItem, TabsBar } from "~/components/UI/Tabs";
import { useSearchEventName } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { getDefaultSortOption, getDisplayRuleForQuery } from "~/lib/recherche/queryContents";
import { Event } from "~/lib/tracking";
import type { SearchCountsResponse } from "~/pages/api/search/counts";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./ResultsFilter.module.scss";

type TranslationFunction = (key: string, options?: object) => string;

interface Props {
  counts: SearchCountsResponse | null;
}

const ResultsFilter = (props: Props): React.ReactNode => {
  const { t } = useTranslation() as { t: TranslationFunction };
  const stylesDisabled = useStylesDisabled();

  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const [open, setOpen] = useState(false);
  const eventName = useSearchEventName();

  const nbDemarches = props.counts?.types.demarche || 0;
  const nbDispositifs = props.counts?.types.dispositif || 0;
  const onlineResourceCount = props.counts?.types.online || 0;

  const getCount = (type: TypeOptions) => {
    switch (type) {
      case "all":
        return `(${props.counts?.total || 0})`;
      case "demarche":
        return `(${nbDemarches})`;
      case "dispositif": {
        const deptCount = query.departments.length;
        switch (deptCount) {
          case 1:
            return `${query.departments[0]} (${nbDispositifs})`;

          default:
            return `(${nbDispositifs})`;
        }
      }
      case "ressource":
        return `(${onlineResourceCount})`;
      default:
        return "";
    }
  };

  const noResult = nbDemarches + nbDispositifs === 0;

  const selectType = useCallback(
    (key: TypeOptions) => {
      dispatch(addToQueryActionCreator({ type: key }));
      Event(eventName, "use type filter", key);
    },
    [dispatch, eventName],
  );

  const toggleSort = useCallback(() => {
    setOpen((o) => {
      const newState = !o;
      if (newState) {
        Event(eventName, "open filter", "sort");
      } else {
        Event(eventName, "close filter", "sort");
      }
      return newState;
    });
  }, [eventName]);

  const selectSort = useCallback(
    (key: SortOptions) => {
      dispatch(addToQueryActionCreator({ sort: key }));
      Event(eventName, "use sort filter", key);
      setOpen(false);
    },
    [dispatch, eventName],
  );

  const filteredSortOptions = useMemo(() => {
    return sortOptions.filter((option) => {
      const rule = getDisplayRuleForQuery(query, option.key);
      return rule ? rule.display : true;
    });
  }, [query]);

  const defaultSortOption = useMemo(() => {
    return getDefaultSortOption(query);
  }, [query]);

  const currentSortOption = useMemo(() => {
    return sortOptions.find(
      (opt) => opt.key === (query.sort === "default" ? defaultSortOption : query.sort),
    );
  }, [query.sort, defaultSortOption]);

  const getCurrentSortKey = useMemo(() => {
    return query.sort === "default" ? defaultSortOption : query.sort;
  }, [query.sort, defaultSortOption]);

  return (
    <div className={cls(styles.container, noResult && styles.no_result)}>
      <div className={styles.grid}>
        <TabsBar>
          {filterType.map((option) => (
            <TabItem
              key={option.key}
              onClick={() => selectType(option.key)}
              isActive={query.type === option.key}
            >
              {t(option.value)}{" "}
              {process.env.NEXT_PUBLIC_DISABLE_SEARCH_COUNTS !== "true" && getCount(option.key)}
            </TabItem>
          ))}
        </TabsBar>
        {filteredSortOptions.length > 0 && (
          <>
            {stylesDisabled ? (
              <select
                onChange={(e) => {
                  selectSort(e.target.value as SortOptions);
                }}
              >
                {filteredSortOptions.map((option) => {
                  const isSelected = getCurrentSortKey === option.key;
                  return (
                    <option key={option.key} value={option.key} selected={isSelected}>
                      {t(option.value)}
                    </option>
                  );
                })}
              </select>
            ) : (
              <DropdownMenu.Root open={open} modal={false} onOpenChange={toggleSort}>
                <DropdownMenu.Trigger className={styles.sort_button} asChild>
                  <button
                    aria-haspopup="true"
                    aria-expanded={open}
                    aria-label={`${t(currentSortOption?.value || "")}, ${t("selected")}`}
                  >
                    <span className={styles.sort_label}>{t(currentSortOption?.value || "")}</span>
                    <i
                      className={fr.cx("ri-expand-up-down-line", "fr-icon--sm")}
                      aria-hidden="true"
                    ></i>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content sideOffset={10} className={styles.sort_menu_content}>
                    {filteredSortOptions.map((option) => {
                      const isSelected = getCurrentSortKey === option.key;
                      const optionLabel = t(option.value);
                      return (
                        <DropdownMenu.Item
                          key={option.key}
                          onSelect={() => selectSort(option.key)}
                          className={cls(styles.sort_menu_item)}
                          aria-label={isSelected ? `${optionLabel}, ${t("selected")}` : optionLabel}
                          aria-current={isSelected ? "true" : undefined}
                        >
                          {optionLabel}
                          {isSelected && <EVAIcon name="checkmark-outline" fill="blue" size={20} />}
                        </DropdownMenu.Item>
                      );
                    })}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsFilter;
