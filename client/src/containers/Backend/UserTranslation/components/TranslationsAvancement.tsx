import React, { useState } from "react";
import {
  UserLanguage,
  IDispositifTranslation,
  TranslationStatus,
  ITypeContenu,
} from "../../../../types/interface";
import styled from "styled-components";
import {
  LanguageTitle,
  FilterButton,
  TypeContenuFilterButton,
} from "./SubComponents";
import { TranslationAvancementTable } from "./TranslationAvancementTable";
import { filterData } from "./functions";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { colors } from "../../../../colors";

interface Props {
  userTradLanguages: UserLanguage[];
  history: any;
  actualLanguage: string;
  isExpert: boolean;
  data: IDispositifTranslation[];
  isAdmin: boolean;
  toggleTraducteurModal: () => void;
  toggleTutoModal: () => void;
  nbWords: number;
  timeSpent: number;
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
  margin: 30px 80px 30px 80px;
  align-self: center;
`;

const FilterBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

const IndicatorText = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${colors.darkGrey};
  margin-right: 8px;
`;

export const TranslationsAvancement = (props: Props) => {
  const [statusFilter, setStatusFilter] = useState<TranslationStatus | "all">(
    "all"
  );
  const [typeContenuFilter, setTypeContenuFilter] = useState<
    ITypeContenu | "all"
  >("dispositif");

  const navigateToLanguage = (langue: string) => {
    if (props.actualLanguage !== langue) {
      return props.history.push("/backend/user-translation/" + langue);
    }
    return;
  };
  const getLangueId = () => {
    if (!props.userTradLanguages || props.userTradLanguages.length === 0)
      return null;
    const langueArray = props.userTradLanguages.filter(
      (langue) => langue.i18nCode === props.actualLanguage
    );
    // @ts-ignore
    if (langueArray.length > 0) return langueArray[0]._id;
    return null;
  };
  const onFilterClick = (status: TranslationStatus | "all") => {
    if (status === statusFilter) return setStatusFilter("all");
    return setStatusFilter(status);
  };

  const onTypeContenuFilterClick = (status: ITypeContenu | "all") => {
    if (status === typeContenuFilter) return setTypeContenuFilter("all");
    return setTypeContenuFilter(status);
  };

  const {
    dataToDisplay,
    nbARevoir,
    nbATraduire,
    nbAValider,
    nbPubliees,
    nbDispositifs,
    nbDemarches,
  } = filterData(props.data, statusFilter, props.isExpert, typeContenuFilter);

  return (
    <MainContainer>
      <RowContainer>
        <Row>
          {props.userTradLanguages.map((langue) => (
            <div
              key={langue.i18nCode}
              onClick={() => navigateToLanguage(langue.i18nCode)}
            >
              <LanguageTitle
                language={langue}
                isSelected={langue.i18nCode === props.actualLanguage}
                hasMultipleLanguages={props.userTradLanguages.length > 1}
              />
            </div>
          ))}
        </Row>
        <Row>
          <IndicatorText>
            {`Vous avez traduit ${props.nbWords} mots pendant ${props.timeSpent} minutes.`}
          </IndicatorText>
          <FButton
            type="tuto"
            onClick={props.toggleTutoModal}
            name="video-outline"
            className="mr-8"
          >
            Explications
          </FButton>
          <FButton
            type="dark"
            onClick={props.toggleTraducteurModal}
            name="settings-2-outline"
          >
            Mes langues
          </FButton>
        </Row>
      </RowContainer>
      <FilterBarContainer>
        {props.isExpert && (
          <FilterButton
            status="À revoir"
            isSelected={statusFilter === "À revoir"}
            nbContent={nbARevoir}
            onClick={() => onFilterClick("À revoir")}
          />
        )}
        <FilterButton
          status="À traduire"
          isSelected={statusFilter === "À traduire"}
          nbContent={nbATraduire}
          onClick={() => onFilterClick("À traduire")}
        />
        {props.isExpert && (
          <FilterButton
            status="En attente"
            isSelected={statusFilter === "En attente"}
            nbContent={nbAValider}
            onClick={() => onFilterClick("En attente")}
          />
        )}
        <FilterButton
          status="Validée"
          isSelected={statusFilter === "Validée"}
          nbContent={nbPubliees}
          onClick={() => onFilterClick("Validée")}
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
      </FilterBarContainer>
      <TranslationAvancementTable
        isExpert={props.isExpert}
        data={dataToDisplay}
        history={props.history}
        langueId={getLangueId()}
        isAdmin={props.isAdmin}
        languei18nCode={props.actualLanguage}
      />
    </MainContainer>
  );
};
