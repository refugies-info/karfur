import debounce from "lodash/debounce";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchEventName } from "~/hooks";
import { getDepartmentCodeFromName, getDepartmentNameFromCode } from "~/lib/departments";
import { Event } from "~/lib/tracking";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import { useSearchCounts } from "../SearchCountsContext";
import CommonPlaceFilterItem from "./CommonPlaceFilterItem";
import DepartmentFilterItem from "./DepartmentFilterItem";
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
  { placeName: "Toulouse", deptNo: "31" },
  { placeName: "Rennes", deptNo: "35" },
  { placeName: "Marseille", deptNo: "13" },
];

interface Props {
  mobile?: boolean;
}

const LocationMenu: React.FC<Props> = () => {
  const searchCounts = useSearchCounts();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const eventName = useSearchEventName();

  const [locationSearch, setLocationSearch] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const resetLocationSearch = useCallback(() => {
    setLocationSearch("");
    setSuggestions([]);
  }, []);

  const onChangeDepartmentInput = useCallback(
    (e: any) => {
      const search = e.target.value;
      setLocationSearch(search);
      if (search.length > 2) {
        fetch(`https://data.geopf.fr/geocodage/search?q=${search}&type=municipality`)
          .then((response) => response.json())
          .then((data) => {
            if (data.features) {
              setSuggestions(data.features);
            }
          });
      } else {
        setSuggestions([]);
      }
    },
    [setLocationSearch],
  );

  const debouncedOnChangeDepartmentInput = useMemo(
    () => debounce(onChangeDepartmentInput, 500),
    [onChangeDepartmentInput],
  );

  const onSelectPrediction = useCallback(
    (place: any) => {
      Event(eventName, "choose location option", place.properties.label);
      Event(eventName, "click filter", "location");
      const contextParts = place.properties.context.split(", ");
      if (contextParts.length > 1) {
        const depName = contextParts[1];
        const oldDeps = query.departments;
        dispatch(
          addToQueryActionCreator({
            departments: [...new Set([...oldDeps, depName])],
            sort: "location",
          }),
        );
      }
      resetLocationSearch();
    },
    [resetLocationSearch, query.departments, dispatch, eventName],
  );

  const onSelectCommonPlace = useCallback(
    (depName: string) => {
      Event(eventName, "choose location suggestion", depName);
      const oldDeps = query.departments;
      dispatch(
        addToQueryActionCreator({
          departments: [...new Set(depName ? [...oldDeps, depName] : [...oldDeps])],
          sort: "location",
        }),
      );
    },
    [query.departments, dispatch, eventName],
  );

  const queryDepartmentCodes = useMemo(() => {
    return query.departments.map((dep) => getDepartmentCodeFromName(dep));
  }, [query.departments]);

  // No department counts shown anymore

  return (
    <div className={styles.container}>
      <SearchMenuItem onChange={debouncedOnChangeDepartmentInput} />

      <div className={styles.departments}>
        {query.departments.map((depName, i) => (
          <DepartmentFilterItem key={i} dep={depName} />
        ))}
      </div>

      <LocationMenuItem />

      <div className={styles.places}>
        {locationSearch !== "" &&
          suggestions
            .slice(0, 5)
            .map((p, i) => <PlaceMenuItem key={i} p={p} onSelectPrediction={onSelectPrediction} />)}
        {locationSearch === "" &&
          commonPlaces
            .filter(({ deptNo }) => !queryDepartmentCodes.includes(deptNo))
            .map(({ deptNo, placeName }) => {
              return (
                <CommonPlaceFilterItem
                  key={deptNo}
                  placeName={placeName}
                  deptNo={deptNo}
                  onSelectCommonPlace={onSelectCommonPlace}
                />
              );
            })}
      </div>
    </div>
  );
};

export default LocationMenu;
