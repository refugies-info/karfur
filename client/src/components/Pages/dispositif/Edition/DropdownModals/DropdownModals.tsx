import React, { useMemo, useState } from "react";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { useTranslation } from "next-i18next";
import {
  commitmentDetailsType,
  frequencyDetailsType,
  frequencyUnitType,
  priceDetails,
  timeUnitType,
} from "@refugies-info/api-types";
import { cls } from "lib/classname";
import { jsUcfirst } from "lib";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import ChoiceButton from "../ChoiceButton";
import styles from "./DropdownModals.module.scss";

type Options = commitmentDetailsType | frequencyDetailsType | timeUnitType | frequencyUnitType | priceDetails;

interface Props<T extends Options> {
  options: T[];
  selected: T;
  setSelected: (key: T) => void;
  count?: number;
}

/**
 * Dropdown used in modal forms
 */
function DropdownModals<T extends Options>(props: Props<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t } = useTranslation();

  const count = useMemo(() => (props.count === undefined ? 2 : Number.parseInt(props.count.toString())), [props.count]);

  return (
    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen((o) => !o)} className={styles.dropdown}>
      <DropdownToggle className={styles.toggle}>
        {jsUcfirst(t(`Infocards.${props.selected}`, "", { count }))}
        <EVAIcon name="chevron-down-outline" size={16} fill="dark" className={cls(styles.icon, "ms-4")} />
      </DropdownToggle>
      <DropdownMenu className={styles.menu}>
        {props.options.map((key, i) => (
          <ChoiceButton
            text={jsUcfirst(t(`Infocards.${key}`, "", { count }))}
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
}

export default DropdownModals;
