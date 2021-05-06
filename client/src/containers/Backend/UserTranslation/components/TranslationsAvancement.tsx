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
import { CustomSearchBar } from "../../../../components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";

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
  font-size: 16px;
  line-height: 20px;
  color: ${colors.darkGrey};
  margin-right: 8px;
`;

const getInitialFilterStatus = (
  isExpert: boolean,
  data: IDispositifTranslation[]
) => {
  if (!isExpert) return "À traduire";
  const nbARevoir = data.filter((trad) => trad.tradStatus === "À revoir")
    .length;
  if (nbARevoir > 0) return "À revoir";
  return "En attente";
};
export const TranslationsAvancement = (props: Props) => {
  const [search, setSearch] = useState("");
  const initialStatusFilter = getInitialFilterStatus(
    props.isExpert,
    props.data
  );
  const [statusFilter, setStatusFilter] = useState<TranslationStatus | "all">(
    initialStatusFilter
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
  const handleChange = (e: any) => setSearch(e.target.value);

  const {
    dataToDisplay,
    nbARevoir,
    nbATraduire,
    nbAValider,
    nbPubliees,
    nbDispositifs,
    nbDemarches,
  } = filterData(
    props.data,
    statusFilter,
    props.isExpert,
    typeContenuFilter,
    search
  );

  return (
    <MainContainer>
      <RowContainer>
        <Row>
          {props.userTradLanguages.map((langue) => (
            <div
              key={langue.i18nCode}
              onClick={() => navigateToLanguage(langue.i18nCode)}
              // @ts-ignore
              testID={`test-langue-${langue._id}`}
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
        <Row>
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
        </Row>

        <CustomSearchBar
          value={search}
          // @ts-ignore
          onChange={handleChange}
          placeholder="Rechercher..."
          withMargin={false}
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
