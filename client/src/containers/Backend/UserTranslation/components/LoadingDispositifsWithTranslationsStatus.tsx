/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React from "react";
import styled from "styled-components";
import { colors } from "../../../../colors";
import { LanguageTitle, FilterButton } from "./SubComponents";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Table } from "reactstrap";

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
  width: 100%;
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

const TableContainer = styled.div`
  background: ${colors.blancSimple};
  border-radius: 12px;
  padding: 32px;
`;

interface Props {
  toggleTutoModal: () => void;
}
export const LoadingDispositifsWithTranslationsStatus = (props: Props) => {
  const arrayLines = new Array(12).fill("a");
  const arrayContent = new Array(5).fill("a");

  const headers = [
    "Type",
    "Titre",
    "Progression",
    "Mots",
    "Depuis",
    "Statut",
    "Dernière trad",
  ];

  return (
    <MainContainer>
      <RowContainer>
        <Row>
          <SkeletonTheme color={colors.blancSimple}>
            <Skeleton width={120} height={50} count={1} />
          </SkeletonTheme>
        </Row>
        <Row>
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
            // onClick={props.toggleTraducteurModal}
            name="settings-2-outline"
          >
            Mes langues
          </FButton>
        </Row>
      </RowContainer>
      <FilterBarContainer>
        <FilterButton
          status="À traduire"
          isSelected={false}
          nbContent={"..."}
          onClick={() => {}}
        />

        <FilterButton
          status="Validée"
          isSelected={false}
          nbContent={"..."}
          onClick={() => {}}
        />
      </FilterBarContainer>
      <TableContainer>
        <Table responsive borderless className="avancement-table">
          <thead>
            <tr className="tr-test">
              {headers.map((element, key) => {
                return <th key={key}>{element}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {arrayLines.map((_, key) => {
              return (
                <tr key={key} className={"bg-blancSimple"}>
                  <td>
                    <SkeletonTheme color="#CDCDCD">
                      <Skeleton width={50} count={1} />
                    </SkeletonTheme>
                  </td>
                  <td>
                    <SkeletonTheme color="#CDCDCD">
                      <Skeleton width={270} count={1} />
                    </SkeletonTheme>
                  </td>
                  {arrayContent.map((_, key) => (
                    <td key={key}>
                      <SkeletonTheme color="#CDCDCD">
                        <Skeleton width={70} count={1} />
                      </SkeletonTheme>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    </MainContainer>
  );
};
