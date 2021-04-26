import React from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
import ReactDependentScript from "react-dependent-script";
import Autocomplete from "react-google-autocomplete";
import Icon from "react-eva-icons";

const FilterButton = styled.div`
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: ${colors.blancSimple};
  border: 1px solid;
  color: ${colors.noir};
  font-weight: 700;
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
  font-weight: 700;
  border-color: #212121;
  border-radius: 12px;
  padding-top: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

export const LocalisationFilter = (props) => {
  const onPlaceSelected = (place) => {
    let el = props.recherche.filter(
      (item) => item.queryName === "localisation"
    )[0];
    let index = props.recherche.indexOf(el);
    if (place.formatted_address) {
      props.setState(place.formatted_address);
      props.selectParam(index, place);
      props.setGeoSearch(false);
    }
  };
  const handleChange = (e) => props.setState(e.target.value);

  return (
    <>
      {props.geoSearch ? (
        <FilterButton>
          <ReactDependentScript
            loadingComponent={<div>Chargement de Google Maps...</div>}
            scripts={[
              "https://maps.googleapis.com/maps/api/js?key=" +
                process.env.REACT_APP_GOOGLE_API_KEY +
                "&v=3.exp&libraries=places&language=fr&region=FR",
            ]}
          >
            <div className="position-relative">
              <Autocomplete
                ref={(input) => {
                  input && input.refs.input.focus();
                }}
                onBlur={() => props.ville === ""}
                id="villeAuto"
                value={props.ville}
                onChange={handleChange}
                onPlaceSelected={onPlaceSelected}
                types={["(regions)"]}
                componentRestrictions={{ country: "fr" }}
              />
            </div>
          </ReactDependentScript>
        </FilterButton>
      ) : (
        <SelectedFilter>
          {props.ville}
          <div onClick={() => props.setState("")}>
            <Icon name="close" fill={colors.blanc} size="large" />
          </div>
        </SelectedFilter>
      )}
    </>
  );
};
