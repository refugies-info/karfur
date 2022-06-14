import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { MobileSearchFilterModal } from "./MobileSearchFilterModal/MobileSearchFilterModal";
import FButton from "components/UI/FButton";
import { LocalisationFilter } from "./LocalisationFilter/LocalisationFilter";
import { SearchResultsDisplayedOnMobile } from "./SearchResultsDisplayedOnMobile/SearchResultsDisplayedOnMobile";
import { Tag, IDispositif } from "types/interface";
import { SelectedFilter } from "./SelectedFilter/SelectedFilter";
import { AvailableFilters } from "data/searchFilters";
import { tags } from "data/tags";
import { SearchQuery } from "pages/recherche";
import { cls } from "lib/classname";
import styles from "./MobileAdvancedSearch.module.scss";

interface Props {
  nbFilteredResults: number;
  addToQuery: (query: Partial<SearchQuery>) => void;
  queryDispositifs: () => void;
  removeFromQuery: (filter: AvailableFilters) => void;
  restart: () => void
  query: SearchQuery;
  principalThemeList: IDispositif[];
  principalThemeListFullFrance: IDispositif[];
  dispositifs: IDispositif[];
  dispositifsFullFrance: IDispositif[];
  secondaryThemeList: IDispositif[];
  secondaryThemeListFullFrance: IDispositif[];
  totalFicheCount: number;
  isLoading: boolean;
}

const findTag = (theme: string|undefined) => tags.find((tag) => tag.name === theme) || null;

export const MobileAdvancedSearch = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();

  const hasInitialSearch = Object.keys(router.query).filter(key => key !== "tri").length > 0;

  const [showTagModal, setShowTagModal] = useState(false);
  const [tagSelected, setTagSelected] = useState<Tag | null>(findTag(props.query.theme?.[0]));
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageSelected, setAgeSelected] = useState<string | null>(props.query.age || null);
  const [showFrenchModal, setShowFrenchModal] = useState(false);
  const [frenchSelected, setFrenchSelected] = useState<string | null>(props.query.frenchLevel || null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [language, setLanguage] = useState<string | null>(props.query.langue || null);
  const [ville, setVille] = useState(props.query.loc?.city || "");
  const [geoSearch, setGeoSearch] = useState(false);
  const [showFilterForm, setShowFilterForm] = useState(!hasInitialSearch);

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
      case "langue":
        setShowLanguageModal(!showLanguageModal);
        break;
      default:
        break;
    }
  };

  const selectOption = (itemName: string, type: AvailableFilters) => {
    const value = type === "theme" ? [itemName] : itemName
    props.addToQuery({ [type]: value });
  };

  useEffect(() => {
    setTagSelected(findTag(props.query.theme?.[0]));
    setVille(props.query.loc?.city || "");
    setAgeSelected(props.query.age || null);
    setFrenchSelected(props.query.frenchLevel || null);
    setLanguage(props.query.langue || null);

    return () => {
      setTagSelected(null);
      setAgeSelected(null);
      setFrenchSelected(null);
      setLanguage(null);
      setVille("");
    };
  }, [props.query]);

  const isSearchButtonDisabled =
    !tagSelected &&
    !ageSelected &&
    !frenchSelected &&
    !language &&
    ville === "";

  const onSearchClick = () => {
    if (isSearchButtonDisabled) return;
    setShowFilterForm(!showFilterForm);
  };

  const getFilterCount = () => {
    return [tagSelected, ageSelected, frenchSelected, language, ville].filter(
      (filter) => !!filter
    ).length;
  };

  const restart = () => {
    props.restart();
    setShowFilterForm(true);
  }

  return (
    <div className={cls(styles.container, "d-block d-md-none")}>
      {showFilterForm ? (
        <>
          <div className={styles.search_field}>
            <label className={styles.label}>
              {t("SearchItem.J'ai besoin de", "J'ai besoin de")}
            </label>
            <SelectedFilter
              toggleShowModal={toggleShowModal}
              tagSelected={tagSelected}
              type="theme"
              title={"Tags.choisir un thème"}
              defaultTitle={"choisir un thème"}
              setState={setTagSelected}
              removeFromQuery={() => props.removeFromQuery("theme")}
            />
          </div>

          <div className={styles.search_field}>
            <label className={styles.label}>
              {t("SearchItem.J'habite à", "J'habite à")}
            </label>
            <LocalisationFilter
              setVille={setVille}
              ville={ville}
              geoSearch={geoSearch}
              setGeoSearch={setGeoSearch}
              addToQuery={props.addToQuery}
              removeFromQuery={props.removeFromQuery}
            ></LocalisationFilter>
          </div>

          <div className={styles.search_field}>
            <label className={styles.label}>
              {" "}
              {t("SearchItem.J'ai", "J'ai")}
            </label>
            <SelectedFilter
              toggleShowModal={toggleShowModal}
              otherFilterSelected={ageSelected}
              type="age"
              title={"SearchItem.choisir mon âge"}
              defaultTitle={"choisir mon âge"}
              setState={setAgeSelected}
              removeFromQuery={() => props.removeFromQuery("age")}
            />
          </div>

          <div className={styles.search_field}>
            <label className={styles.label}>
              {" "}
              {t("SearchItem.Je parle", "Je parle")}
            </label>
            <SelectedFilter
              toggleShowModal={toggleShowModal}
              otherFilterSelected={frenchSelected}
              type="frenchLevel"
              title={"Tags.niveau de français"}
              defaultTitle={"niveau de français"}
              setState={setFrenchSelected}
              removeFromQuery={() => props.removeFromQuery("frenchLevel")}
            />
          </div>

          <div className={styles.search_field}>
            <label className={styles.label}>
              {" "}
              {t("SearchItem.translated_in", "Traduit en")}
            </label>
            <SelectedFilter
              toggleShowModal={toggleShowModal}
              otherFilterSelected={language}
              type="langue"
              title={"Homepage.choisir une langue"}
              defaultTitle={"choisir une langue"}
              setState={setLanguage}
              removeFromQuery={() => props.removeFromQuery("langue")}
            />
          </div>

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
          {showLanguageModal && (
            <MobileSearchFilterModal
              selectOption={selectOption}
              type="langue"
              title="Homepage.choisir une langue"
              defaultTitle="choisir une langue"
              sentence="SearchItem.translated_in"
              defaultSentence="Traduit en"
              toggle={() => toggleShowModal("langue")}
              show={showLanguageModal}
            />
          )}
          <FButton
            type="validate"
            name={isSearchButtonDisabled ? "search" : "checkmark"}
            disabled={isSearchButtonDisabled}
            onClick={onSearchClick}
            className={styles.validate_btn}
          >
            {isSearchButtonDisabled
              ? t("Sélectionnez un filtre !", "Sélectionnez un filtre !")
              : t("Rechercher", "Rechercher")}
          </FButton>
        </>
      ) : (
        <>
          <FButton
            type="login"
            name="options-2-outline"
            className={styles.validate_btn}
            onClick={() => setShowFilterForm(true)}
          >
            <span className={styles.large}>
              {t(
                "AdvancedSearch.Modifier ma recherche",
                "Modifier ma recherche"
              )}
            </span>
            <span className={styles.badge}>{getFilterCount()}</span>
          </FButton>
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
            restart={restart}
          />
        </>
      )}
    </div>
  );
};
