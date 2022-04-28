import React from "react";
import { colors } from "colors";
import Autocomplete from "react-google-autocomplete";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { SearchQuery } from "pages/recherche";
import { AvailableFilters } from "data/searchFilters";
import { cls } from "lib/classname";
import { useTranslation } from "react-i18next";
import styles from "../MobileAdvancedSearch.module.scss";

interface Props {
  setVille: (ville: string) => void;
  ville: string;
  geoSearch: boolean;
  setGeoSearch: (geosearch: boolean) => void;
  addToQuery: (query: Partial<SearchQuery>) => void;
  removeFromQuery: (filter: AvailableFilters) => void;
}

export const LocalisationFilter = (props: Props) => {
  const { t } = useTranslation();

  const onPlaceSelected = (place: any) => {
    if (place.formatted_address) {
      props.setVille(place.formatted_address);
      props.addToQuery({
        loc: {
          city: place.address_components[0].long_name,
          dep: place.address_components[1].long_name,
        },
      });
      props.setGeoSearch(false);
    }
  };
  const handleChange = (e: any) => props.setVille(e.target.value);

  // maps autocomplete field
  if (props.geoSearch) {
    return (
      <div className={styles.search_btn}>
        <Autocomplete
          apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || ""}
          onBlur={() => props.ville === ""}
          id="villeAuto"
          value={props.ville}
          onChange={handleChange}
          onPlaceSelected={onPlaceSelected}
          options={{
            componentRestrictions: { country: "fr" },
          }}
          className={styles.autocomplete}
          autoFocus
        />
      </div>
    );
  }

  // city selected
  if (props.ville) {
    return (
      <div className={cls(styles.search_btn, styles.selected)}>
        {props.ville}
        <span
          onClick={() => {
            props.setVille("");
            props.removeFromQuery("loc");
          }}
        >
          <EVAIcon name="close" fill={colors.gray10} size="medium" />
        </span>
      </div>
    );
  }

  // default state
  return (
    <button
      className={styles.search_btn}
      onClick={() => props.setGeoSearch(true)}
    >
      {t("SearchItem.choisir ma ville", "choisir ma ville")}
      <EVAIcon name="pin-outline" fill="#212121" size="medium" />
    </button>
  );
};
