import React from "react";
import { colors } from "colors";
import Autocomplete from "react-google-autocomplete";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./LocalisationFilter.module.scss";
import { SearchQuery } from "pages/advanced-search";
import { AvailableFilters } from "data/searchFilters";

interface Props {
  setVille: (ville: string) => void
  ville: string
  geoSearch: boolean
  setGeoSearch: (geosearch: boolean) => void
  addToQuery: (query: Partial<SearchQuery>) => void;
  removeFromQuery: (filter: AvailableFilters) => void;

}

export const LocalisationFilter = (props: Props) => {
  const onPlaceSelected = (place: any) => {
    if (place.formatted_address) {
      props.setVille(place.formatted_address);
      props.addToQuery({
        loc: {
          city: place.address_components[0].long_name,
          dep: place.address_components[1].long_name,
        }
      });
      props.setGeoSearch(false);
    }
  };
  const handleChange = (e: any) => props.setVille(e.target.value);

  return (
    <>
      {props.geoSearch ? (
        <button className={styles.btn}>
          <div className="position-relative">
            <Autocomplete
              apiKey={process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY || ""}
              onBlur={() => props.ville === ""}
              id="villeAuto"
              value={props.ville}
              onChange={handleChange}
              onPlaceSelected={onPlaceSelected}
              options={{
                componentRestrictions: { country: "fr" }
              }}
            />
          </div>
        </button>
      ) : (
        <div className={styles.filter}>
          {props.ville}
          <div
            onClick={() => {
              props.setVille("");
              props.removeFromQuery("loc");
            }}
          >
            <EVAIcon name="close" fill={colors.blanc} size="large" />
          </div>
        </div>
      )}
    </>
  );
};
