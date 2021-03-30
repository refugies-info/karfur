import React, { useState } from "react";
import {
  UserLanguage,
  IDispositifTranslation,
  TranslationStatus,
} from "../../../../types/interface";
import styled from "styled-components";
import { LanguageTitle, FilterButton } from "./SubComponents";
import { TranslationAvancementTable } from "./TranslationAvancementTable";
import { filterData, getTradAmount } from "./functions";

interface Props {
  userTradLanguages: UserLanguage[];
  history: any;
  actualLanguage: string;
  isExpert: boolean;
  data: IDispositifTranslation[];
  isAdmin: boolean;
}

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  //   justify-content: space-between;
  align-items: center;
`;

const MainContainer = styled.div`
  margin: 30px 80px 30px 80px;
`;

const FilterBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

export const TranslationsAvancement = (props: Props) => {
  const [statusFilter, setStatusFilter] = useState<TranslationStatus | "all">(
    "all"
  );

  const navigateToLanguage = (langue: string) => {
    if (props.actualLanguage !== langue) {
      return props.history.push("/backend/user-translation/" + langue);
    }
    return;
  };
  const { nbARevoir, nbATraduire, nbAValider, nbPubliees } = getTradAmount(
    props.data
  );

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

  const dataToDisplay = filterData(props.data, statusFilter);

  return (
    <MainContainer>
      <RowContainer>
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
