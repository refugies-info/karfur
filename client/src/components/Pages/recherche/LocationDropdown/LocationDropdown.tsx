import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { logger } from "logger";
import React, { useCallback } from "react";
import { Button } from "reactstrap";

import styles from "./LocationDropdown.module.scss";

interface Props {
  departmentsSelected: string[];
  setDepartmentsSelected: (value: React.SetStateAction<string[]>) => void;
  predictions: any[];
  onSelectPrediction: (place_id: string) => void;
}

const LocationDropdown = (props: Props) => {
  const { setDepartmentsSelected } = props;

  const removeDepartement = useCallback(
    (dep: string) => {
      setDepartmentsSelected((deps) => deps.filter((d) => d !== dep));
    },
    [setDepartmentsSelected]
  );

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((res) => {
        // TODO : find department
        logger.info("location: ", res);
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {props.departmentsSelected.map((dep, i) => (
          <Button key={i} className={styles.selected} onClick={() => removeDepartement(dep)}>
            {dep}
            <span className={styles.icon}>
              <EVAIcon name="close-outline" fill="white" size={18} />
            </span>
          </Button>
        ))}

        <Button onClick={getLocation} className={styles.btn}>
          <span className={styles.icon}>
            <EVAIcon name="navigation-2-outline" fill="black" size={16} />
          </span>
          Position actuelle
        </Button>
      </div>

      {props.predictions.slice(0, 5).map((p, i) => (
        <Button key={i} onClick={() => props.onSelectPrediction(p.place_id)} className={styles.btn}>
          <span className={styles.icon}>
            <EVAIcon name="pin-outline" fill="black" size={16} />
          </span>
          {p.description}
        </Button>
      ))}
    </div>
  );
};

export default LocationDropdown;
