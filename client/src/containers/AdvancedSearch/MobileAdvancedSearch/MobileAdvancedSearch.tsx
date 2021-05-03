import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Icon from "react-eva-icons";
import { MobileSearchFilterModal } from "./MobileSearchFilterModal/MobileSearchFilterModal";
import { colors } from "../../../colors";
import { LocalisationFilter } from "./LocalisationFilter/LocalisationFilter";
import { SearchResultsDisplayedOnMobile } from "./SearchResultsDisplayedOnMobile/SearchResultsDisplayedOnMobile";
import { Tag, IDispositif } from "../../../types/interface";
import { SelectedFilter } from "./SelectedFilter/SelectedFilter";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";
declare const window: Window;
import { filtres } from "../../Dispositif/data";
import { initial_data } from "../data";

interface Props {
  nbFilteredResults: number;
  t: (a: string, b: string) => void;
  recherche: string[];
  addParamasInRechercher: () => void;
  queryDispositifs: () => void;
  desactiver: (index: number) => void;
  query: {
    city?: string;
    tag?: string;
    bottomValue?: string;
    niveauFrancais?: string;
  };
  principalThemeList: IDispositif[];
  principalThemeListFullFrance: IDispositif[];
  dispositifs: IDispositif[];
  dispositifsFullFrance: IDispositif[];
  secondaryThemeList: IDispositif[];
  secondaryThemeListFullFrance: IDispositif[];
  totalFicheCount: number;
  history: any;
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
  background-color: ${(props) =>
    props.isDisabled
      ? colors.grey
      : props.isUrlEmpty || props.isUserModifyingSearch
      ? colors.vert
      : props.tagSelected
      ? props.tagSelected.darkColor
      : colors.bleuCharte};
  border-radius: 12px;
  align-items: center;
  font-size: 18px;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: white;
  font-weight: 700;
  margin: 5px 0;
`;
const FilterButton = styled.div`
  padding: 16px;
  height: 53px;
  width: 100%;
  align-items: center;
  background-color: ${colors.blancSimple};
  border: 1px solid;
  color: ${colors.noir};
  font-weight: 700;
  border-color: ${colors.noir};
  border-radius: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
`;

const TextTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-top: 5px;
`;
const SearchTitle = styled.div`
  margin-left: 10px;
`;

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
  const [isUrlEmpty, setIsUrlEmpty] = useState(true);
  const isSearchButtonDisabled =
    !tagSelected && !ageSelected && !frenchSelected && ville === "";

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

  useEffect(() => {
    setIsUrlEmpty(Object.keys(props.query)[0] === "");
    props.recherche.map((item: any) => {
      if (item.value) {
        switch (item.queryName) {
          case "localisation":
            setVille(item.value);
            break;
          case "tags.name":
            setTagSelected(
              filtres.tags.filter(
                (filtre: any) => filtre.name === item.value
              )[0]
            );
            break;
          case "audienceAge":
            let children = initial_data.filter(
              (filtre: any) => filtre.queryName === "audienceAge"
            )[0].children;
            if (children) {
              setAgeSelected(
                // @ts-ignore
                children.filter(
                  (filtre: any) => filtre.name === item.value.toString()
                )[0]
              );
            }
            break;
          case "niveauFrancais":
            let child = initial_data.filter(
              (item: any) => item.queryName === "niveauFrancais"
            )[0].children;
            if (child) {
              setFrenchSelected(
                // @ts-ignore
                child.filter(
                  (filtre: any) => filtre.name === item.value.toString()
                )[0]
              );
            }
            break;

          default:
            break;
        }
      }
    });
  }, [props.query]);
  return (
    <MainContainer>
      <SearchBoutton
        isDisabled={isSearchButtonDisabled}
        isUrlEmpty={isUrlEmpty}
        tagSelected={tagSelected}
        onClick={() => {
          {
            isUrlEmpty ? props.queryDispositifs() : props.history.push();
          }
        }}
      >
        <EVAIcon
          name={
            isSearchButtonDisabled
              ? "search"
              : isUrlEmpty
              ? "checkmark"
              : "options-2"
          }
          fill="#FFFFFF"
          size="large"
        />
        <SearchTitle>
          {isUrlEmpty
            ? props.t("Rechercher", "Rechercher")
            : props.t(
                "AdvancedSearch.Modifier ma recherche",
                "Modifier ma recherche"
              )}
        </SearchTitle>
      </SearchBoutton>
      {isUrlEmpty ? (
        <>
          <TextTitle>
            {props.t("SearchItem.Je cherche à", "Je cherche à")}
          </TextTitle>
          <SelectedFilter
            toggleShowModal={toggleShowModal}
            tagSelected={tagSelected}
            type="thème"
            t={props.t}
            title={"Tags.choisir un thème"}
            defaultTitle={"choisir un thème"}
            desactiver={props.desactiver}
            recherche={props.recherche}
          />

          <TextTitle>
            {props.t("SearchItem.J'habite à", "J'habite à")}
          </TextTitle>
          {geoSearch || ville !== "" ? (
            <LocalisationFilter
              setState={setVille}
              ville={ville}
              geoSearch={geoSearch}
              setGeoSearch={setGeoSearch}
              addParamasInRechercher={props.addParamasInRechercher}
              recherche={props.recherche}
              desactiver={props.desactiver}
            ></LocalisationFilter>
          ) : (
            <>
              <FilterButton onClick={() => setGeoSearch(true)}>
                {props.t("SearchItem.choisir ma ville", "choisir ma ville")}
                <Icon name="pin" fill="#212121" size="large" />
              </FilterButton>
            </>
          )}

          <TextTitle> {props.t("SearchItem.J'ai", "J'ai")}</TextTitle>
          <SelectedFilter
            toggleShowModal={toggleShowModal}
            otherFilterSelected={ageSelected}
            type="age"
            t={props.t}
            title={"SearchItem.choisir mon âge"}
            defaultTitle={"choisir mon âge"}
            setState={setAgeSelected}
            desactiver={props.desactiver}
            recherche={props.recherche}
          />

          <TextTitle> {props.t("SearchItem.Je parle", "Je parle")}</TextTitle>
          <SelectedFilter
            toggleShowModal={toggleShowModal}
            otherFilterSelected={frenchSelected}
            type="french"
            t={props.t}
            title={"Tags.niveau de français"}
            defaultTitle={"niveau de français"}
            setState={setFrenchSelected}
            desactiver={props.desactiver}
            recherche={props.recherche}
          />

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
              addParamasInRechercher={props.addParamasInRechercher}
              recherche={props.recherche}
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
              addParamasInRechercher={props.addParamasInRechercher}
              recherche={props.recherche}
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
              addParamasInRechercher={props.addParamasInRechercher}
              recherche={props.recherche}
            />
          )}
        </>
      ) : (
        <SearchResultsDisplayedOnMobile
          tagSelected={tagSelected}
          ageSelected={ageSelected}
          frenchSelected={frenchSelected}
          ville={ville}
          principalThemeList={props.principalThemeList}
          principalThemeListFullFrance={props.principalThemeListFullFrance}
          dispositifs={props.dispositifs}
          dispositifsFullFrance={props.dispositifsFullFrance}
          secondaryThemeList={props.secondaryThemeList}
          secondaryThemeListFullFrance={props.secondaryThemeListFullFrance}
          totalFicheCount={props.totalFicheCount}
          t={props.t}
          nbFilteredResults={props.nbFilteredResults}
          history={props.history}
        />
      )}
    </MainContainer>
  );
};
