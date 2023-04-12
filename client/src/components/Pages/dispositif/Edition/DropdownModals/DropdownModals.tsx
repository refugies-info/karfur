import React, { useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { commitmentDetailsType, frequencyDetailsType, frequencyUnitType, priceDetails, timeUnitType } from "api-types";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import ChoiceButton from "../ChoiceButton";
import styles from "./DropdownModals.module.scss";

type Options = commitmentDetailsType | frequencyDetailsType | timeUnitType | frequencyUnitType | priceDetails;

interface Props<T extends Options> {
  options: Record<T, string>;
  selected: T;
  setSelected: (key: T) => void;
}

/**
 * Dropdown used in modal forms
 */
function DropdownModals<T extends Options>(props: Props<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((o) => !o)} className={styles.dropdown}>
      <DropdownToggle className={styles.toggle}>
        {props.options[props.selected] || ""}
        <EVAIcon name="chevron-down-outline" size={16} fill="dark" className={cls(styles.icon, "ms-4")} />
      </DropdownToggle>
      <DropdownMenu className={styles.menu}>
        {Object.entries(props.options).map(([key, value], i) => (
          <ChoiceButton
            text={value as string}
            selected={props.selected === key}
            type="radio"
            key={i}
            onSelect={() => {
              props.setSelected(key as T);
              setDropdownOpen(false);
            }}
            className="mb-1"
          />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default DropdownModals;
