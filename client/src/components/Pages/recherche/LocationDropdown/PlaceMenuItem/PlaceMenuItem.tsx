import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { getPlaceName } from "../functions";
import CheckboxIcon from "./CheckboxIcon";
import styles from "./PlaceMenuItem.module.css";

interface Props {
  p: google.maps.places.AutocompletePrediction;
  onSelectPrediction: (id: string, name: string) => void;
}

const PlaceMenuItem: React.FC<Props> = ({ p }) => {
  return (
    <DropdownMenu.DropdownMenuItem className={styles.item} onClick={(e) => e.preventDefault()}>
      <CheckboxIcon />
      <span>{getPlaceName(p)}</span>
    </DropdownMenu.DropdownMenuItem>
  );
};

export default PlaceMenuItem;
