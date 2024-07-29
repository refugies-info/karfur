import Checkbox from "components/UI/Checkbox";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import { Event } from "lib/tracking";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItem, DropdownMenu } from "reactstrap";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { SearchQuery } from "services/SearchResults/searchResults.reducer";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import DropdownButton from "./DropdownButton";
import styles from "./Filter.module.scss";

export type Selected = AgeOptions | FrenchOptions | string;
export type FilterOptions = { key: Selected; value: string; count: number }[];

type OptionsDropdown = {
  filterKey: keyof SearchQuery;
  options: FilterOptions;
  selected: Selected[];
  translateOptions?: boolean;
};

type MenuDropdown = {
  menu: React.ReactNode;
  value: string[];
  reset: () => void;
};

interface Props {
  label: string;
  gaType: string;
  dropdownMenu: OptionsDropdown | MenuDropdown;
}

const Filter = (props: Props) => {
  const { t } = useTranslation();
  const { gaType } = props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const optionsDropdown: OptionsDropdown | null = !!(props.dropdownMenu as OptionsDropdown).options
    ? (props.dropdownMenu as OptionsDropdown)
    : null;
  const menuDropdown: MenuDropdown | null = !!(props.dropdownMenu as MenuDropdown).menu
    ? (props.dropdownMenu as MenuDropdown)
    : null;

  const toggleDropdown = useCallback(() => {
    setOpen((o) => {
      if (!o) Event("USE_SEARCH", "open filter", gaType);
      return !o;
    });
  }, [gaType]);

  const addToQuery = useCallback(
    (query: Partial<SearchQuery>) => {
      dispatch(addToQueryActionCreator(query));
    },
    [dispatch],
  );

  const onSelectItem = (key: string) => {
    if (!optionsDropdown) return;
    const newSelected = optionsDropdown.selected.includes(key)
      ? [...optionsDropdown.selected].filter((opt) => opt !== key)
      : [...optionsDropdown.selected, key];

    addToQuery({ [optionsDropdown.filterKey]: newSelected });
    Event("USE_SEARCH", "click filter", gaType);
  };

  const resetOptions = () => {
    if (menuDropdown) menuDropdown.reset();
    else if (optionsDropdown) addToQuery({ [optionsDropdown.filterKey]: [] });
  };

  useEffect(() => {
    const handleKey = (e: any) => (e.key === "Escape" ? setOpen(false) : {});
    document.addEventListener("keyup", handleKey);

    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  }, []);

  const query = useSelector(searchQuerySelector);
  const value = useMemo(() => {
    if (menuDropdown) return menuDropdown.value;
    // get value from filters with key and translate it
    if (optionsDropdown) {
      const querySelected = query[optionsDropdown.filterKey];
      if (Array.isArray(querySelected)) {
        return querySelected
          .map((selected) => {
            const val = optionsDropdown.options.find((a) => a.key === selected)?.value;
            //@ts-ignore
            if (val) return t(val);
            return null;
          })
          .filter((v) => v !== null) as string[];
      }
    }
    return [];
  }, [menuDropdown, optionsDropdown, query, t]);

  return (
    <Dropdown isOpen={open} direction="down" toggle={toggleDropdown}>
      <DropdownButton label={props.label} value={value} onClick={toggleDropdown} onClear={resetOptions} isOpen={open} />
      <DropdownMenu className={styles.menu} flip={false}>
        {optionsDropdown
          ? optionsDropdown.options.map((option, i) => {
              const isSelected = optionsDropdown.selected.includes(option.key);
              const isDisabled = option.count === 0;
              return (
                <DropdownItem
                  key={i}
                  onClick={() => onSelectItem(option.key)}
                  className={styles.item}
                  toggle={false}
                  disabled={isDisabled}
                >
                  <Checkbox className={styles.checkbox} checked={isSelected} disabled={isDisabled}>
                    {optionsDropdown.translateOptions
                      ? //@ts-ignore
                        t(option.value)
                      : option.value}
                  </Checkbox>
                  <div className={styles.countContainer}>
                    <div className={styles.count}>{option.count ?? ""}</div>
                  </div>
                </DropdownItem>
              );
            })
          : menuDropdown?.menu}
      </DropdownMenu>
      {open && <div className={styles.backdrop} onClick={toggleDropdown} />}
    </Dropdown>
  );
};

export default Filter;
