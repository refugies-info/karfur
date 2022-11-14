import React, { ReactElement } from "react";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import SearchFilterMobile from "./SearchFilter.mobile";
import SearchFilterDesktop from "./SearchFilter.desktop";

export type Selected = AgeOptions | FrenchOptions | string;

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  setSelected: (selected: Selected[]) => void;
  label: string | ReactElement;
  mobile: boolean;
  gaType: string;
}

const SearchFilter = (props: Props) => {
  const selectItem = (option: string) => {
    if (props.selected.includes(option)) {
      props.setSelected([...props.selected].filter((opt) => opt !== option));
    } else {
      props.setSelected([...props.selected, option]);
    }
  };

  return !props.mobile ? (
    <SearchFilterDesktop
      label={props.label}
      selected={props.selected}
      options={props.options}
      selectItem={selectItem}
      gaType={props.gaType}
    />
  ) : (
    <SearchFilterMobile
      label={props.label}
      selected={props.selected}
      options={props.options}
      selectItem={selectItem}
      gaType={props.gaType}
    />
  );
};

export default SearchFilter;
