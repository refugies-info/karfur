import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../../../colors";
import EVAIcon from "../../../../../components/UI/EVAIcon/EVAIcon";
import "./SearchBarAnnuaire.scss";
// @ts-ignore
import ReactDependentScript from "react-dependent-script";
import Autocomplete from "react-google-autocomplete";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { StructureTypes } from "../../../AnnuaireCreate/data";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
// import { NavHashLink } from "react-router-hash-link";
// import i18n from "../../../../i18n";

const MainContainer = styled.div`
  display: flex;
  margin-top: 146px;
  margin-left: 77px;
  height: 74px;
  background-color: ${colors.bleuCharte};
  border-radius: 12px;
  padding: 12px;
`;

const TextInputContainer = styled.div`
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
const ResultNumberContainer = styled.div`
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
  color: ${colors.blanc};
`;

interface Props {
  t: any;
}

export const SearchBarAnnuaire = (props: Props) => {
  const [dropdownOpen, setOpen] = useState(false);
  const [typeSelected, setTypeSelected] = useState([]);
  const [ville, setVille] = useState("");
  const [isCityFocus, setIsCityFocus] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const selectType = (item: any) => {
    let array = typeSelected;
    // @ts-ignore
    array.push(item);
    setTypeSelected(array);
    toggle();
  };

  const handleChange = (e: any) => setVille(e.target.value);

  const onPlaceSelected = () => {};

  const removeType = (item: any) => {
    let array = typeSelected.filter((el) => el !== item);
    // @ts-ignore
    setTypeSelected(array);
    toggle();
  };

  return (
    <MainContainer>
      <TextInputContainer>
        Rechercher par nom...
        <EVAIcon
          name="search-outline"
          fill={colors.noir}
          id="bookmarkBtn"
          className="ml-10"
          size={"large"}
        />
      </TextInputContainer>
      <WhiteButtonContainer>
        {ville === "" && !isCityFocus ? (
          <div
            onClick={() => {
              setIsCityFocus(true);
            }}
          >
            <EVAIcon
              name="pin-outline"
              fill={colors.noir}
              className="mr-10"
              id="bookmarkBtn"
              size={"large"}
            />
            {props.t("Annuaire.Ville ou département", "Ville ou département")}
          </div>
        ) : (
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
                  className="search-btn in-header search-autocomplete "
                  onBlur={() => {}}
                  placeholder={""}
                  id="villeAuto"
                  value={ville}
                  onChange={handleChange}
                  onPlaceSelected={onPlaceSelected}
                  types={["(cities)"]}
                  componentRestrictions={{ country: "fr" }}
                />
              )}
              <EVAIcon
                name="close-outline"
                size="large"
                className="ml-10"
                onClick={() => {}}
              />
            </div>
          </ReactDependentScript>
        )}
      </WhiteButtonContainer>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle
          caret={false}
          className={
            typeSelected.length === 0
              ? "typeButton whiteButton"
              : "typeButton typeSelected"
          }
        >
          {typeSelected.length === 1
            ? typeSelected[0]
            : typeSelected.length > 1
            ? typeSelected.length + " types"
            : props.t("Annuaire.Type de structure", "Type de structure")}
          {typeSelected.length > 0 && (
            <EVAIcon
              name="close-circle"
              fill={colors.blancSimple}
              onClick={(e: any) => {
                e.stopPropagation();
                setTypeSelected([]);
              }}
              id="bookmarkBtn"
              className="ml-10"
              size={"large"}
            />
          )}
        </DropdownToggle>
        <DropdownMenu>
          <DropDownItemContainer>
            {StructureTypes.map((item: String, key) => {
              return (
                <FButton
                  onClick={() => {
                    selectType(item);
                  }}
                  type="white"
                  style={
                    // @ts-ignore
                    typeSelected.includes(item)
                      ? { border: "2px black solid" }
                      : {}
                  }
                  className="mb-8"
                  key={key}
                >
                  {item}

                  {
                    // @ts-ignore
                    typeSelected.includes(item) && (
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
                    )
                  }
                </FButton>
              );
            })}
          </DropDownItemContainer>
        </DropdownMenu>
      </Dropdown>

      {/* <WhiteButtonContainer>
        {" "}
        {props.t("Annuaire.Thèmes & activités", "Thèmes & activités")}
      </WhiteButtonContainer> */}
      <ResultNumberContainer>
        {" "}
        {props.t("AdvancedSearch.résultats", "résultats")}
      </ResultNumberContainer>
    </MainContainer>
  );
};
