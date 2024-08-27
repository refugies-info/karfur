import { Id } from "@refugies-info/api-types";
import Link from "next/link";
import { Table } from "reactstrap";
import styles from "~/scss/components/adminTable.module.scss";
import { DeleteButton, SeeButton, Title } from "../../Admin/sharedComponents/SubComponents";
import { FormattedUserContribution } from "../types";
import { ContribStyledStatus, Responsabilite, StatutHeader, TypeContenu } from "./SubComponents";

const headers = ["Type", "Titre", "Responsabilité", "Statut", "Merci", "Vues"];
interface Props {
  contributions: FormattedUserContribution[];
  toggleTutoModal: () => void;
  setTutoModalDisplayed: (arg: string) => void;
  deleteDispositif: (arg1: any, arg: Id, arg2: boolean) => void;
  isAdmin: boolean;
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
        const burl = "/" + (element.typeContenu || "dispositif") + "/" + element._id;

        return (
          <tr key={key} className={styles.line} data-testid={`test_${element._id}`}>
            <td className={styles.first + " align-middle"}>
              <TypeContenu type={element.typeContenu || "dispositif"} isDetailedVue={false} />
            </td>
            <td className="align-middle">
              <Link href={burl}>
                <Title titreInformatif={element.titreInformatif} titreMarque={element.titreMarque || null} />
              </Link>
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
              <ContribStyledStatus
                text={element.status}
                textToDisplay={element.hasDraftVersion ? "Nouvelle version en cours" : undefined}
                isAdmin={props.isAdmin}
              />
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

            <td className={styles.last + " align-middle"}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <SeeButton burl={burl} />
                <DeleteButton
                  testId={`delete-button-${element._id}`}
                  onClick={(event: any) => props.deleteDispositif(event, element._id, element.isAuthorizedToDelete)}
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
