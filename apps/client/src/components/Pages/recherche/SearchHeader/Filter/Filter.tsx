/**
 * PRODUCTION COUNT DISABLING FEATURE - REMOVAL GUIDE
 *
 * Related file: /apps/client/src/components/Pages/recherche/ResultsFilter/ResultsFilter.tsx
 *
 * To remove the count disabling feature on production:
 * 1. Delete line 76: const isProduction = process.env.NEXT_PUBLIC_REACT_APP_ENV === "production";
 * 2. Line ~184: Change "const isDisabled = isProduction ? false : option.count === 0;" to "const isDisabled = option.count === 0;"
 * 3. Line ~250: Change "{!isProduction && <div className={styles.count}>...}" to "<div className={styles.count}>..."
 * 4. Line ~254: Remove "{!isProduction && (" wrapper around Tooltip component
 * 5. Line ~310: Change "const isDisabled = isProduction ? false : option.count === 0;" to "const isDisabled = option.count === 0;"
 * 6. Line ~323: Change "{!isProduction && <div className={styles.count}>...}" to "<div className={styles.count}>..."
 * 7. Line ~325: Remove "{!isProduction && (" wrapper around Tooltip component
 */

import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { AgeOptions, FrenchOptions, SortOptions, sortOptions } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Balancer from "react-wrap-balancer";
import {
  DialogMenuLayout,
  DialogMenuLayoutTitle,
  DropDownMenuLayout,
} from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import Checkbox from "~/components/UI/Checkbox";
import Tooltip from "~/components/UI/Tooltip";
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
  const isProduction = process.env.NEXT_PUBLIC_REACT_APP_ENV === "production";
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

  const filterCount = () => {
    if (!showFilterCount || !processedMenuItems) return null;

    let filterCount = 0;

    processedMenuItems.map((item) => {
      filterCount = filterCount + item.selected.length;
    });

    return filterCount;
  };

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
                      const isDisabled = isProduction ? false : option.count === 0;
                      return (
                        <span key={option.key}>
                          <input
                            type="checkbox"
                            id={`MenuItemTooltip${o}`}
                            onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                            tabIndex={0}
                            checked={isSelected}
                            disabled={isDisabled}
                            aria-checked={isSelected}
                            aria-labelledby={`${currentmenu.filterKey}-label-${option.key}`}
                          />
                          <span onClick={() => onSelectItem(currentmenu.filterKey, option.key)}>
                            {currentmenu.translateOptions ? t(option.value) : option.value}
                          </span>{" "}
                          <small>
                            ({option.count ?? ""}{" "}
                            {stylesDisabled && ` ${t("Recherche.fiches", { count: option.count })}`})
                          </small>{" "}
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
              filterCount={filterCount()}
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
                          const isDisabled = isProduction ? false : option.count === 0;
                          return (
                            <>
                              <Checkbox
                                id={`MenuItemTooltip${o}`}
                                onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                                tabIndex={0}
                                checked={isSelected}
                                disabled={isDisabled}
                                className={cls(styles.item, currentmenu.menuItemStyles)}
                                aria-checked={isSelected}
                                aria-labelledby={`${currentmenu.filterKey}-label-${option.key}`}
                                labelClassName={styles.label}
                              >
                                <div onClick={() => onSelectItem(currentmenu.filterKey, option.key)}>
                                  {currentmenu.translateOptions ? t(option.value) : option.value}
                                </div>
                                {!isProduction && <div className={styles.count}>{option.count ?? ""}</div>}
                              </Checkbox>
                              {!isProduction && (
                                <Tooltip hide={!isDisabled} target={`MenuItemTooltip${o}`}>
                                  <Balancer>{t("Recherche.tooltipAucuneFicheCorrespondante")}</Balancer>
                                </Tooltip>
                              )}
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
                      const isDisabled = isProduction ? false : option.count === 0;
                      return (
                        <div key={o} className={cls(styles.item, currentmenu.menuItemStyles)}>
                          <>
                            <Checkbox
                              id={`MenuItemTooltip${o}`}
                              onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                              checked={isSelected}
                              disabled={isDisabled}
                            >
                              <div className={styles.label}>
                                {currentmenu.translateOptions ? t(option.value) : option.value}
                              </div>
                              {!isProduction && <div className={styles.count}>{option.count ?? ""}</div>}
                            </Checkbox>
                            {!isProduction && (
                              <Tooltip hide={!isDisabled} target={`MenuItemTooltip${o}`}>
                                <Balancer>{t("Recherche.tooltipAucuneFicheCorrespondante")}</Balancer>
                              </Tooltip>
                            )}
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
