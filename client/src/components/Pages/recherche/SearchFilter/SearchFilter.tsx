import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./SearchFilter.module.scss";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import Checkbox from "components/UI/Checkbox";

interface Props {
  options: { key: string; value: string }[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  label: string;
}

const SearchFilter = (props: Props) => {
  const [open, setOpen] = useState(false);

  const selectItem = (option: string) => {
    if (props.selected.includes(option)) {
      // remove
      props.setSelected((o) => [...o].filter((opt) => opt !== option));
    } else {
      // add
      props.setSelected((o) => [...o, option]);
    }
  };

  return (
    <Dropdown
      isOpen={open}
      toggle={() => setOpen((o) => !o)}
      className={cls(styles.dropdown, open && styles.show, props.selected.length > 0 && styles.selected)}
    >
      <DropdownToggle>
        {props.label}
        <EVAIcon name="chevron-down-outline" fill={props.selected.length > 0 ? "white" : "gray"} size={20} />
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
