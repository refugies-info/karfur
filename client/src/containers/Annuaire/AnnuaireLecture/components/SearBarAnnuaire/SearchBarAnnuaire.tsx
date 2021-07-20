import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../../../colors";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import "./SearchBarAnnuaire.scss";
import { Input } from "reactstrap";
// @ts-ignore
import ReactDependentScript from "react-dependent-script";
import Autocomplete from "react-google-autocomplete";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { StructureTypes } from "../../../AnnuaireCreate/data";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import { SimplifiedStructure } from "types/interface";

const MainContainer = styled.div`
  display: flex;
  margin-top: 146px;
  margin-left: 77px;
  height: 74px;
  background-color: ${colors.bleuCharte};
  border-radius: 12px;
  padding: 12px;
`;

const TextInputContainer = styled(Input)`
  display: flex;
  height: 50px;
  background: ${colors.blanc};
  padding: 12px;
  border: 0.5px solid #ffffff;
  border-radius: 12px;
  font-size: 16px;
  margin-right: 12px;
  align-items: center;
`;

const DropDownItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0px;
  background: #e0e0e0;
  padding: 16px;
  border-radius: 12px;
  align-items: left;
  width: max-content;
`;

const WhiteButtonContainer = styled.div`
  display: flex;
  height: 50px;
  background: ${colors.blanc};
  padding: 12px;
  border: 0.5px solid #ffffff;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  align-items: center;
  margin-right: 12px;
`;
const DarkButtonContainer = styled.div`
  display: flex;
  height: 50px;
  background: ${colors.noir};
  padding: 12px;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  align-items: center;
  margin-right: 12px;
  color: ${colors.blanc};
`;
const ResultNumberContainer = styled.div`
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
  color: ${colors.blanc};
