import React, { Dispatch, SetStateAction, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Checkbox from "components/UI/Checkbox";
import { Selected } from "./SearchFilter";
import styles from "./SearchFilter.desktop.module.scss";

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  label: string;
  selectItem: (option: string) => void;
}

const SearchFilterDesktop = (props: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      isOpen={open}
      toggle={() => setOpen((o) => !o)}
      className={cls(styles.dropdown, open && styles.show, props.selected.length > 0 && styles.selected)}
    >
      <DropdownToggle>
        <span className={styles.value}>{props.label}</span>
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
              onClick={() => props.selectItem(option.key)}
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

export default SearchFilterDesktop;
