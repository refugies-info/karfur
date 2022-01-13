import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import NoResultsBackgroundImage from "../../../assets/search_no_results.svg";

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 12px;
  padding: 8px;
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${NoResultsBackgroundImage});
  width: 256px;
  height: 150px;
  margin-right: 0px;
`;

const NoResultsTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const NoResultsTitle = styled.p`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 24px !important;
  margin-bottom: 0px;
`;


const NoResultPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <NoResultsContainer>
      <NoResults />
      <NoResultsTextContainer>
        <NoResultsTitle>{"Oups ! Aucun résultat..."}</NoResultsTitle>
      </NoResultsTextContainer>
    </NoResultsContainer>
  );
};

export default NoResultPlaceholder;
