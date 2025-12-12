/* eslint-disable no-use-before-define */
import { Checkbox as DsfrCheckbox } from "@codegouvfr/react-dsfr/Checkbox";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";
import { useWindowSize } from "@refugies-info/ui";
import {
  type AgeOptions,
  type FrenchOptions,
  type SortOptions,
  sortOptions,
} from "data/searchFilters";
import { useTranslation } from "next-i18next";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import {
  DialogMenuLayout,
  DialogMenuLayoutTitle,
  DropDownMenuLayout,
} from "~/components/Pages/recherche/SearchHeader/Filter/MenuLayouts";
import { useSearchEventName } from "~/hooks";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls, cn } from "~/lib/classname";
import { queryDispositifs } from "~/lib/recherche/queryContents";
import { Event } from "~/lib/tracking";
import { activeDispositifsSelector } from "~/services/ActiveDispositifs/activeDispositifs.selector";
import { needsSelector } from "~/services/Needs/needs.selectors";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import type { SearchQuery } from "~/services/SearchResults/searchResults.reducer";
import {
  searchQuerySelector,
  themesDisplayedSelector,
} from "~/services/SearchResults/searchResults.selector";
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
  const announce = useAnnounce();
  const dispositifs = useSelector(activeDispositifsSelector);
  const allNeeds = useSelector(needsSelector);

  const { isMobile, isTablet } = useWindowSize();

  const showCounts = process.env.NEXT_PUBLIC_DISABLE_SEARCH_COUNTS !== "true";

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

    // Calculate count using the updated query (after selection/deselection)
    const updatedQuery = { ...query, [filterKey]: newSelected };
    const results = queryDispositifs(updatedQuery, dispositifs, allNeeds);
    if (showCounts) {
      announce(t("Recherche.updatedFilters", { count: results.matches.length }), {
        priority: "interrupt",
        delay: 1000,
      });
    }
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
    const querySelected = processedMenuItems.flatMap((item) =>
      query[item.filterKey] ? query[item.filterKey] : null,
    );
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
    <div className={cls(styles.filter, "[&:has(.open)]:z-50", className)}>
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
                      const isDisabled = showCounts && option.count === 0;
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
                          {showCounts && (
                            <small>
                              ({option.count ?? ""}{" "}
                              {stylesDisabled &&
                                ` ${t("Recherche.fiches", { count: option.count })}`}
                              )
                            </small>
                          )}{" "}
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
                      <React.Fragment key={i}>
                        {item.label && <DialogMenuLayoutTitle>{item.label}</DialogMenuLayoutTitle>}
                        <FilterCheckboxes
                          className="px-2"
                          options={item.options}
                          currentmenu={item}
                          onSelectItem={onSelectItem}
                          showCounts={showCounts}
                        />
                      </React.Fragment>
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
                : processedMenuItems.map((item, i) => {
                    return (
                      <FilterCheckboxes
                        key={i}
                        options={item.options}
                        currentmenu={item}
                        onSelectItem={onSelectItem}
                        showCounts={showCounts}
                      />
                    );
                  })}
            </DropDownMenuLayout>
          )}
        </>
      )}
      {stylesDisabled && <br />}
    </div>
  );
};

const FilterCheckboxes = ({
  options,
  currentmenu,
  onSelectItem,
  className,
  showCounts,
}: {
  options: FilterOptions;
  currentmenu: MenuItemProps;
  onSelectItem: (filterKey: keyof SearchQuery, optionKey: string) => void;
  className?: string;
  showCounts: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <DsfrCheckbox
      className={cn(
        styles.fieldset,
        "m-0 w-full p-0",
        "[&_>_div]:m-0",
        "[&_>_div_>_div]:m-0",
        "[&_label:has(.disabled)]:cursor [&_label:has(.disabled)]:bg-default-grey-hover [&_div.fr-checkbox-group:has(.disabled)]:bg-default-grey-hover",
        className,
      )}
      options={options.map((option, o) => {
        const isSelected = currentmenu.selected.includes(option.key);
        const isDisabled = showCounts && option.count === 0;

        const labelText = currentmenu.translateOptions ? t(option.value as any) : option.value;

        const ariaLabel = `${labelText}${
          showCounts
            ? isDisabled
              ? ` - ${t("Recherche.tooltipAucuneFicheCorrespondante")}`
              : ` - ${t("Recherche.relatedSheets", { count: option.count || 0 })}`
            : ""
        }`;

        return {
          label: (
            <span
              aria-label={ariaLabel}
              className={cn("flex w-full", isDisabled && "disabled")}
              id={`MenuItemTooltip${o}`}
            >
              {labelText}{" "}
              {showCounts &&
                (isDisabled ? (
                  <div className="text-mention-grey ms-auto block p-2 ps-3 pe-1 pt-[0.35rem] text-xs">
                    <Tooltip
                      kind="hover"
                      aria-hidden="true"
                      title={t("Recherche.tooltipAucuneFicheCorrespondante")}
                    >
                      {option.count ?? ""}
                    </Tooltip>
                  </div>
                ) : (
                  <span className="text-mention-grey ms-auto pe-1 pt-[0.35rem] text-xs">
                    {option.count ?? ""}
                  </span>
                ))}
            </span>
          ),
          nativeInputProps: {
            checked: isSelected,
            onChange: () => (isDisabled ? null : onSelectItem(currentmenu.filterKey, option.key)),
            "aria-disabled": isDisabled,
          },
        };
      })}
    />
  );
};

export default Filter;
