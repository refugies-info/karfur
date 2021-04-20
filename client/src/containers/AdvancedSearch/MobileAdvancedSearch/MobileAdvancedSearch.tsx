import React, { useState } from "react";
import styled from "styled-components";
import Icon from "react-eva-icons";
import { MobileSearchFilterModal } from "./MobileSearchFilterModal/MobileSearchFilterModal";
import { filtres } from "../../Dispositif/data";
interface Props {
  t: (a: string, b: string) => void;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 5px 0;
`;
const FilterButton = styled.div`
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: #ffffff;
  border: 1px solid;
  color: #212121;
  font-weight: 700;
  border-color: #212121;
  border-radius: 12px;
  padding-top: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const TextTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-top: 5px;
`;

const ButtonTitle = styled.div`
  margin: 0 10px;
`;

export const MobileAdvancedSearch = (props: Props) => {
  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => setShowModal(!showModal);

  return (
    <MainContainer>
      <SearchBoutton>
        <Icon name="search" fill="#FFFFFF" size="large" />
        <ButtonTitle> {props.t("Rechercher", "Rechercher")}</ButtonTitle>
      </SearchBoutton>
      <TextTitle> {props.t("Je cherche à", "Je cherche à")}</TextTitle>
      <FilterButton onClick={toggleShowModal}>
        <ButtonTitle>
          {props.t("Tags.choisir un thème", "choisir un thème")}
        </ButtonTitle>
        <Icon name="chevron-down" fill="#212121" size="large" />
      </FilterButton>
      <TextTitle> {props.t("SearchItem.J'habite", "J'habite")}</TextTitle>
      <FilterButton>
        <ButtonTitle>
          {props.t("SearchItem.choisir ma ville", "choisir ma ville")}
        </ButtonTitle>
        <Icon name="pin" fill="#212121" size="large" />
      </FilterButton>
      <TextTitle> {props.t("SearchItem.J'ai", "J'ai")}</TextTitle>
      <FilterButton>
        <ButtonTitle>
          {props.t("SearchItem.choisir mon âge", "choisir mon âge")}
        </ButtonTitle>
        <Icon name="chevron-down" fill="#212121" size="large" />
      </FilterButton>
      <TextTitle> {props.t("SearchItem.Je parle", "Je parle")}</TextTitle>
      <FilterButton>
        <ButtonTitle>
          {props.t("Tags.niveau de français", "niveau de français")}
        </ButtonTitle>
        <Icon name="chevron-down" fill="#212121" size="large" />
      </FilterButton>
      {showModal && (
        <MobileSearchFilterModal
          t={props.t}
          title="Tags.thème"
          defaultTitle="thème"
          sentence="Je cherche à"
          defaultSentence="Je cherche à"
          toggle={toggleShowModal}
          show={showModal}
          data={filtres.tags}
        />
      )}
    </MainContainer>
  );
};
