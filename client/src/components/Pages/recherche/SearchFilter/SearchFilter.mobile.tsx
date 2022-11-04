import React, { ReactElement } from "react";
import { Button } from "reactstrap";
import { cls } from "lib/classname";
import { Selected } from "./SearchFilter";
import styles from "./SearchFilter.mobile.module.scss";

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  label: string|ReactElement;
  selectItem: (option: string) => void;
}

const SearchFilterMobile = (props: Props) => {
  return (
    <div className={styles.container}>
      <label>{props.label}</label>
      <div>
        {props.options.map((option, i) => {
          const isSelected = props.selected.includes(option.key);
          return (
            <Button
              key={i}
              onClick={() => props.selectItem(option.key)}
              className={cls(styles.item, isSelected && styles.selected)}
            >
              {option.value}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SearchFilterMobile;
