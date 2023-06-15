import { useState, Dispatch, SetStateAction, useEffect, useRef, useMemo } from "react";
import uniqBy from "lodash/uniqBy";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { formatDepartment, getDbDepartment } from "lib/departments";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Input from "components/Pages/dispositif/Input";
import { RemovableItem } from "../../components";
import styles from "./DepartmentInput.module.scss";

interface Props {
  selectedDepartments: string[] | null | undefined;
  setSelectedDepartments: Dispatch<SetStateAction<string[] | null | undefined>>;
}

const DepartmentInput = (props: Props) => {
  const [search, setSearch] = useState("");
  const refSuggestions = useRef<HTMLDivElement | null>(null);
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

  const onPlaceSelected = (id: string) => {
    placesService?.getDetails({ placeId: id }, (placeDetails) => {
      const departement = (placeDetails?.address_components || []).find((comp) =>
        comp.types.includes("administrative_area_level_2"),
      );
      if (!departement) return;
      let depName = departement.long_name;
      if (depName === "Département de Paris") depName = "Paris";
      if (depName) {
        const dbDepartmentName = getDbDepartment(depName);
        if (!props.selectedDepartments?.includes(dbDepartmentName)) {
          const newDeps = [...(props.selectedDepartments || []), dbDepartmentName];
          props.setSelectedDepartments(newDeps);
          setHidePredictions(true);
        }
      }
    });
  };

  useEffect(() => {
    if (search) {
      getPlacePredictions({ input: search });
      if (hidePredictions) setHidePredictions(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleChange = (e: any) => setSearch(e.target.value);

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

  return (
    <div>
      <div className="position-relative w-100">
        <Input
          id="search-department-input"
          placeholder="Exemple : “Paris” ou “75”"
          type="text"
          onChange={handleChange}
          reset={() => {
            setSearch("");
            setHidePredictions(true);
          }}
          value={search}
          icon="search-outline"
        />

        {!!(!hidePredictions && placePredictions?.length) && (
          <div className={styles.suggestions} ref={refSuggestions}>
            {predictions.slice(0, 5).map((p, i) => (
              <button
                key={i}
                onClick={(e: any) => {
                  e.preventDefault();
                  onPlaceSelected(p.id);
                }}
                className={styles.btn}
              >
                <EVAIcon name="pin-outline" fill="black" size={20} className="me-2" />
                {p.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.selected}>
        {(props.selectedDepartments || []).map((dep, i) => (
          <RemovableItem
            key={i}
            text={formatDepartment(dep)}
            onClick={() => props.setSelectedDepartments((departments) => departments?.filter((d) => d !== dep))}
          />
        ))}
      </div>
    </div>
  );
};

export default DepartmentInput;
