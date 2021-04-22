import React, { useState } from "react";
import styled from "styled-components";
import Icon from "react-eva-icons";
import { MobileSearchFilterModal } from "./MobileSearchFilterModal/MobileSearchFilterModal";
import { filtres } from "../../Dispositif/data";
import { initial_data } from "../data";
import { colors } from "../../../colors";
import Streamline from "../../../assets/streamline";
import { LocalisationFilter } from "./LocalisationFilter/LocalisationFilter";
import { Tag } from "../../../types/interface";

interface Props {
  t: (a: string, b: string) => void;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  margin-bottom: 100px;
  padding-left: 24px;
  padding-right: 24px;
  width: 100%;
`;

const SearchBoutton = styled.div`
  height: 53px;
  width: 100%;
  background-color: ${(props) => props.color};
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
  background-color: ${colors.blancSimple};
  border: 1px solid;
  color: ${colors.noir};
  font-weight: 700;
  border-color: ${colors.noir};
  border-radius: 12px;
  padding-top: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const SelectedFilter = styled.div`
  align-items: center;
  padding: 16px;
  height: 53px;
  width: 100%;
  background-color: ${(props) => props.color};
  color: ${(props) => props.textColor};
  text-align: ${(props) => props.textAlign};
  font-weight: 700;
  align-items: center;
  border-color: #212121;
  border-radius: 12px;
  padding-top: 12px;
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
`;

const TextTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-top: 5px;
`;

const ButtonTitle = styled.div``;

export const MobileAdvancedSearch = (props: Props) => {
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagSelected, setTagSelected] = useState<Tag | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageSelected, setAgeSelected] = useState<{ name: string } | null>(null);
  const [showFrenchModal, setShowFrenchModal] = useState(false);
  const [frenchSelected, setFrenchSelected] = useState<{ name: string } | null>(
    null
  );
  const [ville, setVille] = useState("");
  const [geoSearch, setGeoSearch] = useState(false);

  const toggleShowModal = (modal: string) => {
    switch (modal) {
      case "thème":
        setShowTagModal(!showTagModal);
        break;
      case "age":
        setShowAgeModal(!showAgeModal);
        break;
      case "french":
        setShowFrenchModal(!showFrenchModal);
        break;
      default:
        break;
    }
  };
  return (
    <MainContainer>
      {tagSelected || frenchSelected || ageSelected || ville !== "" ? (
        <SearchBoutton color={colors.vert}>
          <Icon name="checkmark" fill="#FFFFFF" size="large" />
          <ButtonTitle> {props.t("Rechercher", "Rechercher")}</ButtonTitle>
        </SearchBoutton>
      ) : (
        <SearchBoutton color={colors.grey}>
          <Icon name="search" fill="#FFFFFF" size="large" />
          <ButtonTitle> {props.t("Rechercher", "Rechercher")}</ButtonTitle>
        </SearchBoutton>
      )}

      <TextTitle> {props.t("Je cherche à", "Je cherche à")}</TextTitle>
      {tagSelected ? (
        <SelectedFilter
          color={tagSelected.darkColor}
          textColor="white"
          textAlign="left"
          onClick={() => toggleShowModal("thème")}
        >
          {props.t("Tags." + tagSelected.name, tagSelected.name)}
          {tagSelected.icon ? (
            <Streamline
              name={tagSelected.icon}
              stroke={"white"}
              width={22}
              height={22}
            />
          ) : null}
        </SelectedFilter>
      ) : (
        <>
          <FilterButton onClick={() => toggleShowModal("thème")}>
            <ButtonTitle>
              {props.t("Tags.choisir un thème", "choisir un thème")}
            </ButtonTitle>
            <Icon name="chevron-down" fill="#212121" size="large" />
          </FilterButton>
        </>
      )}

      <TextTitle> {props.t("SearchItem.J'habite à", "J'habite à")}</TextTitle>
      {geoSearch || ville !== "" ? (
        <LocalisationFilter
          setState={setVille}
          ville={ville}
          geoSearch={geoSearch}
          setGeoSearch={setGeoSearch}
        ></LocalisationFilter>
      ) : (
        <>
          <FilterButton onClick={() => setGeoSearch(true)}>
            <ButtonTitle>
              {props.t("SearchItem.choisir ma ville", "choisir ma ville")}
            </ButtonTitle>
            <Icon name="pin" fill="#212121" size="large" />
          </FilterButton>
        </>
      )}

      <TextTitle> {props.t("SearchItem.J'ai", "J'ai")}</TextTitle>
      {ageSelected ? (
        <SelectedFilter
          color={colors.noir}
          textColor="white"
          textAlign="left"
          onClick={() => toggleShowModal("age")}
        >
          {props.t("Tags." + ageSelected.name, ageSelected.name)}
          <div
            onClick={(e: any) => {
              e.stopPropagation();
              setAgeSelected(null);
            }}
          >
            <Icon name="close" fill={colors.blanc} size="large" />
          </div>
        </SelectedFilter>
      ) : (
        <>
          <FilterButton onClick={() => toggleShowModal("age")}>
            <ButtonTitle>
              {props.t("SearchItem.choisir mon âge", "choisir mon âge")}
            </ButtonTitle>
            <Icon name="chevron-down" fill={colors.noir} size="large" />
          </FilterButton>
        </>
      )}

      <TextTitle> {props.t("SearchItem.Je parle", "Je parle")}</TextTitle>
      {frenchSelected ? (
        <SelectedFilter
          color={colors.noir}
          textColor="white"
          textAlign="left"
          onClick={() => toggleShowModal("french")}
        >
          {props.t("Tags." + frenchSelected.name, frenchSelected.name)}
          <div
            onClick={(e: any) => {
              e.stopPropagation();
              setFrenchSelected(null);
            }}
          >
            <Icon name="close" fill={colors.blanc} size="large" />
          </div>
        </SelectedFilter>
      ) : (
        <>
          <FilterButton onClick={() => toggleShowModal("french")}>
            <ButtonTitle>
              {props.t("Tags.niveau de français", "niveau de français")}
            </ButtonTitle>
            <Icon name="chevron-down" fill={colors.noir} size="large" />
          </FilterButton>
        </>
      )}

      {showTagModal && (
        <MobileSearchFilterModal
          t={props.t}
          setSelectedItem={(item) => setTagSelected(item)}
          type="thème"
          title="Tags.thème"
          defaultTitle="thème"
          sentence="SearchItem.Je cherche à"
          defaultSentence="Je cherche à"
          toggle={() => toggleShowModal("thème")}
          show={showTagModal}
          data={filtres.tags}
        />
      )}
      {showAgeModal && (
        <MobileSearchFilterModal
          t={props.t}
          setSelectedItem={(item) => setAgeSelected(item)}
          type="age"
          title="SearchItem.choisir mon âge"
          defaultTitle="choisir mon âge"
          sentence="SearchItem.J'ai"
          defaultSentence="J'ai'"
          toggle={() => toggleShowModal("age")}
          show={showAgeModal}
          data={
            initial_data.filter((item) => item.title === "J'ai")[0].children
          }
        />
      )}
      {showFrenchModal && (
        <MobileSearchFilterModal
          t={props.t}
          setSelectedItem={(item) => setFrenchSelected(item)}
          type="french"
          title="SearchItem.le français"
          defaultTitle="le français"
          sentence="SearchItem.Je parle"
          defaultSentence="Je parle"
          toggle={() => toggleShowModal("french")}
          show={showFrenchModal}
          data={
            initial_data.filter((item) => item.title === "Je parle")[0].children
          }
        />
      )}
    </MainContainer>
  );
};
