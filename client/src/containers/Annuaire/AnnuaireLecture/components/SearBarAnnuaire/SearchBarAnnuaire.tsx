import React, { useState, useEffect } from "react";
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
const ResultNumberContainer = styled.div`
  font-size: 16px;
  font-weight: 700;
  padding: 12px;
  color: ${colors.blanc};
`;

interface Props {
  t: any;
  setFilteredStructures: any;
  filteredStructures: SimplifiedStructure[] | null;
}

export const SearchBarAnnuaire = (props: Props) => {
  const [dropdownOpen, setOpen] = useState(false);
  const [typeSelected, setTypeSelected] = useState<string[]>([]);
  const [ville, setVille] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isCityFocus, setIsCityFocus] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const filterStructure = () => {
    let newArray: any[] = [];
    if (typeSelected.length > 0) {
      if (props.filteredStructures) {
        typeSelected.forEach((type) => {
          props.filteredStructures?.forEach((structure) => {
            if (
              structure.structureTypes?.includes(type) &&
              !newArray.includes(structure)
            ) {
              newArray.push(structure);
            }
          });
        });
      }
    }
    props.setFilteredStructures(newArray);
  };

  useEffect(() => {
    filterStructure();
  }, [ville, keyword, typeSelected]);

  const selectType = (item: string) => {
    if (!typeSelected.includes(item)) {
      let newTypesSelected = typeSelected.concat([item]);
      setTypeSelected(newTypesSelected);
    }

    toggle();
  };

  const onChangeKeywords = (e: any) => setKeyword(e.target.value);

  const handleChange = (e: any) => setVille(e.target.value);

  const onPlaceSelected = (place: any) => {
    if (place.formatted_address) {
      setVille(place.formatted_address);
    }
    setIsCityFocus(false);
    setKeyword("");
  };

  const removeType = (item: string) => {
    let array = typeSelected.filter((el) => el !== item);
    setTypeSelected(array);
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
          value={keyword}
        />
        {}

        <EVAIcon
          name="search-outline"
          fill={colors.noir}
          id="bookmarkBtn"
          className="ml-10"
          size={"large"}
        />
      </WhiteButtonContainer>

      <WhiteButtonContainer>
        <EVAIcon
          name="pin-outline"
          fill={colors.noir}
          className="mr-10"
          id="bookmarkBtn"
          size={"large"}
        />
        {ville === "" && !isCityFocus ? (
          <div
            onClick={() => {
              setIsCityFocus(true);
            }}
          >
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
                  className="autocomplete"
                  onBlur={() => {
                    setIsCityFocus(false);
                  }}
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
            {StructureTypes.map((item: string, key) => {
              return (
                <FButton
                  onClick={() => {
                    selectType(item);
                  }}
                  type="white"
                  style={
                    typeSelected.includes(item)
                      ? { border: "2px black solid" }
                      : {}
                  }
                  className="mb-8"
                  key={key}
                >
                  {item}

                  {typeSelected.includes(item) && (
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

      {/* <WhiteButtonContainer>
        {" "}
        {props.t("Annuaire.Thèmes & activités", "Thèmes & activités")}
      </WhiteButtonContainer> */}
      <ResultNumberContainer>
        {props.filteredStructures ? props.filteredStructures.length : 0}{" "}
        {props.t("AdvancedSearch.résultats", "résultats")}
      </ResultNumberContainer>
    </MainContainer>
  );
};
