import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  ContentType,
  GetDispositifsWithTranslationAvancementResponse,
  GetLanguagesResponse,
  GetNeedResponse,
  GetUserInfoResponse,
  Id,
  Languages,
  TraductionsStatus,
} from "@refugies-info/api-types";
import { useSelector } from "react-redux";
import isUndefined from "lodash/isUndefined";
import { useLanguages, useRouterLocale } from "hooks";
import { needsSelector } from "services/Needs/needs.selectors";
import FButton from "components/UI/FButton/FButton";
import { colors } from "colors";
import CustomSearchBar from "components/UI/CustomSeachBar";
import { LanguageTitle, FilterButton } from "../SubComponents";
import { filterData, getStatus } from "./functions";
import { TranslationAvancementTable } from "../TranslationAvancementTable";
import TranslationNeedsList from "../TranslationNeedsList";
import { NeedTradStatus } from "../../types";

export type SortedNeed = GetNeedResponse & { status: NeedTradStatus };

interface Props {
  history: any;
  actualLanguage?: GetLanguagesResponse;
  isExpert: boolean;
  data: GetDispositifsWithTranslationAvancementResponse[];
  isAdmin: boolean;
  toggleTraducteurModal: () => void;
  toggleTutoModal: () => void;
  toggleCompleteProfilModal: () => void;
  nbWords: number;
  timeSpent: number;
  setElementToTranslate: any;
  user: GetUserInfoResponse | null;
  setSelectedNeedId: (id: Id) => void;
}

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const MainContainer = styled.div`
  margin: 26px 12px 26px 12px;
  align-self: center;
`;

const FilterBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
`;

const IndicatorText = styled.div`
  font-weight: bold;
  color: ${colors.darkGrey};
  margin-right: 8px;
