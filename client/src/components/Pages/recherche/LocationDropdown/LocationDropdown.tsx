import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { Button } from "reactstrap";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { cls } from "lib/classname";
import { onEnterOrSpace } from "lib/onEnterOrSpace";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./LocationDropdown.module.scss";
import { Event } from "lib/tracking";
import { getPlaceName } from "./functions";

interface Props {
  mobile?: boolean;
  locationSearch: string;
  resetLocationSearch: () => void;
}

const LocationDropdown = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const { locationSearch, resetLocationSearch } = props;

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

  const removeDepartement = useCallback(
    (dep: string) => {
      const newDepartments = query.departments.filter((d) => d !== dep);
      dispatch(
        addToQueryActionCreator({
          departments: newDepartments,
          sort: newDepartments.length === 0 ? "date" : "location",
        }),
      );
    },
    [dispatch, query.departments],
  );

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        axios
          .get(
            `https://geo.api.gouv.fr/communes?lat=${res.coords.latitude}&lon=${res.coords.longitude}&fields=departement&format=json&geometry=centre`,
          )
          .then((response) => {
            if (response.data[0]?.departement?.nom) {
              dispatch(
                addToQueryActionCreator({
                  departments: [response.data[0].departement.nom],
                  sort: "location",
                }),
              );
            }
          });
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={cls(styles.header, placePredictions.length === 0 && styles.no_results)}>
        {query.departments.map((dep, i) => (
          <Button
            key={i}
            className={styles.selected}
            onClick={() => removeDepartement(dep)}
            onKeyDown={(e) => onEnterOrSpace(e, () => removeDepartement(dep))}
          >
            {dep}
            <span className={styles.icon}>
              <EVAIcon name="close-outline" fill="white" size={!props.mobile ? 18 : 24} />
            </span>
          </Button>
        ))}

        <Button onClick={getLocation} onKeyDown={(e) => onEnterOrSpace(e, getLocation)} className={styles.btn}>
          <span className={styles.icon}>
            <EVAIcon name="navigation-2-outline" fill="black" size={!props.mobile ? 16 : 24} />
          </span>
          {t("Recherche.positionButton", "Position actuelle")}
        </Button>
      </div>

      {placePredictions.slice(0, 5).map((p, i) => (
        <Button
          key={i}
          onClick={() => onSelectPrediction(p.place_id, getPlaceName(p))}
          onKeyDown={(e) => onEnterOrSpace(e, () => onSelectPrediction(p.place_id, getPlaceName(p)))}
          className={styles.btn}
        >
          <span className={styles.icon}>
            <EVAIcon name="pin-outline" fill="black" size={!props.mobile ? 16 : 24} />
          </span>
          {getPlaceName(p)}
        </Button>
      ))}
    </div>
  );
};

export default LocationDropdown;
