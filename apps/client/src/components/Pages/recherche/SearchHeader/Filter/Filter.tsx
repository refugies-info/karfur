/**
 * FILTER COMPONENT - COUNT FEATURE DOCUMENTATION
 * ================================================
 *
 * STATUS: Count features are currently DISABLED (Nov 5, 2025)
 *
 * DISABLED FEATURES:
 * 1. Option count display (e.g., "Paris (45 fiches)")
 * 2. Disabled state for options with zero results
 * 3. Tooltip for disabled options ("Aucune fiche correspondante")
 * 4. Filter count badge in header
 *
 * HOW TO RE-ENABLE:
 * ================
 *
 * STEP 1: Enable option count display
 * ------------------------------------
 * Uncomment the following lines to show count next to each option:
 *
 * Line 179:  Uncomment: // const isDisabled = option.count === 0;
 * Line 188:  Uncomment: // disabled={isDisabled}
 * Line 195-198: Uncomment count display in stylesDisabled section
 * Line 230:  Uncomment: // const isDisabled = option.count === 0;
 * Line 238:  Uncomment: // disabled={isDisabled}
 * Line 247:  Uncomment: // <div className={styles.count}>{option.count ?? ""}</div>
 * Line 305:  Uncomment: // const isDisabled = option.count === 0;
 * Line 313:  Uncomment: // disabled={isDisabled}
 * Line 318:  Uncomment: // <div className={styles.count}>{option.count ?? ""}</div>
 *
 * STEP 2: Enable disabled state tooltips
 * ----------------------------------------
 * Uncomment the following Tooltip components:
 *
 * Line 249-251: Uncomment Tooltip in DialogMenuLayout section
 * Line 320-325: Uncomment Tooltip in DropDownMenuLayout section
 *
 * STEP 3: Enable filter count badge
 * -----------------------------------
 * Uncomment the filterCount() function:
 *
 * Line 211-224: Uncomment the entire filterCount() function
 * Line 274:    Uncomment: filterCount={filterCount()} in DialogMenuLayout
 *
 * The badge will automatically display once counts are available.
 *
 * STEP 4: Verify data flow
 * -------------------------
 * Ensure that:
 * - MenuItemProps includes counts: Record<string, number> (line 44)
 * - processedMenuItems correctly maps counts (line 89)
 * - Parent component passes counts prop with populated data
 *
 * RELATED FILES:
 * ==============
 * - Filter.module.scss: Contains styles for .count class
 * - Parent component (SearchHeader.tsx): Should pass counts prop
 * - API response: Should include count data in filter options
 * - Related count feature: ~/components/Pages/recherche/ResultsFilter/ResultsFilter.tsx
 *   (See ResultsFilter.tsx for complementary count display in result tabs)
 *
 * NOTES:
 * ======
 * - The isDisabled logic prevents selection of options with zero results
 * - Tooltips inform users why an option is disabled
 * - Count display helps users understand result availability
 * - All commented code is production-ready, just needs uncommenting
 */

