import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { cls } from "lib/classname";
import { onEnterOrSpace } from "lib/onEnterOrSpace";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import utilityStyles from "~css/utilities.module.css";
import styles from "./LocationMenuItem.module.css";

const LocationMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
    <DropdownMenu.Item className={cls(styles.item, utilityStyles.noSelect)}>
      <button onClick={getLocation} onKeyDown={(e) => onEnterOrSpace(e, getLocation)} className={styles.button}>
        <i className={cls("fr-icon-send-plane-fill", "fr-icon--sm", styles.icon)} />
        <span className={styles.buttonText}>{t("Recherche.positionButton", "Utiliser ma position")}</span>
      </button>
    </DropdownMenu.Item>
  );
};

export default LocationMenuItem;
