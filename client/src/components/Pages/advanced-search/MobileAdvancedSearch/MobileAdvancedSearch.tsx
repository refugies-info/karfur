import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { MobileSearchFilterModal } from "./MobileSearchFilterModal/MobileSearchFilterModal";
import { colors } from "colors";
import { LocalisationFilter } from "./LocalisationFilter/LocalisationFilter";
import { SearchResultsDisplayedOnMobile } from "./SearchResultsDisplayedOnMobile/SearchResultsDisplayedOnMobile";
import { Tag, IDispositif } from "types/interface";
import { SelectedFilter } from "./SelectedFilter/SelectedFilter";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { AvailableFilters } from "data/searchFilters";
import { tags } from "data/tags";
import { SearchQuery } from "pages/advanced-search";

interface Props {
  nbFilteredResults: number;
  addToQuery: (query: Partial<SearchQuery>) => void;
  queryDispositifs: () => void;
  removeFromQuery: (filter: AvailableFilters) => void;
  query: SearchQuery
  principalThemeList: IDispositif[];
  principalThemeListFullFrance: IDispositif[];
  dispositifs: IDispositif[];
  dispositifsFullFrance: IDispositif[];
  secondaryThemeList: IDispositif[];
  secondaryThemeListFullFrance: IDispositif[];
  totalFicheCount: number;
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

interface SearchBouttonProps {
  isDisabled: boolean
  showFilterForm: boolean
  isUserModifyingSearch?: boolean
  tagSelected: Tag | null
}
const SearchBoutton = styled.div`
  height: 53px;
  width: 100%;
  background-color: ${(props: SearchBouttonProps) =>
    props.isDisabled
      ? colors.grey
      : props.showFilterForm || props.isUserModifyingSearch
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
  font-weight: bold;
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
  font-weight: bold;
  border-color: ${colors.noir};
  border-radius: 12px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.25);
`;

const TextTitle = styled.div`
  font-weight: bold;
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
  const { t } = useTranslation();

  const [showTagModal, setShowTagModal] = useState(false);
  const [tagSelected, setTagSelected] = useState<Tag | null>(null);
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageSelected, setAgeSelected] = useState<string| null>(null);
  const [showFrenchModal, setShowFrenchModal] = useState(false);
  const [frenchSelected, setFrenchSelected] = useState<string| null>(null);
  const [ville, setVille] = useState("");
  const [geoSearch, setGeoSearch] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(true);
  const [showMoreFiltre, setShowMoreFiltre] = useState(false);

  const toggleShowModal = (modal: AvailableFilters) => {
    switch (modal) {
      case "theme":
        setShowTagModal(!showTagModal);
        break;
      case "age":
        setShowAgeModal(!showAgeModal);
        break;
      case "frenchLevel":
        setShowFrenchModal(!showFrenchModal);
        break;
      default:
        break;
    }
  };

  const toggleShowFiltre = () => setShowMoreFiltre(!showMoreFiltre);

  const selectOption = (itemName: string, type: AvailableFilters) => {
    props.addToQuery({ [type]: itemName });
  };

  useEffect(() => {
    const tag =  tags.find(tag => tag.name === props.query.theme);
    setTagSelected(tag || null);
    setVille(props.query.loc?.city || "");
    setAgeSelected(props.query.age || null);
    setFrenchSelected(props.query.frenchLevel || null);

    return () => {
      setTagSelected(null);
      setAgeSelected(null);
      setFrenchSelected(null);
      setVille("");
    };
  }, [props.query]);

  const isSearchButtonDisabled =
    !tagSelected && !ageSelected && !frenchSelected && ville === "";

  const onSearchClick = () => {
    if (isSearchButtonDisabled) return;
    setShowFilterForm(!showFilterForm);
  };

  return (
    <MainContainer>
      {!showFilterForm && (
        <SearchBoutton
          isDisabled={isSearchButtonDisabled}
          showFilterForm={showFilterForm}
          tagSelected={tagSelected}
          onClick={onSearchClick}
        >
          <EVAIcon
            name={isSearchButtonDisabled ? "search" : "options-2"}
            fill="#FFFFFF"
            size="large"
          />
          <SearchTitle>
            {t(
              "AdvancedSearch.Modifier ma recherche",
              "Modifier ma recherche"
            )}
          </SearchTitle>
        </SearchBoutton>
      )}
      {showFilterForm ? (
        <>
          <TextTitle>
            {t("SearchItem.J'ai besoin de", "J'ai besoin de")}
          </TextTitle>
          <SelectedFilter
            toggleShowModal={toggleShowModal}
            tagSelected={tagSelected}
            type="theme"
            title={"Tags.choisir un thème"}
            defaultTitle={"choisir un thème"}
            removeFromQuery={() => props.removeFromQuery("theme")}
          />

          <TextTitle>
            {t("SearchItem.J'habite à", "J'habite à")}
          </TextTitle>
          {geoSearch || ville !== "" ? (
            <LocalisationFilter
              setVille={setVille}
              ville={ville}
              geoSearch={geoSearch}
              setGeoSearch={setGeoSearch}
              addToQuery={props.addToQuery}
              removeFromQuery={props.removeFromQuery}
            ></LocalisationFilter>
          ) : (
            <>
              <FilterButton onClick={() => setGeoSearch(true)}>
                {t("SearchItem.choisir ma ville", "choisir ma ville")}
                <EVAIcon name="pin" fill="#212121" size="large" />
              </FilterButton>
            </>
          )}
          {showMoreFiltre && (
            <>
              <TextTitle> {t("SearchItem.J'ai", "J'ai")}</TextTitle>
              <SelectedFilter
                toggleShowModal={toggleShowModal}
                otherFilterSelected={ageSelected}
                type="age"
                title={"SearchItem.choisir mon âge"}
                defaultTitle={"choisir mon âge"}
                setState={setAgeSelected}
                removeFromQuery={() => props.removeFromQuery("age")}
              />

              <TextTitle>
                {" "}
                {t("SearchItem.Je parle", "Je parle")}
              </TextTitle>
              <SelectedFilter
                toggleShowModal={toggleShowModal}
                otherFilterSelected={frenchSelected}
                type="frenchLevel"
                title={"Tags.niveau de français"}
                defaultTitle={"niveau de français"}
                setState={setFrenchSelected}
                removeFromQuery={() => props.removeFromQuery("frenchLevel")}
              />
            </>
          )}
          <ShowMoreFiltreTextContainer onClick={toggleShowFiltre}>
            {showMoreFiltre
              ? t(
                  "AdvancedSearch.Voir moins de filtres",
                  "Voir moins de filtres"
                )
              : t(
                  "AdvancedSearch.Voir plus de filtres",
                  "Voir plus de filtres"
                )}
          </ShowMoreFiltreTextContainer>
          {showTagModal && (
            <MobileSearchFilterModal
              selectOption={selectOption}
              type="theme"
              title="Tags.thème"
              defaultTitle="thème"
              sentence="SearchItem.J'ai besoin de"
              defaultSentence="J'ai besoin de"
              toggle={() => toggleShowModal("theme")}
              show={showTagModal}
            />
          )}
          {showAgeModal && (
            <MobileSearchFilterModal
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
              selectOption={selectOption}
              type="frenchLevel"
              title="SearchItem.le français"
              defaultTitle="le français"
              sentence="SearchItem.Je parle"
              defaultSentence="Je parle"
              toggle={() => toggleShowModal("frenchLevel")}
              show={showFrenchModal}
            />
          )}
        </>
      ) : (
        <SearchResultsDisplayedOnMobile
          tagSelected={tagSelected}
          ville={ville}
          principalThemeList={props.principalThemeList}
          principalThemeListFullFrance={props.principalThemeListFullFrance}
          dispositifs={props.dispositifs}
          dispositifsFullFrance={props.dispositifsFullFrance}
          secondaryThemeList={props.secondaryThemeList}
          secondaryThemeListFullFrance={props.secondaryThemeListFullFrance}
          totalFicheCount={props.totalFicheCount}
          nbFilteredResults={props.nbFilteredResults}
          isLoading={props.isLoading}
        />
      )}
      {showFilterForm && (
        <SearchBoutton
          isDisabled={isSearchButtonDisabled}
          showFilterForm={showFilterForm}
          tagSelected={tagSelected}
          onClick={onSearchClick}
        >
          <EVAIcon
            name={isSearchButtonDisabled ? "search" : "checkmark"}
            fill="#FFFFFF"
            size="large"
          />
          <SearchTitle>
            {isSearchButtonDisabled
              ? t("Sélectionnez un filtre !", "Sélectionnez un filtre !")
              : t("Rechercher", "Rechercher")}
          </SearchTitle>
        </SearchBoutton>
      )}
    </MainContainer>
  );
};
