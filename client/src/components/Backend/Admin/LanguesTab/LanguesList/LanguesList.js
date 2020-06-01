import React from "react";
import { Badge, Card, CardBody, CardHeader, Table } from "reactstrap";

import { colorStatut } from "../../../../Functions/ColorFunctions";
import "./LanguesList.scss";

const languesList = (props) => {
  const langue_backup = (langue) => {
    if (langue.langueBackupId && langue.langueBackupId !== "undefined") {
      return props.langues.find((item) => item._id === langue.langueBackupId)
        .langueFr;
    } else if (langue.langueIsDialect) {
      return "A définir !";
    } else {
      return "Aucune";
    }
  };
  return (
    <Card className="langues-list">
      <CardHeader className="h1">
        <strong>Langues disponibles</strong>
      </CardHeader>
      <CardBody>
        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">Nom</th>
              <th scope="col">Drapeau</th>
              <th scope="col">Code i18n</th>
              <th scope="col">Langue de backup</th>
              <th scope="col">Statut</th>
            </tr>
          </thead>
          <tbody>
            {props.langues.map((langue, index) => (
              <tr
                key={langue._id.toString()}
                onClick={() => props.onSelect({ langue: langue })}
              >
                <th scope="row">{langue.langueFr}</th>
                <td>
                  <i
                    className={"flag-icon flag-icon-" + langue.langueCode}
                    title={langue.langueCode}
                  ></i>
                </td>
                <td>{langue.i18nCode}</td>
                <td>{langue_backup(langue)}</td>
                <td>
                  <Badge color={colorStatut(langue.status)}>
                    {langue.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default languesList;
