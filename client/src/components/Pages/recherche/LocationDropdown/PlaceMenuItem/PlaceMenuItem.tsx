import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getDepartmentCodeFromName } from "lib/departments";
import React, { useEffect, useState } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { getPlaceName } from "../functions";
import CheckboxIcon from "./CheckboxIcon";
import styles from "./PlaceMenuItem.module.css";

interface Props {
  p: google.maps.places.AutocompletePrediction;
  onSelectPrediction: (id: string, name: string) => void;
}

const PlaceMenuItem: React.FC<Props> = ({ p }) => {
  const [deptNo, setDeptNo] = useState<string | undefined>(undefined);

  const { placesService } = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
    //@ts-ignore
    options: {
      componentRestrictions: { country: "fr" },
      types: ["administrative_area_level_2", "locality", "postal_code"],
      language: "fr",
    },
  });

  useEffect(() => {
    placesService?.getDetails({ placeId: p.place_id, fields: ["address_components"] }, (placeDetails) => {
      if (placeDetails) {
        const deptComponent = placeDetails.address_components?.find((component) =>
          component.types.includes("administrative_area_level_2"),
        );
        if (deptComponent) {
          setDeptNo(getDepartmentCodeFromName(deptComponent.long_name));
        }
      }
    });
  }, [placesService, p.place_id, setDeptNo]);

  return (
    <DropdownMenu.DropdownMenuItem className={styles.item} onClick={(e) => e.preventDefault()}>
      <CheckboxIcon />
      <span>
        {getPlaceName(p)} {deptNo}
      </span>
    </DropdownMenu.DropdownMenuItem>
  );
};

export default PlaceMenuItem;
