import React, { useState } from "react";
import { ITypeContenu } from "types/interface";
import styled from "styled-components";
import { GetDispositifsWithTranslationAvancementResponse, TraductionsStatus } from "api-types";
import { LanguageTitle, FilterButton, TypeContenuFilterButton } from "./SubComponents";
import { TranslationAvancementTable } from "./TranslationAvancementTable";
import { filterData } from "./functions";
import FButton from "components/UI/FButton/FButton";
import { colors } from "colors";
import CustomSearchBar from "components/UI/CustomSeachBar";
import { useLanguages } from "hooks";
import useRouterLocale from "hooks/useRouterLocale";
import { Link } from "react-router-dom";
import { GetUserInfoResponse } from "api-types";

interface Props {
  history: any;
  actualLanguage: string;
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
  getLangueId: any;
  toggleNeedsModal: () => void;
  isOneNeedNonTranslated: boolean;
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

const getInitialFilterStatus = (
  isExpert: boolean,
  data: GetDispositifsWithTranslationAvancementResponse[],
): TraductionsStatus => {
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
  const [typeContenuFilter, setTypeContenuFilter] = useState<ITypeContenu | "all">("dispositif");

  const navigateToLanguage = (e: any, langue: string) => {
    if (props.actualLanguage === langue) {
      e.preventDefault();
    }
  };

  const onFilterClick = (status: TraductionsStatus | "all") => {
    if (status === statusFilter) return setStatusFilter("all");
    return setStatusFilter(status);
  };

  const onTypeContenuFilterClick = (status: ITypeContenu | "all") => {
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
          {userTradLanguages.map((langue) => (
            <div key={langue.toString()}>
              <Link
                data-test-id={`test-langue-${langue}`}
                onClick={(e) => navigateToLanguage(e, getLanguage(langue).i18nCode)}
                to={routerLocale + "/backend/user-translation/" + getLanguage(langue).i18nCode}
              >
                <LanguageTitle
                  language={getLanguage(langue)}
                  isSelected={getLanguage(langue).i18nCode === props.actualLanguage}
                  hasMultipleLanguages={userTradLanguages.length > 1}
                />
              </Link>
            </div>
          ))}
        </Row>
        <Row>
          <IndicatorText>{`Vous avez traduit ${props.nbWords} mots pendant ${props.timeSpent} minutes.`}</IndicatorText>
          <FButton type="tuto" onClick={props.toggleTutoModal} name="video-outline" className="me-2">
            Explications
          </FButton>
          {props.isExpert && (
            <FButton
              type={props.isOneNeedNonTranslated ? "error" : "dark"}
              onClick={props.toggleNeedsModal}
              className="me-2"
            >
              Besoins
            </FButton>
          )}
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
            isSelected={typeContenuFilter === "dispositif"}
            name="Dispositifs"
            onClick={() => onTypeContenuFilterClick("dispositif")}
            nbContent={nbDispositifs}
          />
          <TypeContenuFilterButton
            isSelected={typeContenuFilter === "demarche"}
            name="Démarches"
            onClick={() => onTypeContenuFilterClick("demarche")}
            nbContent={nbDemarches}
          />
        </Row>

        <CustomSearchBar value={search} onChange={handleChange} placeholder="Rechercher..." withMargin={false} />
      </FilterBarContainer>
      <TranslationAvancementTable
        isExpert={props.isExpert}
        data={dataToDisplay}
        history={props.history}
        langueId={props.getLangueId()}
        isAdmin={props.isAdmin}
        languei18nCode={props.actualLanguage}
        toggleCompleteProfilModal={props.toggleCompleteProfilModal}
        setElementToTranslate={props.setElementToTranslate}
        user={props.user}
      />
    </MainContainer>
  );
};
