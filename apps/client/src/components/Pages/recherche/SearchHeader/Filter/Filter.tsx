import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
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
};

type MenuItemProps = {
  filterKey: keyof SearchQuery;
  options: FilterOptions;
  selected: Selected[];
  translateOptions?: boolean;
  menuItemStyles?: string;
  label?: string;
  gaType?: string;
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

const Filter = ({ gaType, menuItems, externalMenu, label, icon, showFilterCount, className }: Props) => {
  const { t } = useTranslation() as { t: TranslationFunction };
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const themesDisplayed = useSelector(themesDisplayedSelector);
  const eventName = useSearchEventName();

  const { isTablet } = useWindowSize();

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch],
  );

  const onSelectItem = (filterKey: keyof SearchQuery, key: string) => {
    if (externalMenu) return;

    const menuItem = menuItems.find((item) => item.filterKey === filterKey);
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
    menuItems.forEach((item) => {
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
    const querySelected = menuItems.flatMap((item) => (query[item.filterKey] ? query[item.filterKey] : null));
    if (Array.isArray(querySelected)) {
      return querySelected.map((selected) => {
        const val = menuItems.flatMap((item) => item.options.find((a) => a.key === selected)?.value).filter(Boolean);
        return val.length > 0 ? t(val[0] as any) : null;
      });
    }
    return null;
  }, [externalMenu, query, menuItems, t]);

  const filterCount = () => {
    if (!showFilterCount || !menuItems) return null;

    let filterCount = 0;

    menuItems.map((item) => {
      filterCount = filterCount + item.selected.length;
    });

    return filterCount;
  };

  return (
    <div className={cls(styles.filter, className)}>
      {isTablet ? (
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
                      const isDisabled = option.count === 0;
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
                          >
                            <div
                              className={styles.label}
                              onClick={() => onSelectItem(currentmenu.filterKey, option.key)}
                              aria-controls=""
                            >
                              {currentmenu.translateOptions ? t(option.value) : option.value}
                            </div>
                            <div className={styles.countContainer}>
                              <div className={styles.count}>{option.count ?? ""}</div>
                            </div>
                          </Checkbox>
                          <Tooltip hide={!isDisabled} target={`MenuItemTooltip${o}`}>
                            <Balancer>{t("Recherche.tooltipAucuneFicheCorrespondante")}</Balancer>
                          </Tooltip>
                        </>
                      );
                    })}
                  </>
                );
              })}
              <DialogMenuLayoutTitle className={styles.menuItemLabel}>{t("Recherche.sortBy")}</DialogMenuLayoutTitle>

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
          icon={icon}
          value={value as string[]}
          resetOptions={resetOptions}
          gaType={gaType}
        >
          {externalMenu
            ? externalMenu.menu
            : menuItems.map((item, i) =>
                item.options.map((option, o) => {
                  const currentmenu = menuItems[i];
                  const isSelected = currentmenu.selected.includes(option.key);
                  const isDisabled = option.count === 0;
                  return (
                    <DropdownMenu.Item
                      key={o}
                      className={cls(styles.item, currentmenu.menuItemStyles)}
                      disabled={isDisabled}
                      asChild
                    >
                      <>
                        <Checkbox
                          id={`MenuItemTooltip${o}`}
                          onChange={() => onSelectItem(currentmenu.filterKey, option.key)}
                          tabIndex={0}
                          checked={isSelected}
                          disabled={isDisabled}
                        >
                          <div className={styles.label}>
                            {currentmenu.translateOptions ? t(option.value) : option.value}
                          </div>
                          <div className={styles.countContainer}>
                            <div className={styles.count}>{option.count ?? ""}</div>
                          </div>
                        </Checkbox>
                        <Tooltip hide={!isDisabled} target={`MenuItemTooltip${o}`}>
                          <Balancer>{t("Recherche.tooltipAucuneFicheCorrespondante")}</Balancer>
                        </Tooltip>
                      </>
                    </DropdownMenu.Item>
                  );
                }),
              )}
        </DropDownMenuLayout>
      )}
    </div>
  );
};

export default Filter;
