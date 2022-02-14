import React from "react";
import styled from "styled-components";
import { colors } from "colors";
import Autocomplete from "react-google-autocomplete";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";

const FilterButton = styled.div`
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: ${colors.blancSimple};
  border: 1px solid;
  color: ${colors.noir};
  font-weight: bold;
  border-color: ${colors.noir};
  border-radius: 12px;
  padding-top: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const SelectedFilter = styled.div`
  align-items: center;
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: ${colors.noir};
  color: ${colors.blanc};
  text-align: left;
  font-weight: bold;
  border-color: #212121;
  border-radius: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

export const LocalisationFilter = (props) => {
  const localisationQuery = props.recherche.filter(
    (item) => item.queryName === "localisation"
  )[0];
  const index = props.recherche.indexOf(localisationQuery);

  const onPlaceSelected = (place) => {
    if (place.formatted_address) {
      props.setState(place.formatted_address);
      props.addParamasInRechercher(index, place);
      props.setGeoSearch(false);
    }
  };
  const handleChange = (e) => props.setState(e.target.value);

  return (
    <>
      {props.geoSearch ? (
        <FilterButton>
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
        </FilterButton>
      ) : (
        <SelectedFilter>
          {props.ville}
          <div
            onClick={() => {
              props.setState("");
              props.desactiver(index);
            }}
          >
            <EVAIcon name="close" fill={colors.blanc} size="large" />
          </div>
        </SelectedFilter>
      )}
    </>
  );
};
