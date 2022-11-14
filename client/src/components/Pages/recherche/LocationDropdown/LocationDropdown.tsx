import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { Button } from "reactstrap";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { Event } from "lib/tracking";
import { cls } from "lib/classname";
import styles from "./LocationDropdown.module.scss";

interface Props {
  predictions: any[];
  onSelectPrediction: (place_id: string) => void;
  mobile?: boolean;
}

const LocationDropdown = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { onSelectPrediction } = props;

  const query = useSelector(searchQuerySelector);

  const removeDepartement = useCallback(
    (dep: string) => {
      dispatch(
        addToQueryActionCreator({
          departments: query.departments.filter((d) => d !== dep)
        })
      );
    },
    [dispatch, query.departments]
  );

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        axios
          .get(
            `https://geo.api.gouv.fr/communes?lat=${res.coords.latitude}&lon=${res.coords.longitude}&fields=departement&format=json&geometry=centre`
          )
          .then((response) => {
            if (response.data[0]?.departement?.nom) {
              dispatch(
                addToQueryActionCreator({
                  departments: [response.data[0].departement.nom]
                })
              );
            }
          });
      });
    }
  };

  const selectPrediction = useCallback(
    (placeId: any) => {
      Event("USE_SEARCH", "click filter", "location");
      onSelectPrediction(placeId);
    },
    [onSelectPrediction]
  );

  return (
    <div className={styles.container}>
      <div className={cls(styles.header, props.predictions.length === 0 && styles.no_results)}>
        {query.departments.map((dep, i) => (
          <Button key={i} className={styles.selected} onClick={() => removeDepartement(dep)}>
            {dep}
            <span className={styles.icon}>
              <EVAIcon name="close-outline" fill="white" size={!props.mobile ? 18 : 24} />
            </span>
          </Button>
        ))}

        <Button onClick={getLocation} className={styles.btn}>
          <span className={styles.icon}>
            <EVAIcon name="navigation-2-outline" fill="black" size={!props.mobile ? 16 : 24} />
          </span>
          {t("Recherche.positionButton", "Position actuelle")}
        </Button>
      </div>

      {props.predictions.slice(0, 5).map((p, i) => (
        <Button key={i} onClick={() => selectPrediction(p.place_id)} className={styles.btn}>
          <span className={styles.icon}>
            <EVAIcon name="pin-outline" fill="black" size={!props.mobile ? 16 : 24} />
          </span>
          {p.description}
        </Button>
      ))}
    </div>
  );
};

export default LocationDropdown;
