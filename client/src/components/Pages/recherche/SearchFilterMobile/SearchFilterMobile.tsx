import React, { Dispatch, SetStateAction } from "react";
import { Button } from "reactstrap";
import { cls } from "lib/classname";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import styles from "./SearchFilterMobile.module.scss";

type SetSelected =
  | Dispatch<SetStateAction<AgeOptions[]>>
  | Dispatch<SetStateAction<FrenchOptions[]>>
  | Dispatch<SetStateAction<string[]>>;
type Selected = AgeOptions | FrenchOptions | string;

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  setSelected: SetSelected;
  label: string;
}

const SearchFilterMobile = (props: Props) => {
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
    <div className={styles.container}>
      <label>{props.label}</label>
      <div>
        {props.options.map((option, i) => {
          const isSelected = props.selected.includes(option.key);
          return (
            <Button
              key={i}
              onClick={() => selectItem(option.key)}
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
