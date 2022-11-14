import React, { ReactElement } from "react";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import SecondaryFilterMobile from "./SecondaryFilter.mobile";
import SecondaryFilterDesktop from "./SecondaryFilter.desktop";

export type Selected = AgeOptions | FrenchOptions | string;

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  setSelected: (selected: Selected[]) => void;
  label: string | ReactElement;
  mobile: boolean;
  gaType: string;
}

const SecondaryFilter = (props: Props) => {
  const selectItem = (option: string) => {
    if (props.selected.includes(option)) {
      props.setSelected([...props.selected].filter((opt) => opt !== option));
    } else {
      props.setSelected([...props.selected, option]);
    }
  };

  return !props.mobile ? (
    <SecondaryFilterDesktop
      label={props.label}
      selected={props.selected}
      options={props.options}
      selectItem={selectItem}
      gaType={props.gaType}
    />
  ) : (
    <SecondaryFilterMobile
      label={props.label}
      selected={props.selected}
      options={props.options}
      selectItem={selectItem}
      gaType={props.gaType}
    />
  );
};

export default SecondaryFilter;
