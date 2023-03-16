import { useState, Dispatch, SetStateAction, useEffect, useRef } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
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
    //@ts-ignore
    options: {
      componentRestrictions: { country: "fr" },
      types: ["administrative_area_level_2"],
    },
  });

  const onPlaceSelected = (id: string) => {
    placesService?.getDetails({ placeId: id }, (placeDetails) => {
      const departement = (placeDetails?.address_components || []).find((comp) =>
        comp.types.includes("administrative_area_level_2"),
      );
      if (!departement) return;
      // TODO: return the same way that the one stored in db today
      let depName = departement.long_name;
      if (depName === "Département de Paris") depName = "Paris";
      if (depName && !props.selectedDepartments?.includes(depName)) {
        const newDeps = [...(props.selectedDepartments || []), depName];
        props.setSelectedDepartments(newDeps);
        setHidePredictions(true);
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

  return (
    <div>
      <div className="position-relative w-100">
        <div className={styles.input}>
          <EVAIcon name="search-outline" size={20} fill={styles.lightTextMentionGrey} className="me-2" />
          <input type="text" value={search} onChange={handleChange} placeholder="Exemple : “Paris” ou “75”" autoFocus />
        </div>

        {!!(!hidePredictions && placePredictions?.length) && (
          <div className={styles.suggestions} ref={refSuggestions}>
            {placePredictions.slice(0, 5).map((p, i) => (
              <button key={i} onClick={() => onPlaceSelected(p.place_id)} className={styles.btn}>
                <EVAIcon name="pin-outline" fill="black" size={20} className="me-2" />
                {p.description}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.selected}>
        {(props.selectedDepartments || []).map((dep, i) => (
          <button
            key={i}
            className={styles.dep_btn}
            onClick={() => props.setSelectedDepartments((departments) => departments?.filter((d) => d !== dep))}
          >
            {dep}
            <EVAIcon name="close-outline" fill={styles.lightTextActionHighBlueFrance} size={24} className="ms-2" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentInput;
