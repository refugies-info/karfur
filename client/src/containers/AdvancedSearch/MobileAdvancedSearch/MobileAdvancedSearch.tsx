import React from "react";
import styled from "styled-components";
import Icon from "react-eva-icons";

interface Props {
  t: (a: string, b: string) => void;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 100px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
`;

const SearchBoutton = styled.div`
  height: 53px;
  width: 100%;
  background-color: #c6c6c6;
  border-radius: 12px;
  font-size: 18px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: white;
  font-weight: 700;
  padding-top: 12px;
`;

const TextTitle = styled.div`
  margin: 0 10px;
`;

export const MobileAdvancedSearch = (props: Props) => {
  return (
    <MainContainer>
      <SearchBoutton>
        <Icon name="search" fill="#FFFFFF" size="large" />
        <TextTitle> {props.t("Rechercher", "Rechercher")}</TextTitle>
      </SearchBoutton>
    </MainContainer>
  );
};