`;

interface Props {
  t: any;
  filteredStructures: SimplifiedStructure[] | null;
  resetSearch: () => void;
  keyword: string;
  setKeyword: (a: string) => void;
  typeSelected: string[] | null;
  setTypeSelected: (a: string[]) => void;
  ville: string;
  setVille: (a: string) => void;
  depName: string;
  setDepName: (a: string) => void;
  depNumber: string | null;
  setDepNumber: (a: string) => void;
  isCityFocus: boolean;
  setIsCityFocus: (a: boolean) => void;
  isCitySelected: boolean;
  setIsCitySelected: (a: boolean) => void;
}

export const SearchBarAnnuaire = (props: Props) => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const selectType = (item: string) => {
    if (props.typeSelected && !props.typeSelected.includes(item)) {
      let newTypesSelected = props.typeSelected.concat([item]);
      props.setTypeSelected(newTypesSelected);
    }

    toggle();
  };

  const onChangeKeywords = (e: any) => props.setKeyword(e.target.value);

  const handleChange = (e: any) => props.setVille(e.target.value);

  const onPlaceSelected = (place: any) => {
    if (
      place.address_components.find((item: any) =>
        item.types.includes("postal_code")
      )
    ) {
      props.setDepNumber(
        place.address_components
          .find((item: any) => item.types.includes("postal_code"))
          .long_name.substr(0, 2)
      );
    }
    if (
      place.address_components.find((item: any) =>
        item.types.includes("administrative_area_level_2")
      )
    ) {
      if (
        place.address_components.find((item: any) =>
          item.types.includes("administrative_area_level_2")
        ).long_name === "Département de Paris"
      ) {
        props.setDepName("Paris");
      } else {
        props.setDepName(
          place.address_components.find((item: any) =>
            item.types.includes("administrative_area_level_2")
          ).long_name
        );
      }
    }
    props.setIsCityFocus(false);
    if (place.formatted_address) {
      props.setVille(place.formatted_address);
      props.setIsCitySelected(true);
    }
  };

  const resetCity = () => {
    props.setIsCitySelected(false);
    props.setVille("");
    props.setDepNumber("");
    props.setDepName("");
    props.resetSearch();
  };

  const removeType = (item: string) => {
    let array = props.typeSelected
      ? props.typeSelected.filter((el) => el !== item)
      : [];
    props.setTypeSelected(array);
    toggle();
  };

  return (
    <MainContainer>
      <WhiteButtonContainer>
        <TextInputContainer
          onChange={onChangeKeywords}
          type="text"
          plaintext={true}
          placeholder={props.t(
            "Annuaire.Rechercher par",
            "Rechercher par nom ..."
          )}
          value={props.keyword}
        />
        {}

        {props.keyword === "" ? (
          <EVAIcon
            name="search-outline"
            fill={colors.noir}
            id="bookmarkBtn"
            className="ml-10"
            size={"large"}
          />
        ) : (
          <EVAIcon
            name="close-circle"
            fill={colors.noir}
            id="bookmarkBtn"
            className="ml-10"
            size={"large"}
            onClick={() => props.setKeyword("")}
          />
        )}
      </WhiteButtonContainer>
      {props.ville === "" && !props.isCityFocus ? (
        <WhiteButtonContainer>
          <EVAIcon
            name="pin-outline"
            fill={colors.noir}
            className="mr-10"
            id="bookmarkBtn"
            size={"large"}
          />
          <div
            onClick={() => {
              props.setIsCityFocus(true);
            }}
          >
            {props.t("Annuaire.Ville ou département", "Ville ou département")}
          </div>{" "}
        </WhiteButtonContainer>
      ) : props.isCitySelected ? (
        <DarkButtonContainer>
          <EVAIcon
            name="pin-outline"
            fill={colors.blancSimple}
            className="mr-10"
            id="bookmarkBtn"
            size={"large"}
          />
          <div
            onClick={() => {
              props.setIsCitySelected(false);
            }}
          >
            {props.ville}
          </div>{" "}
          <EVAIcon
            name="close-circle"
            fill={colors.blancSimple}
            className="ml-10"
            size={"large"}
            onClick={() => {
              resetCity();
            }}
          />
        </DarkButtonContainer>
      ) : (
        <WhiteButtonContainer>
          <EVAIcon
            name="pin-outline"
            fill={colors.noir}
            className="mr-10"
            id="bookmarkBtn"
            size={"large"}
          />
          <ReactDependentScript
            loadingComponent={<div>Chargement de Google Maps...</div>}
            scripts={[
              "https://maps.googleapis.com/maps/api/js?key=" +
                process.env.REACT_APP_GOOGLE_API_KEY +
                "&v=3.exp&libraries=places&language=fr&region=FR",
            ]}
          >
            <div className="position-relative">
              {true && ( //@ts-ignore
                <Autocomplete
                  ref={(input: any) => {
                    input && input.refs.input.focus();
                  }}
                  className="autocomplete"
                  onBlur={() => {
                    props.setIsCityFocus(false);
                  }}
                  placeholder={""}
                  id="villeAuto"
                  value={props.ville}
                  onChange={handleChange}
                  onPlaceSelected={onPlaceSelected}
                  types={["(cities)"]}
                  componentRestrictions={{ country: "fr" }}
                />
              )}
              <EVAIcon
                name="close-circle"
                size="large"
                className="ml-10"
                onClick={() => {}}
              />
            </div>
          </ReactDependentScript>
        </WhiteButtonContainer>
      )}{" "}
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          caret={false}
          className={
            props.typeSelected && props.typeSelected.length === 0
              ? "typeButton whiteButton"
              : "typeButton typeSelected"
          }
        >
          {props.typeSelected && props.typeSelected.length === 1
            ? props.typeSelected[0]
            : props.typeSelected && props.typeSelected.length > 1
            ? props.typeSelected.length + " types"
            : props.t("Annuaire.Type de structure", "Type de structure")}
          {props.typeSelected && props.typeSelected.length > 0 && (
            <EVAIcon
              name="close-circle"
              fill={colors.blancSimple}
              onClick={(e: any) => {
                e.stopPropagation();
                props.setTypeSelected([]);
                props.resetSearch();
              }}
              id="bookmarkBtn"
              className="ml-10"
              size={"large"}
            />
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropDownItemContainer>
            {StructureTypes.map((item: string, key) => {
              return (
                <FButton
                  onClick={() => {
                    selectType(item);
                  }}
                  type="white"
                  style={
                    props.typeSelected && props.typeSelected.includes(item)
                      ? { border: "2px black solid" }
                      : {}
                  }
                  className="mb-8"
                  key={key}
                >
                  {item}

                  {props.typeSelected && props.typeSelected.includes(item) && (
                    <EVAIcon
                      name="close-circle"
                      fill={colors.blancSimple}
                      onClick={(e: any) => {
                        e.stopPropagation();
                        removeType(item);
                      }}
                      id="bookmarkBtn"
                      className="ml-10"
                      size={"large"}
                    />
                  )}
                </FButton>
              );
            })}
          </DropDownItemContainer>
        </DropdownMenu>
      </Dropdown>
      <ResultNumberContainer>
        {props.filteredStructures ? props.filteredStructures.length : 0}{" "}
        {props.t("AdvancedSearch.résultats", "résultats")}
      </ResultNumberContainer>
    </MainContainer>
  );
};
