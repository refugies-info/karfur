import React, { Dispatch, SetStateAction, useState } from "react";
import { AgeOptions, FrenchOptions } from "data/searchFilters";
import SearchFilterMobile from "./SearchFilter.mobile";
import SearchFilterDesktop from "./SearchFilter.desktop";

type SetSelected =
  | Dispatch<SetStateAction<AgeOptions[]>>
  | Dispatch<SetStateAction<FrenchOptions[]>>
  | Dispatch<SetStateAction<string[]>>;
export type Selected = AgeOptions | FrenchOptions | string;

interface Props {
  options: { key: Selected; value: string | React.ReactNode }[];
  selected: Selected[];
  setSelected: SetSelected;
  label: string;
  mobile: boolean;
}

const SearchFilter = (props: Props) => {
  const selectItem = (option: string) => {
    if (props.selected.includes(option)) {
      //@ts-ignore remove
      props.setSelected((o: Selected[]) => [...o].filter((opt) => opt !== option));
    } else {
      //@ts-ignore add
      props.setSelected((o: Selected[]) => [...o, option]);
    }
  };

  return !props.mobile ? (
    <SearchFilterDesktop
      label={props.label}
      selected={props.selected}
      options={props.options}
      selectItem={selectItem}
    />
  ) : (
    <SearchFilterMobile
      label={props.label}
      selected={props.selected}
      options={props.options}
      selectItem={selectItem}
    />
  );
};

export default SearchFilter;
