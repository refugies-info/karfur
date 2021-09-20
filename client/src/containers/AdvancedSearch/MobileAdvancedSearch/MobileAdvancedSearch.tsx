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
  addParamasInRechercher: (index: number, item: any) => void;
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
  isLoading: boolean;
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
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.25);
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
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.25);
`;

const TextTitle = styled.div`
  font-weight: 700;
  font-size: 18px;
  margin-top: 5px;
`;
const SearchTitle = styled.div`
  margin-left: 10px;
`;

const ShowMoreFiltreTextContainer = styled.div`
  text-decoration: underline;
  color: ${colors.grisFonce};
  font-size: 18px;
  margin: 10px auto;
  height: 23px;
`;

export const MobileAdvancedSearch = (props: Props) => {
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagSelected, setTagSelected] = useState<Tag | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageSelected, setAgeSelected] = useState<{ name: string } | null>(null);
  const [showFrenchModal, setShowFrenchModal] = useState(false);
  const [frenchSelected, setFrenchSelected] =
    useState<{ name: string } | null>(null);
  const [ville, setVille] = useState("");
  const [geoSearch, setGeoSearch] = useState(false);
  const [isUrlEmpty, setIsUrlEmpty] = useState(true);
  const isSearchButtonDisabled =
    !tagSelected && !ageSelected && !frenchSelected && ville === "";
  const [showMoreFiltre, setShowMoreFiltre] = useState(false);

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

  const toggleShowFiltre = () => setShowMoreFiltre(!showMoreFiltre);

  const selectOption = (item: any, type: string) => {
    let index = 0;
    let el;
    switch (type) {
      case "thème":
        el = props.recherche.filter(
          (item: any) => item.queryName === "tags.name"
        )[0];
        index = props.recherche.indexOf(el);
        setTagSelected(item);
        break;
      case "age":
        el = props.recherche.filter(
          (item: any) => item.queryName === "audienceAge"
        )[0];
        index = props.recherche.indexOf(el);
        setAgeSelected(item);
        break;
      case "french":
        el = props.recherche.filter(
          (item: any) => item.queryName === "niveauFrancais"
        )[0];
        index = props.recherche.indexOf(el);
        setFrenchSelected(item);
        break;
      default:
        break;
    }
    props.addParamasInRechercher(index, item);
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

    return () => {
      setTagSelected(null);
      setAgeSelected(null);
      setFrenchSelected(null);
      setVille("");
    };
  }, [props.query]);

  const onSearchClick = () => {
    if (isSearchButtonDisabled) return;
    if (isUrlEmpty) return props.queryDispositifs();
    return props.history.push();
  };

  return (
    <MainContainer>
      {isUrlEmpty ? (
        <>
          <TextTitle>
            {props.t("SearchItem.J'ai besoin de", "J'ai besoin de")}
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
          {showMoreFiltre && (
            <>
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

              <TextTitle>
                {" "}
                {props.t("SearchItem.Je parle", "Je parle")}
              </TextTitle>
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
            </>
          )}
          <ShowMoreFiltreTextContainer onClick={toggleShowFiltre}>
            {showMoreFiltre
              ? props.t(
                  "AdvancedSearch.Voir moins de filtres",
                  "Voir moins de filtres"
                )
              : props.t(
                  "AdvancedSearch.Voir plus de filtres",
                  "Voir plus de filtres"
                )}
          </ShowMoreFiltreTextContainer>
          {showTagModal && (
            <MobileSearchFilterModal
              t={props.t}
              selectOption={selectOption}
              type="thème"
              title="Tags.thème"
              defaultTitle="thème"
              sentence="SearchItem.J'ai besoin de"
              defaultSentence="J'ai besoin de"
              toggle={() => toggleShowModal("thème")}
              show={showTagModal}
            />
          )}
          {showAgeModal && (
            <MobileSearchFilterModal
              t={props.t}
              selectOption={selectOption}
              type="age"
              title="SearchItem.choisir mon âge"
              defaultTitle="choisir mon âge"
              sentence="SearchItem.J'ai"
              defaultSentence="J'ai'"
              toggle={() => toggleShowModal("age")}
              show={showAgeModal}
            />
          )}
          {showFrenchModal && (
            <MobileSearchFilterModal
              t={props.t}
              selectOption={selectOption}
              type="french"
              title="SearchItem.le français"
              defaultTitle="le français"
              sentence="SearchItem.Je parle"
              defaultSentence="Je parle"
              toggle={() => toggleShowModal("french")}
              show={showFrenchModal}
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
          isLoading={props.isLoading}
          history={props.history}
        />
      )}
      <SearchBoutton
        isDisabled={isSearchButtonDisabled}
        isUrlEmpty={isUrlEmpty}
        tagSelected={tagSelected}
        onClick={onSearchClick}
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
            ? isSearchButtonDisabled
              ? props.t("Sélectionnez un filtre !", "Sélectionnez un filtre !")
              : props.t("Rechercher", "Rechercher")
            : props.t(
                "AdvancedSearch.Modifier ma recherche",
                "Modifier ma recherche"
              )}
        </SearchTitle>
      </SearchBoutton>
    </MainContainer>
  );
};
