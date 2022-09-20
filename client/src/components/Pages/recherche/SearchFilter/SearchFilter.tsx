import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./SearchFilter.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import Checkbox from "components/UI/Checkbox";
import { AgeOptions, FrenchOptions } from "data/searchFilters";

type SetSelected = Dispatch<SetStateAction<AgeOptions[]>> |
  Dispatch<SetStateAction<FrenchOptions[]>> |
  Dispatch<SetStateAction<string[]>>;
type Selected = AgeOptions | FrenchOptions | string;

interface Props {
  options: { key: Selected; value: string }[];
  selected: Selected[];
  setSelected: SetSelected;
  label: string;
}

const SearchFilter = (props: Props) => {
  const [open, setOpen] = useState(false);

  const selectItem = (option: string) => {
    if (props.selected.includes(option)) {
      //@ts-ignore remove
      props.setSelected((o: Selected[]) => [...o].filter((opt) => opt !== option));
    } else {
      //@ts-ignore add
      props.setSelected((o: Selected[]) => [...o, option]);
    }
  };

  return (
    <Dropdown
      isOpen={open}
      toggle={() => setOpen((o) => !o)}
      className={cls(styles.dropdown, open && styles.show, props.selected.length > 0 && styles.selected)}
    >
      <DropdownToggle>
        <span className={styles.value}>
          {props.label}
        </span>
        <EVAIcon
          className={styles.icon}
          name="chevron-down-outline"
          fill={props.selected.length > 0 ? "white" : "gray"}
          size={20}
        />
      </DropdownToggle>
      <DropdownMenu className={styles.menu}>
        {props.options.map((option, i) => {
          const isSelected = props.selected.includes(option.key);
          return (
            <DropdownItem
              key={i}
              onClick={() => selectItem(option.key)}
              className={cls(styles.item, isSelected && styles.selected)}
            >
              <Checkbox checked={isSelected} color={isSelected ? "white" : "black"}>
                {option.value}
              </Checkbox>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </Dropdown>
  );
};

export default SearchFilter;
