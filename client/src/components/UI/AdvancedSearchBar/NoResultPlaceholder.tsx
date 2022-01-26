import React from "react";
import styled from "styled-components";
import Image from "next/image";
import NoResultsBackgroundImage from "assets/search_no_results.svg";

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f2f2f2;
  border-radius: 12px;
  padding: 8px;
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
  return (
    <NoResultsContainer>
      <Image
        src={NoResultsBackgroundImage}
        width={256}
        height={150}
        alt=""
      />
      <NoResultsTextContainer>
        <NoResultsTitle>Oups ! Aucun résultat...</NoResultsTitle>
      </NoResultsTextContainer>
    </NoResultsContainer>
  );
};

export default NoResultPlaceholder;
