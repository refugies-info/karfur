import React, { useEffect, useMemo, useState } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import Checkbox from "~/components/UI/Checkbox";
import { getDepartmentCodeFromName } from "~/lib/departments";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { getPlaceName } from "./functions";
import styles from "./PlaceMenuItem.module.css";

interface Props {
  p: google.maps.places.AutocompletePrediction;
  onSelectPrediction: (id: string, name: string) => void;
}

const PlaceMenuItem: React.FC<Props> = ({ p, onSelectPrediction }) => {
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
          let depName = deptComponent.long_name;
          if (depName === "Département de Paris") depName = "Paris"; // specific case to fix google API

          setDeptNo(getDepartmentCodeFromName(depName));
        }
      }
    });
  }, [placesService, p.place_id, setDeptNo]);

  const placeName = useMemo(() => getPlaceName(p), [p]);

  return (
    <Checkbox
      className={styles.item}
      onChange={() => onSelectPrediction(p.place_id, placeName)}
      onKeyDown={(e) => onEnterOrSpace(e, () => onSelectPrediction(p.place_id, placeName))}
    >
      <span>
        {placeName} {deptNo}
      </span>
    </Checkbox>
  );
};

export default PlaceMenuItem;
