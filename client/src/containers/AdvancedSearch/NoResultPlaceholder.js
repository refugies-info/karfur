import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import NoResultsBackgroundImage from "../../assets/no_results.svg";
import FButton from "../../components/FigmaUI/FButton/FButton";
import { isMobile } from "react-device-detect";

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: ${isMobile ? "column" : "row"};
  text-align: ${isMobile ? "center" : ""};
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  min-width: 254px;
  height: 180px;
  margin-right: 75px;
  margin: ${isMobile ? "auto" : ""};
`;

const NoResultsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResultsButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${isMobile ? "center" : ""};
`;

const NoResultsTitle = styled.p`
  font-style: normal;
  font-weight: 500;
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
  max-width: 520px;
`;

const NoResultPlaceholder = ({ restart, writeNew }) => {
  const { t } = useTranslation();

  return (
    <NoResultsContainer>
      <NoResults />
      <NoResultsTextContainer>
        <NoResultsTitle>{t("Aucun résultat", "Aucun résultat")}</NoResultsTitle>
        <NoResultsText>
          {t(
            "AdvancedSearch.Elargir recherche",
            "Il n’existe aucune fiche correspondant aux critères sélectionnés. Essayez d’élargir votre recherche en retirant des critères."
          )}{" "}
        </NoResultsText>
        <NoResultsButtonsContainer>
          <FButton
            type="dark"
            name="refresh-outline"
            className="mr-10"
            onClick={restart}
          >
            Recommencer
          </FButton>
          {!isMobile && (
            <FButton
              type="white-yellow-hover"
              name="file-add-outline"
              onClick={writeNew}
            >
              Rédiger une nouvelle fiche
            </FButton>
          )}
        </NoResultsButtonsContainer>
      </NoResultsTextContainer>
    </NoResultsContainer>
  );
};

export default NoResultPlaceholder;
