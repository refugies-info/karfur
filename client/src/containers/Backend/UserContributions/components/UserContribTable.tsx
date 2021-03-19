/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React from "react";
import { Table } from "reactstrap";
import { FormattedUserContribution } from "../types";
import { TypeContenu, Responsabilite } from "./SubComponents";
import {
  Title,
  SeeButton,
  DeleteButton,
} from "../../Admin/sharedComponents/SubComponents";

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
}
export const UserContribTable = (props: Props) => (
  <Table responsive borderless>
    <thead>
      <tr>
        {headers.map((element, key) => (
          <th key={key}>{element}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {props.contributions.map((element, key) => {
        const burl =
          "/" + (element.typeContenu || "dispositif") + "/" + element._id;

        return (
          <tr key={key}>
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

            <td className="align-middle cursor-pointer">
              <Responsabilite responsable={element.responsabilite} />
            </td>

            <td className={"align-middle "}>{element.status}</td>

            <td className="align-middle">
              {element.status === "Actif" ? element.nbMercis : "ND"}
            </td>
            <td className="align-middle">
              {element.status === "Actif" ? element.nbVues : "ND"}
            </td>

            <td className="align-middle">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <SeeButton burl={burl} />
                <DeleteButton onClick={() => {}} disabled={false} />
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);
