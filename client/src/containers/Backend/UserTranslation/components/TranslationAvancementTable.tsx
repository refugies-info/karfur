import React from "react";
import { IDispositifTranslation } from "../../../../types/interface";
import styled from "styled-components";
import { colors } from "../../../../colors";
import { Table } from "reactstrap";
import { TypeContenu } from "../../UserContributions/components/SubComponents";
import { Title } from "../../Admin/sharedComponents/SubComponents";
import { ProgressWithValue, TradStatus } from "./SubComponents";
import moment from "moment/min/moment-with-locales";

moment.locale("fr");

interface Props {
  isExpert: boolean;
  data: IDispositifTranslation[];
}

const TableContainer = styled.div`
  background: ${colors.blancSimple};
  border-radius: 12px;
  padding: 32px;
`;

const headers = [
  "Type",
  "Titre",
  "Progression",
  "Mots",
  "Depuis",
  "Statut",
  "Dernière trad",
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
export const TranslationAvancementTable = (props: Props) => {
  return (
    <TableContainer>
      <Table responsive borderless>
        <thead>
          <tr>
            {headers.map((element, key) => {
              return <th key={key}>{element}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {props.data.map((element, key) => {
            const nbDays = element.created_at
              ? -moment(element.created_at).diff(moment(), "days") + " jours"
              : "ND";
            return (
              <tr
                key={key}
                // onClick={() => props.onContributionRowClick(burl)}
                className="membres-table"
              >
                <td className="align-middle">
                  <TypeContenu
                    type={element.typeContenu || "dispositif"}
                    isDetailedVue={false}
                  />
                </td>
                <td className="align-middle">
                  <Title
                    titreInformatif={element.titreInformatif}
                    titreMarque={element.titreMarque || null}
                  />
                </td>

                <td className="align-middle">
                  <ProgressWithValue avancementTrad={element.avancementTrad} />
                </td>

                <td className="align-middle">
                  {Math.round(
                    (element.nbMots || 0) * (element.avancementTrad || 0)
                  ) +
                    " / " +
                    element.nbMots}
                </td>
                <td className="align-middle">
                  {element.created_at ? nbDays : "Non disponible"}
                </td>
                <td className="align-middle">
                  <TradStatus status={element.tradStatus} />
                </td>
                <td className="align-middle">
                  {element.lastTradUpdatedAt
                    ? moment(element.lastTradUpdatedAt).format("L")
                    : "Non disponible"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </TableContainer>
  );
};