`;

const getInitialFilterStatus = (isExpert: boolean, data: GetDispositifsWithTranslationAvancementResponse[]) => {
  if (!isExpert) return TraductionsStatus.TO_TRANSLATE;
  const nbARevoir = data.filter((trad) => trad.tradStatus === TraductionsStatus.TO_REVIEW).length;
  if (nbARevoir > 0) return TraductionsStatus.TO_REVIEW;
  return TraductionsStatus.PENDING;
};

const TranslationsAvancement = (props: Props) => {
  const routerLocale = useRouterLocale();
  const { getLanguage, userTradLanguages } = useLanguages();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TraductionsStatus | "all">(
    getInitialFilterStatus(props.isExpert, props.data),
  );
  const [typeContenuFilter, setTypeContenuFilter] = useState<ContentType | "all">(ContentType.DISPOSITIF);
  const [showNeedsList, setShowNeedsList] = useState(false);
  const toggleNeedsList = () => setShowNeedsList(!showNeedsList);

  const navigateToLanguage = (e: any, langue: string) => {
    if (props.actualLanguage?.i18nCode === langue) {
      e.preventDefault();
    }
  };

  const onFilterClick = (status: TraductionsStatus | "all") => {
    setShowNeedsList(false);
    if (status === statusFilter) return setStatusFilter("all");
    return setStatusFilter(status);
  };

  const onTypeContenuFilterClick = (status: ContentType | "all") => {
    if (showNeedsList) {
      setShowNeedsList(false);
      setTypeContenuFilter(status);
    } else {
      if (status === typeContenuFilter) return setTypeContenuFilter("all");
      setTypeContenuFilter(status);
    }
  };
  const handleChange = (e: any) => setSearch(e.target.value);

  const needs = useSelector(needsSelector);
  const sortedNeeds = useMemo<SortedNeed[]>(() => {
    if (isUndefined(props.actualLanguage)) return [];
    return needs
      .map((need) => {
        const status = getStatus(need, (props.actualLanguage?.i18nCode || "fr") as Languages);
        return { ...need, status };
      })
      .sort((a, b) => {
        if (a.status === b.status) {
          return a.theme.name.fr > b.theme.name.fr ? 1 : -1;
        }
        if (a.status === "À traduire") return -1;
        if (b.status === "À traduire") return 1;

        if (a.status === "À revoir") return -1;
        if (b.status === "À revoir") return 1;

        return 1;
      });
  }, [needs, props.actualLanguage]);

  if (isUndefined(props.actualLanguage)) {
    return null;
  }

  const { dataToDisplay, nbARevoir, nbATraduire, nbAValider, nbPubliees, nbDispositifs, nbDemarches } = filterData(
    props.data,
    statusFilter,
    props.isExpert,
    typeContenuFilter,
    search,
  );

  return (
    <MainContainer>
      <RowContainer>
        <Row>
          {userTradLanguages.map((_langue) =>
            getLanguage(_langue) ? (
              <div key={_langue.toString()}>
                <Link
                  data-test-id={`test-langue-${_langue}`}
                  onClick={(e) => navigateToLanguage(e, getLanguage(_langue).i18nCode)}
                  to={routerLocale + "/backend/user-translation/" + getLanguage(_langue).i18nCode}
                >
                  <LanguageTitle
                    language={getLanguage(_langue)}
                    isSelected={getLanguage(_langue).i18nCode === props.actualLanguage?.i18nCode}
                    hasMultipleLanguages={userTradLanguages.length > 1}
                  />
                </Link>
              </div>
            ) : null,
          )}
        </Row>
        <Row>
          <IndicatorText>{`Vous avez traduit ${props.nbWords} mots pendant ${props.timeSpent} minutes.`}</IndicatorText>
          <FButton type="tuto" onClick={props.toggleTutoModal} name="video-outline" className="me-2">
            Explications
          </FButton>
          <FButton type="dark" onClick={props.toggleTraducteurModal} name="settings-2-outline">
            Mes langues
          </FButton>
        </Row>
      </RowContainer>
      <FilterBarContainer>
        <Row>
          {props.isExpert && (
            <FilterButton
              status={TraductionsStatus.TO_REVIEW}
              isSelected={statusFilter === TraductionsStatus.TO_REVIEW}
              nbContent={nbARevoir}
              onClick={() => onFilterClick(TraductionsStatus.TO_REVIEW)}
            />
          )}
          <FilterButton
            status={TraductionsStatus.TO_TRANSLATE}
            isSelected={statusFilter === TraductionsStatus.TO_TRANSLATE}
            nbContent={nbATraduire}
            onClick={() => onFilterClick(TraductionsStatus.TO_TRANSLATE)}
          />
          {props.isExpert && (
            <FilterButton
              status={TraductionsStatus.PENDING}
              isSelected={statusFilter === TraductionsStatus.PENDING}
              nbContent={nbAValider}
              onClick={() => onFilterClick(TraductionsStatus.PENDING)}
            />
          )}
          <FilterButton
            status={TraductionsStatus.VALIDATED}
            isSelected={statusFilter === TraductionsStatus.VALIDATED}
            nbContent={nbPubliees}
            onClick={() => onFilterClick(TraductionsStatus.VALIDATED)}
          />
          <FilterButton
            isSelected={typeContenuFilter === ContentType.DISPOSITIF && !showNeedsList}
            name="Dispositifs"
            onClick={() => onTypeContenuFilterClick(ContentType.DISPOSITIF)}
            nbContent={nbDispositifs}
          />
          <FilterButton
            isSelected={typeContenuFilter === ContentType.DEMARCHE && !showNeedsList}
            name="Démarches"
            onClick={() => onTypeContenuFilterClick(ContentType.DEMARCHE)}
            nbContent={nbDemarches}
          />
        </Row>
        <Row>
          {props.isExpert && (
            <FilterButton
              isSelected={showNeedsList}
              name="Besoins"
              onClick={toggleNeedsList}
              nbContent={sortedNeeds.filter((n) => n.status !== NeedTradStatus.TRANSLATED).length}
            />
          )}
          <CustomSearchBar value={search} onChange={handleChange} placeholder="Rechercher..." withMargin={false} />
        </Row>
      </FilterBarContainer>

      {showNeedsList ? (
        <TranslationNeedsList
          setSelectedNeedId={props.setSelectedNeedId}
          langueSelectedFr={props.actualLanguage.langueFr}
          langueI18nCode={props.actualLanguage.i18nCode as Languages}
          sortedNeeds={sortedNeeds}
        />
      ) : (
        <TranslationAvancementTable
          isExpert={props.isExpert}
          data={dataToDisplay}
          history={props.history}
          isAdmin={props.isAdmin}
          languei18nCode={props.actualLanguage.i18nCode}
          toggleCompleteProfilModal={props.toggleCompleteProfilModal}
          setElementToTranslate={props.setElementToTranslate}
          user={props.user}
        />
      )}
    </MainContainer>
  );
};

export default TranslationsAvancement;
