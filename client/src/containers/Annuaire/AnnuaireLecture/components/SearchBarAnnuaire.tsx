import React from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
import EVAIcon from "../../../../components/UI/EVAIcon/EVAIcon";

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
      <WhiteButtonContainer>
        {props.t("Annuaire.Type de structure", "Type de structure")}
      </WhiteButtonContainer>
      <WhiteButtonContainer>
        {" "}
        {props.t("Annuaire.Thèmes & activités", "Thèmes & activités")}
      </WhiteButtonContainer>
      <ResultNumberContainer>
        {" "}
        {props.t("AdvancedSearch.résultats", "résultats")}
      </ResultNumberContainer>
    </MainContainer>
  );
};
