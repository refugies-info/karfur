import axios from "axios";
import { useTranslation } from "next-i18next";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cls, cn } from "~/lib/classname";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import styles from "./GeoLocationMenuItem.module.css";

const GeoLocationMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // Initialize with true if geolocation is supported (check synchronously)
  const [geolocationSupported, setGeolocationSupported] = useState(
    typeof navigator !== "undefined" && "geolocation" in navigator,
  );
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setGeolocationSupported(true);
    }
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (res) => {
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
          setPermissionDenied(false);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setPermissionDenied(true);
          }
        },
      );
    }
  };

  // Show nothing if geolocation is not supported
  if (!geolocationSupported) {
    return null;
  }

  return (
    <div className={styles.item}>
      {!permissionDenied ? (
        <button
          type="button"
          onClick={getLocation}
          onKeyDown={(e) => onEnterOrSpace(e, getLocation)}
          className={cn("w-full", styles.button)}
        >
          <i
            className={cls("fr-icon-send-plane-fill", "fr-icon--sm", styles.icon)}
            aria-hidden="true"
          />
          <span className={styles.buttonText}>
            {t("Recherche.positionButton", "Utiliser ma position")}
          </span>
        </button>
      ) : (
        <>
          {t(
            "Recherche.positionEnable",
            "Vous devez activer la géolocalisation pour votre navigateur",
          )}
        </>
      )}
    </div>
  );
};

export default GeoLocationMenuItem;
