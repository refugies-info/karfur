import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import DepartmentMenuItem from "components/Pages/recherche/LocationDropdown/DepartmentMenuItem/DepartmentMenuItem";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { onEnterOrSpace } from "lib/onEnterOrSpace";
import { Event } from "lib/tracking";
import { useCallback, useEffect, useState } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useDispatch, useSelector } from "react-redux";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { getPlaceName } from "./functions";
import styles from "./LocationDropdown.module.css";
import LocationMenuItem from "./LocationMenuItem";
import SearchMenuItem from "./SearchMenuItem";
import Separator from "./Separator";

interface Props {
  mobile?: boolean;
}

const LocationDropdown = (props: Props) => {
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);

  const [locationSearch, setLocationSearch] = useState("");
  const resetLocationSearch = useCallback(() => setLocationSearch(""), []);

  const onChangeDepartmentInput = useCallback(
    (e: any) => {
      setLocationSearch(e.target.value);
    },
    [setLocationSearch],
  );

  const { placesService, placePredictions, getPlacePredictions } = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
    //@ts-ignore
    options: {
      componentRestrictions: { country: "fr" },
      types: ["administrative_area_level_2", "locality", "postal_code"],
      language: "fr",
    },
  });
  const onSelectPrediction = useCallback(
    (id: string, name: string) => {
      Event("USE_SEARCH", "choose location option", name);
      Event("USE_SEARCH", "click filter", "location");
      placesService?.getDetails({ placeId: id }, (placeDetails) => {
        const departement = (placeDetails?.address_components || []).find((comp) =>
          comp.types.includes("administrative_area_level_2"),
        );
        let depName = departement?.long_name;
        if (depName === "Département de Paris") depName = "Paris"; // specific case to fix google API
        if (depName) {
          const oldDeps = query.departments;
          dispatch(
            addToQueryActionCreator({
              departments: [...new Set(depName ? [...oldDeps, depName] : [...oldDeps])],
              sort: "location",
            }),
          );
        }
      });
      resetLocationSearch();
    },
    [placesService, resetLocationSearch, query.departments, dispatch],
  );

  useEffect(() => {
    if (locationSearch) {
      getPlacePredictions({ input: locationSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationSearch]);

  return (
    <div className={styles.container}>
      <SearchMenuItem onChange={onChangeDepartmentInput} />
      <Separator />

      {query.departments.map((dep, i) => (
        <DepartmentMenuItem key={i} dep={dep} />
      ))}

      <LocationMenuItem />
      <Separator />

      {placePredictions.slice(0, 5).map((p, i) => (
        <DropdownMenu.Item key={i} className={styles.item}>
          <button
            onClick={() => onSelectPrediction(p.place_id, getPlaceName(p))}
            onKeyDown={(e) => onEnterOrSpace(e, () => onSelectPrediction(p.place_id, getPlaceName(p)))}
            className={styles.btn}
          >
            <span className={styles.icon}>
              <EVAIcon name="pin-outline" fill="black" size={!props.mobile ? 16 : 24} />
            </span>
            {getPlaceName(p)}
          </button>
        </DropdownMenu.Item>
      ))}
    </div>
  );
};

export default LocationDropdown;
