import React, { ReactElement, useCallback } from "react";
import { Button } from "reactstrap";
import { cls } from "lib/classname";
import { Selected } from "./SecondaryFilter";
import styles from "./SecondaryFilter.mobile.module.scss";
import { useEvent } from "hooks";

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  label: string | ReactElement;
  selectItem: (option: string) => void;
  gaType: string;
}

const SecondaryFilterMobile = (props: Props) => {
  const { Event } = useEvent();
  const { selectItem, gaType } = props;

  const onSelectItem = useCallback(
    (key: string) => {
      selectItem(key);
      Event("USE_SEARCH", "click filter", gaType);
    },
    [selectItem, Event, gaType],
  );

  return (
    <div className={styles.container}>
      <label>{props.label}</label>
      <div>
        {props.options.map((option, i) => {
          const isSelected = props.selected.includes(option.key);
          return (
            <Button
              key={i}
              onClick={() => onSelectItem(option.key)}
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

export default SecondaryFilterMobile;
