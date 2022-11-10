import React, { ReactElement, useCallback, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import { cls } from "lib/classname";
import { Event } from "lib/tracking";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Checkbox from "components/UI/Checkbox";
import { Selected } from "./SearchFilter";
import styles from "./SearchFilter.desktop.module.scss";

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  label: string | ReactElement;
  selectItem: (option: string) => void;
  gaType: string;
}

const SearchFilterDesktop = (props: Props) => {
  const { selectItem, gaType } = props;
  const [open, setOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setOpen((o) => {
      if (!o) Event("USE_SEARCH", "open filter", gaType);
      return !o;
    });
  }, [setOpen, gaType]);

  const onSelectItem = useCallback(
    (key: string) => {
      selectItem(key);
      Event("USE_SEARCH", "click filter", gaType);
    },
    [selectItem, gaType]
  );

  return (
    <Dropdown
      isOpen={open}
      direction="down"
      toggle={toggleDropdown}
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
      <DropdownMenu className={styles.menu} flip={false}>
        {props.options.map((option, i) => {
          const isSelected = props.selected.includes(option.key);
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
        })}
      </DropdownMenu>
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}
    </Dropdown>
  );
};

export default SearchFilterDesktop;