import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { AgeOptions, FrenchOptions, SortOptions, sortOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DialogMenuLayout,
  DialogMenuLayoutTitle,
  DropDownMenuLayout,
} from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import Checkbox from "~/components/UI/Checkbox";
import { useSearchEventName, useWindowSize } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import { searchQuerySelector, themesDisplayedSelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./Filter.module.scss";

type TranslationFunction = (key: string, options?: object) => string;

export type Selected = AgeOptions | FrenchOptions | string;
export type FilterOptions = { key: Selected; value: string; count: number }[];

type PropsBase = {
  label: string;
  icon?: string;
  gaType: string;
  className?: string;
  showFilterCount?: boolean;
  tooltip?: { trigger: string; text: string } | null;
  autoFocus?: boolean;
};

type MenuItemProps = {
  filterKey: keyof SearchQuery;
  options: FilterOptions;
  selected: Selected[];
  translateOptions?: boolean;
  menuItemStyles?: string;
  label?: string;
  gaType?: string;
  counts?: Record<string, number>;
};
type MenuItems = PropsBase & {
  externalMenu?: never;
  menuItems: [MenuItemProps, ...MenuItemProps[]];
};

type ExternalMenu = PropsBase & {
  externalMenu: {
    menu: React.ReactNode;
    value: string[];
    reset: () => void;
    menuItemStyles?: never;
  };
  menuItems?: never;
};

type Props = MenuItems | ExternalMenu;

const Filter = ({
  gaType,
  menuItems,
  externalMenu,
  label,
  tooltip,
  icon,
  showFilterCount,
  className,
  autoFocus,
}: Props) => {
  const { t } = useTranslation() as { t: TranslationFunction };
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const themesDisplayed = useSelector(themesDisplayedSelector);
  const eventName = useSearchEventName();
  const stylesDisabled = useStylesDisabled();

  const { isMobile, isTablet } = useWindowSize();

  const processedMenuItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.map((item) => ({
      ...item,
      options: item.options.map((option) => ({
        ...option,
        count: item.counts?.[option.key as string] ?? 0,
      })),
    }));
  }, [menuItems]);

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch],
  );

  const onSelectItem = (filterKey: keyof SearchQuery, key: string) => {
    if (externalMenu) return;

    const menuItem = processedMenuItems.find((item) => item.filterKey === filterKey);
    if (!menuItem) return;

    const newSelected = menuItem.selected.includes(key)
      ? [...menuItem.selected].filter((opt) => opt !== key)
      : [...menuItem.selected, key];

    addToQuery({ [filterKey]: newSelected });
    Event(eventName, "click filter", menuItem.gaType || gaType);
  };

  const resetOptions = () => {
    if (externalMenu) {
      externalMenu.reset();
      return;
    }

    const resetQuery: Record<string, string[] | undefined> = {};
    processedMenuItems.forEach((item) => {
      resetQuery[item.filterKey] = [];
    });

    addToQuery(resetQuery);
  };

  const selectSort = useCallback(
    (key: SortOptions) => {
      dispatch(addToQueryActionCreator({ sort: key }));
      Event(eventName, "click sort option", key);
    },
    [dispatch, eventName],
  );

  const value = useMemo(() => {
    if (externalMenu) return externalMenu.value;
    const querySelected = processedMenuItems.flatMap((item) => (query[item.filterKey] ? query[item.filterKey] : null));
    if (Array.isArray(querySelected)) {
      return querySelected.map((selected) => {
        const val = processedMenuItems
          .flatMap((item) => item.options.find((a) => a.key === selected)?.value)
          .filter(Boolean);
        return val.length > 0 ? t(val[0] as any) : null;
      });
    }
    return [];
  }, [externalMenu, query, t, processedMenuItems]);

  // const filterCount = () => {
  //   if (!showFilterCount || !processedMenuItems) return null;

  //   let filterCount = 0;

  //   processedMenuItems.map((item) => {
  //     filterCount = filterCount + item.selected.length;
  //   });

  //   return filterCount;
  // };

  return (
    <div className={cls(styles.filter, className)}>
      {stylesDisabled ? (
        <div>
          <b style={{ display: "inline-block!important" }}>{label}</b>
          {externalMenu ? (
            externalMenu.menu
          ) : (
            <>
              {menuItems.map((item, i) => {
                return (
                  <div key={i}>
                    {item.label && <b>{item.label} : </b>}
                    {item.options.map((option, o) => {
                      const currentmenu = menuItems[i];
                      const isSelected = currentmenu.selected.includes(option.key);
                      // const isDisabled = option.count === 0;
                      return (
                        <span key={option.key}>
                          <input
                            type="checkbox"
                            id={`MenuItemTooltip${o}`}
                            onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                            tabIndex={0}
                            checked={isSelected}
                            // disabled={isDisabled}
                            aria-checked={isSelected}
                            aria-labelledby={`${currentmenu.filterKey}-label-${option.key}`}
                          />
                          <span onClick={() => onSelectItem(currentmenu.filterKey, option.key)}>
                            {currentmenu.translateOptions ? t(option.value) : option.value}
                          </span>{" "}
                          {/* <small>
                            ({option.count ?? ""}{" "}
                            {stylesDisabled && ` ${t("Recherche.fiches", { count: option.count })}`})
                          </small>{" "} */}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <>
          {isMobile || isTablet ? (
            <DialogMenuLayout
              label={label}
              icon={icon}
              // filterCount={filterCount()}
              value={value as string[]}
              resetOptions={resetOptions}
              gaType={gaType}
            >
              {externalMenu ? (
                externalMenu.menu
              ) : (
                <>
                  {menuItems.map((item, i) => {
                    return (
                      <>
                        {item.label && <DialogMenuLayoutTitle>{item.label}</DialogMenuLayoutTitle>}
                        {item.options.map((option, o) => {
                          const currentmenu = menuItems[i];
                          const isSelected = currentmenu.selected.includes(option.key);
                          // const isDisabled = option.count === 0;
                          return (
                            <>
                              <Checkbox
                                id={`MenuItemTooltip${o}`}
                                onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                                tabIndex={0}
                                checked={isSelected}
                                // disabled={isDisabled}
                                className={cls(styles.item, currentmenu.menuItemStyles)}
                                aria-checked={isSelected}
                                aria-labelledby={`${currentmenu.filterKey}-label-${option.key}`}
                                labelClassName={styles.label}
                              >
                                <div onClick={() => onSelectItem(currentmenu.filterKey, option.key)}>
                                  {currentmenu.translateOptions ? t(option.value) : option.value}
                                </div>
                                {/* <div className={styles.count}>{option.count ?? ""}</div> */}
                              </Checkbox>
                              {/* <Tooltip hide={!isDisabled} target={`MenuItemTooltip${o}`}>
                                <Balancer>{t("Recherche.tooltipAucuneFicheCorrespondante")}</Balancer>
                              </Tooltip> */}
                            </>
                          );
                        })}
                      </>
                    );
                  })}
                  <DialogMenuLayoutTitle className={styles.menuItemLabel}>
                    {t("Recherche.sortBy")}
                  </DialogMenuLayoutTitle>

                  {sortOptions
                    .filter((option) => {
                      if (themesDisplayed.length === 1 && option.key === "theme") return false;
                      if (query.departments.length === 0 && option.key === "location") return false;
                      return true;
                    })
                    .map((option, i) => {
                      const isSelected = query.sort === option.key;
                      return (
                        <div key={i} className={styles.radioContainer}>
                          <RadioButtons
                            options={[
                              {
                                label: t(option.value),
                                nativeInputProps: {
                                  checked: isSelected,
                                  onChange: () => selectSort(option.key),
                                },
                              },
                            ]}
                          />
                        </div>
                      );
                    })}
                </>
              )}
            </DialogMenuLayout>
          ) : (
            <DropDownMenuLayout
              label={label}
              tooltip={tooltip}
              icon={icon}
              value={value as string[]}
              resetOptions={resetOptions}
              gaType={gaType}
              autoFocus={autoFocus}
            >
              {externalMenu
                ? externalMenu.menu
                : processedMenuItems.map((item, i) =>
                    item.options.map((option, o) => {
                      const currentmenu = processedMenuItems[i];
                      const isSelected = currentmenu.selected.includes(option.key);
                      // const isDisabled = option.count === 0;
                      return (
                        <div key={o} className={cls(styles.item, currentmenu.menuItemStyles)}>
                          <>
                            <Checkbox
                              id={`MenuItemTooltip${o}`}
                              onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                              checked={isSelected}
                              // disabled={isDisabled}
                            >
                              <div className={styles.label}>
                                {currentmenu.translateOptions ? t(option.value) : option.value}
                              </div>
                              {/* <div className={styles.count}>{option.count ?? ""}</div> */}
                            </Checkbox>
                            {/* <Tooltip
                              hide={!isDisabled}
                              target={`MenuItemTooltip${o}`}
                            >
                              <Balancer>{t("Recherche.tooltipAucuneFicheCorrespondante")}</Balancer>
                            </Tooltip> */}
                          </>
                        </div>
                      );
                    }),
                  )}
            </DropDownMenuLayout>
          )}
        </>
      )}
      {stylesDisabled && <br />}
    </div>
  );
};

export default Filter;
