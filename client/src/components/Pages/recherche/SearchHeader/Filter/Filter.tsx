import React, { useCallback, useEffect, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu } from "reactstrap";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import Checkbox from "components/UI/Checkbox";
import DropdownButton from "./DropdownButton";
import styles from "./Filter.module.scss";

export type Selected = AgeOptions | FrenchOptions | string;
export type FilterOptions = { key: Selected; value: string | React.ReactNode }[];

type OptionsDropdown = {
  options: FilterOptions;
  selected: Selected[];
  selectItem: (option: string[]) => void;
};

type MenuDropdown = {
  menu: React.ReactNode;
  reset: () => void;
};

interface Props {
  label: string;
  value: string[];
  gaType: string;
  dropdownMenu: OptionsDropdown | MenuDropdown;
}

const Filter = (props: Props) => {
  const { gaType } = props;
  const [open, setOpen] = useState(false);

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

  const onSelectItem = (key: string) => {
    if (!optionsDropdown) return;
    const newSelected = optionsDropdown.selected.includes(key)
      ? [...optionsDropdown.selected].filter((opt) => opt !== key)
      : [...optionsDropdown.selected, key];

    optionsDropdown.selectItem(newSelected);
    Event("USE_SEARCH", "click filter", gaType);
  };

  const resetOptions = () => {
    if (menuDropdown) menuDropdown.reset();
    else if (optionsDropdown) optionsDropdown.selectItem([]);
  };

  useEffect(() => {
    const handleKey = (e: any) => (e.key === "Escape" ? setOpen(false) : {});
    document.addEventListener("keyup", handleKey);

    return () => {
      document.removeEventListener("keyup", handleKey);
    };
  }, []);

  return (
    <Dropdown isOpen={open} direction="down" toggle={toggleDropdown}>
      <DropdownButton
        label={props.label}
        value={props.value}
        onClick={toggleDropdown}
        onClear={resetOptions}
        isOpen={open}
      />
      <DropdownMenu className={styles.menu} flip={false}>
        {optionsDropdown
          ? optionsDropdown.options.map((option, i) => {
              const isSelected = optionsDropdown.selected.includes(option.key);
              return (
                <DropdownItem
                  key={i}
                  onClick={() => onSelectItem(option.key)}
                  className={cls(styles.item, isSelected && styles.selected)}
                  toggle={false}
                >
                  <Checkbox checked={isSelected} color={isSelected ? "white" : "black"}>
                    {option.value}
                  </Checkbox>
                </DropdownItem>
              );
            })
          : menuDropdown?.menu}
      </DropdownMenu>
    </Dropdown>
  );
};

export default Filter;
