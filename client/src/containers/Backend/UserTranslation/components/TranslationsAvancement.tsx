import React, { useState } from "react";
import styled from "styled-components";
import { LanguageTitle, FilterButton, TypeContenuFilterButton } from "./SubComponents";
import { TranslationAvancementTable } from "./TranslationAvancementTable";
import { filterData } from "./functions";
import FButton from "components/UI/FButton/FButton";
import { colors } from "colors";
import CustomSearchBar from "components/UI/CustomSeachBar";
import { useLanguages } from "hooks";
import useRouterLocale from "hooks/useRouterLocale";
import { Link } from "react-router-dom";
import {
  ContentType,
  GetDispositifsWithTranslationAvancementResponse,
  GetLanguagesResponse,
  GetUserInfoResponse,
  TraductionsStatus,
} from "@refugies-info/api-types";
import isUndefined from "lodash/isUndefined";

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
  toggleNeedsModal: () => void;
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
export const TranslationsAvancement = (props: Props) => {
  const routerLocale = useRouterLocale();
  const { getLanguage, userTradLanguages } = useLanguages();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TraductionsStatus | "all">(
    getInitialFilterStatus(props.isExpert, props.data),
  );
  const [typeContenuFilter, setTypeContenuFilter] = useState<ContentType | "all">(ContentType.DISPOSITIF);

  if (isUndefined(props.actualLanguage)) {
    return null;
  }

  const navigateToLanguage = (e: any, langue: string) => {
    if (props.actualLanguage?.i18nCode === langue) {
      e.preventDefault();
    }
  };

  const onFilterClick = (status: TraductionsStatus | "all") => {
    if (status === statusFilter) return setStatusFilter("all");
    return setStatusFilter(status);
  };

  const onTypeContenuFilterClick = (status: ContentType | "all") => {
    if (status === typeContenuFilter) return setTypeContenuFilter("all");
    return setTypeContenuFilter(status);
  };
  const handleChange = (e: any) => setSearch(e.target.value);

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
          <TypeContenuFilterButton
            isSelected={typeContenuFilter === ContentType.DISPOSITIF}
            name="Dispositifs"
            onClick={() => onTypeContenuFilterClick(ContentType.DISPOSITIF)}
            nbContent={nbDispositifs}
          />
          <TypeContenuFilterButton
            isSelected={typeContenuFilter === ContentType.DEMARCHE}
            name="Démarches"
            onClick={() => onTypeContenuFilterClick(ContentType.DEMARCHE)}
            nbContent={nbDemarches}
          />
        </Row>

        <CustomSearchBar value={search} onChange={handleChange} placeholder="Rechercher..." withMargin={false} />
      </FilterBarContainer>
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
    </MainContainer>
  );
};
