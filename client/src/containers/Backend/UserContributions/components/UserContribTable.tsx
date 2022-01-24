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
// import "./UserContribTable.scss";
import { ObjectId } from "mongodb";

const headers = ["Type", "Titre", "Responsabilité", "Statut", "Merci", "Vues"];
interface Props {
  contributions: FormattedUserContribution[];
  toggleTutoModal: () => void;
  setTutoModalDisplayed: (arg: string) => void;
  onContributionRowClick: (arg: string) => void;
  deleteDispositif: (arg1: any, arg: ObjectId, arg2: boolean) => void;
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
                    props.setTutoModalDisplayed("Statut des fiches");
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
            // @ts-ignore
            testID={`test_${element._id}`}
          >
            <td className="first align-middle">
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
              <Responsabilite responsable={element.responsabilite} />
            </td>

            <td
              onClick={(event: any) => {
                event.stopPropagation();
                props.setTutoModalDisplayed("Statut des fiches");
                props.toggleTutoModal();
              }}
              className="align-middle"
            >
              <ContribStyledStatus text={element.status} />
            </td>

            <td className="align-middle">
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
            <td className="align-middle">
              {element.status === "Actif" ? (
                <div>
                  {element.nbVues ? element.nbVues : 0 + " "}
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

            <td className="last align-middle">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <SeeButtonWithoutNavigation />
                <DeleteButton
                  testID={"test_delete_" + element._id}
                  onClick={(event: any) =>
                    props.deleteDispositif(
                      event,
                      element._id,
                      element.isAuthorizedToDelete
                    )
                  }
                  disabled={!element.isAuthorizedToDelete}
                />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);
