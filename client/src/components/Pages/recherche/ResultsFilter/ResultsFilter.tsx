import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./ResultsFilter.module.scss";
import { Button, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import { filterType, SortOptions, sortOptions, TypeOptions } from "data/searchFilters";

interface Props {
  nbDemarches: number;
  nbDispositifs: number;
  selectedSort: SortOptions;
  setSelectedSort: Dispatch<SetStateAction<SortOptions>>;
  selectedType: TypeOptions;
  setSelectedType: Dispatch<SetStateAction<TypeOptions>>;
  showSort: boolean;
}

const ResultsFilter = (props: Props) => {
  const [open, setOpen] = useState(false);

  const getCount = (type: string) => {
    switch (type) {
      case "all":
        return `(${props.nbDemarches + props.nbDispositifs})`;
      case "demarche":
        return `(${props.nbDemarches})`;
      case "dispositif":
        return `(${props.nbDispositifs})`;
      default:
        return "";
    }
  };

  return (
    <div className={styles.container}>
      <div>
        {filterType.map((option, i) => (
          <Button
            key={i}
            className={cls(styles.btn, props.selectedType === option.key && styles.selected)}
            onClick={() => props.setSelectedType(option.key)}
          >
            {option.value} {getCount(option.key)}
          </Button>
        ))}
      </div>

      {props.showSort &&
        <Dropdown isOpen={open} toggle={() => setOpen((o) => !o)}>
          <DropdownToggle className={styles.dropdown}>
            <EVAIcon name="swap-outline" fill="black" size={20} className={styles.icon} />
            {sortOptions.find((opt) => opt.key === props.selectedSort)?.value}
          </DropdownToggle>
          <DropdownMenu className={styles.menu}>
            {sortOptions.map((option, i) => {
              const isSelected = props.selectedSort === option.key;
              return (
                <DropdownItem
                  key={i}
                  onClick={() => props.setSelectedSort(option.key)}
                  className={cls(styles.item, isSelected && styles.selected)}
                >
                  {option.value}
                  {isSelected && <EVAIcon name="checkmark-outline" fill="white" size={20} />}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      }
    </div>
  );
};

export default ResultsFilter;
