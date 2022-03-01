import React from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import NoResultsBackgroundImage from "assets/no_results.svg";
import FButton from "components/UI/FButton/FButton";

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  margin-top: 45px;
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  min-width: 254px;
  height: 180px;
  margin-right: 75px;
`;

const NoResultsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResultsButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const NoResultsTitle = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 24px !important;
`;

const NoResultsText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px !important;
  margin-bottom: 24px !important;
  max-width: 550px;
`;

export const NoResult = (props: any) => {
  const { t } = useTranslation();
  return (
    <NoResultsContainer>
      <NoResults />
      <NoResultsTextContainer>
        <NoResultsTitle>
          {t("Aucun résultat", "Aucun résultat")}
        </NoResultsTitle>
        <NoResultsText>
          {t(
            "Annuaire.Elargir recherche",
            "Il n’existe aucune structure correspondant aux filtres sélectionnés. Essayez d’élargir votre recherche en retirant des filtres."
          )}{" "}
        </NoResultsText>
        <NoResultsButtonsContainer>
          <FButton
            type="dark"
            name="refresh-outline"
            className="mr-10"
            onClick={props.resetAllFilter}
          >
            Recommencer
          </FButton>
        </NoResultsButtonsContainer>
      </NoResultsTextContainer>
    </NoResultsContainer>
  );
};
