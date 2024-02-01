import { useEffect, useMemo, useState } from "react";
import uniqBy from "lodash/uniqBy";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { formatDepartment, getDbDepartment } from "lib/departments";

const useDepartmentAutocomplete = () => {
  const [search, setSearch] = useState("");
  const [hidePredictions, setHidePredictions] = useState(false);
  const { placesService, placePredictions, getPlacePredictions } = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
    options: {
      input: search,
      componentRestrictions: { country: "fr" },
      types: ["administrative_area_level_2", "postal_code"],
      language: "fr",
    },
  });

  const getPlaceSelected = (id: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if (placesService === null) {
        resolve(null);
        return;
      }
      placesService.getDetails({ placeId: id }, (placeDetails) => {
        const departement = (placeDetails?.address_components || []).find((comp) =>
          comp.types.includes("administrative_area_level_2"),
        );
        if (!departement) {
          resolve(null)
          return;
        };
        let depName = departement.long_name;
        if (depName === "Département de Paris") depName = "Paris";
        if (depName) {
          const dbDepartmentName = getDbDepartment(depName);
          resolve(dbDepartmentName);
          return;
        }
        resolve(null);
      });
    })
  };


  useEffect(() => {
    if (search) {
      getPlacePredictions({ input: search });
      if (hidePredictions) setHidePredictions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /**
   * Re-calculate predictions to fix GMap autocomplete issues:
   * - use postal_code and departement research.
   * - if postal code, keep only first 2 digits. Then remove duplicates
   */
  const predictions = useMemo(() => {
    return uniqBy(
      placePredictions.map((p) => ({
        id: p.place_id,
        text: formatDepartment(p.structured_formatting.main_text),
      })),
      "text",
    );
  }, [placePredictions]);

  return { search, setSearch, hidePredictions, setHidePredictions, getPlaceSelected, predictions };
}

export default useDepartmentAutocomplete;
