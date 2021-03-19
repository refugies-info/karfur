import React from "react";
import { Table } from "reactstrap";
import { FormattedUserContribution } from "../types";
import {
  TypeContenu,
  Responsabilite,
  ContribStyledStatus,
  StatutHeader,
} from "./SubComponents";
import {
  Title,
  DeleteButton,
  SeeButtonWithoutNavigation,
} from "../../Admin/sharedComponents/SubComponents";
import "./UserContribTable.scss";

const headers = [
  "Type",
  "Titre",
  "Responsabilité",
  "Statut",
  "Merci",
  "Vues",
  "Actions",
];
interface Props {
  contributions: FormattedUserContribution[];
  toggleTutoModal: () => void;
  setTutoModalDisplayed: (arg: string) => void;
  onContributionRowClick: (arg: string) => void;
}
export const UserContribTable = (props: Props) => (
  <Table responsive borderless>
    <thead>
      <tr>
        {headers.map((element, key) => {
          if (element === "Statut") {
            return (
              <th key={key}>
                <StatutHeader
                  onClick={() => {
                    props.setTutoModalDisplayed("Statut");
                    props.toggleTutoModal();
                  }}
                />
              </th>
            );
          }

          return <th key={key}>{element}</th>;
        })}
      </tr>
    </thead>
    <tbody>
      {props.contributions.map((element, key) => {
        const burl =
          "/" + (element.typeContenu || "dispositif") + "/" + element._id;

        return (
          <tr
            key={key}
            onClick={() => props.onContributionRowClick(burl)}
            className="line"
          >
            <td className="first">
              <TypeContenu
                type={element.typeContenu || "dispositif"}
                isDetailedVue={false}
              />
            </td>
            <td>
              <Title
                titreInformatif={element.titreInformatif}
                titreMarque={element.titreMarque || null}
              />
            </td>

            <td>
              <Responsabilite responsable={element.responsabilite} />
            </td>

            <td
              onClick={() => {
                props.setTutoModalDisplayed("Statut-" + element.status);
                props.toggleTutoModal();
              }}
            >
              <ContribStyledStatus text={element.status} />
            </td>

            <td>
              {element.status === "Actif" ? (
                <div>
                  {element.nbMercis + " "}
                  <span role="img" aria-label="thanks">
                    🙏
                  </span>
                </div>
              ) : (
                <span role="img" aria-label="locked">
                  🔒
                </span>
              )}
            </td>
            <td>
              {element.status === "Actif" ? (
                <div>
                  {element.nbVues + " "}
                  <span role="img" aria-label="nbVues">
                    📈
                  </span>
                </div>
              ) : (
                <span role="img" aria-label="locked">
                  🔒
                </span>
              )}
            </td>

            <td className="last">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <SeeButtonWithoutNavigation />
                <DeleteButton onClick={() => {}} disabled={false} />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);
