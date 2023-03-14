import React, { useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import ChoiceButton from "../ChoiceButton";
import styles from "./DropdownModals.module.scss";

interface Props {
  options: Record<string, string>;
  selected: string;
  setSelected: (key: string) => void;
}

const DropdownModals = (props: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((o) => !o)} className={styles.dropdown}>
      <DropdownToggle className={styles.toggle}>
        {props.options[props.selected] || ""}
        <EVAIcon name="chevron-down-outline" size={16} fill="dark" className="ms-4" />
      </DropdownToggle>
      <DropdownMenu className={styles.menu}>
        {Object.entries(props.options).map(([key, value], i) => (
          <ChoiceButton
            text={value}
            selected={props.selected === key}
            type="radio"
            key={i}
            onSelect={() => {
              props.setSelected(key);
              setDropdownOpen(false);
            }}
            className="mb-1"
          />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownModals;
