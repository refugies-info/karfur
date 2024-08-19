import Separator from "components/UI/Separator";
import { getDepartmentCodeFromName } from "lib/departments";
import { Event } from "lib/tracking";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { useDispatch, useSelector } from "react-redux";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import CommonPlaceMenuItem from "./CommonPlaceMenuItem";
import DepartmentMenuItem from "./DepartmentMenuItem";
import styles from "./LocationMenu.module.css";
import LocationMenuItem from "./LocationMenuItem";
import PlaceMenuItem from "./PlaceMenuItem";
import SearchMenuItem from "./SearchMenuItem";

const commonPlaces = [
  { placeName: "Paris", deptNo: "75" },
  { placeName: "Lyon", deptNo: "69" },
  { placeName: "Strasbourg", deptNo: "67" },
  { placeName: "Nantes", deptNo: "44" },
  { placeName: "Dijon", deptNo: "21" },
  { placeName: "Bordeaux", deptNo: "33" },
  { placeName: "Grenoble", deptNo: "38" },
  { placeName: "Toulouse", deptNo: "34" },
  { placeName: "Rennes", deptNo: "35" },
  { placeName: "Marseille", deptNo: "13" },
];

interface Props {
  mobile?: boolean;
}

const LocationMenu: React.FC<Props> = () => {
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

  const debouncedOnChangeDepartmentInput = useMemo(() => debounce(onChangeDepartmentInput), [onChangeDepartmentInput]);

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
      placesService?.getDetails({ placeId: id, fields: ["address_components"] }, (placeDetails) => {
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

  const onSelectCommonPlace = useCallback(
    (depName: string) => {
      const oldDeps = query.departments;
      dispatch(
        addToQueryActionCreator({
          departments: [...new Set(depName ? [...oldDeps, depName] : [...oldDeps])],
          sort: "location",
        }),
      );
    },
    [query.departments, dispatch],
  );

  useEffect(() => {
    if (locationSearch) {
      getPlacePredictions({ input: locationSearch });
    }
  }, [locationSearch, getPlacePredictions]);

  const queryDepartmentCodes = useMemo(() => {
    return query.departments.map((dep) => getDepartmentCodeFromName(dep));
  }, [query.departments]);

  return (
    <div className={styles.container}>
      <SearchMenuItem onChange={debouncedOnChangeDepartmentInput} />
      <Separator />

      <div className={styles.departments}>
        {query.departments.map((depName, i) => (
          <DepartmentMenuItem key={i} dep={depName} />
        ))}
      </div>

      <LocationMenuItem />

      <div className={styles.places}>
        {(locationSearch === "" || placePredictions.length > 0) && <Separator />}
        {locationSearch !== "" &&
          placePredictions
            .slice(0, 5)
            .map((p, i) => <PlaceMenuItem key={i} p={p} onSelectPrediction={onSelectPrediction} />)}
        {locationSearch === "" &&
          commonPlaces
            .filter(({ deptNo }) => !queryDepartmentCodes.includes(deptNo))
            .map(({ deptNo, placeName }) => (
              <CommonPlaceMenuItem
                key={deptNo}
                placeName={placeName}
                deptNo={deptNo}
                onSelectCommonPlace={onSelectCommonPlace}
              />
            ))}
      </div>
    </div>
  );
};

export default LocationMenu;
