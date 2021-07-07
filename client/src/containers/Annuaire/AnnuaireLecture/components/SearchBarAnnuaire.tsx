import React, { useState } from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";
import "./SearchBarAnnuaire.scss";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import { StructureTypes } from "../../AnnuaireCreate/data";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
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

  const toggle = () => setOpen(!dropdownOpen);

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
        {" "}
        <EVAIcon
          name="pin-outline"
          fill={colors.noir}
          className="mr-10"
          id="bookmarkBtn"
          size={"large"}
        />
        {props.t("Annuaire.Ville ou département", "Ville ou département")}
      </WhiteButtonContainer>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle className="whiteButton" caret>
          {props.t("Annuaire.Type de structure", "Type de structure")}
        </DropdownToggle>
        <DropdownMenu>
          <DropDownItemContainer>
            {StructureTypes.map((item, key) => {
              return (
                <FButton type="white" className="mb-8" key={key}>
                  {item}
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
