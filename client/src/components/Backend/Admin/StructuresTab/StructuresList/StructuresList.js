import React from "react";
import { Badge, Card, CardBody, CardHeader, Table } from "reactstrap";

import { colorStatut } from "../../../../Functions/ColorFunctions";
import "./StructuresList.scss";

const structuresList = (props) => {
  return (
    <Card className="structures-list">
      <CardHeader className="h1">
        <strong>Liste des structures</strong>
      </CardHeader>
      <CardBody>
        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">Logo</th>
              <th scope="col">Acronyme</th>
              <th scope="col">Nom</th>
              <th scope="col">Nb membres</th>
              <th scope="col">Statut</th>
            </tr>
          </thead>
          <tbody>
            {props.structures.map((structure) => (
              <tr
                key={structure._id}
                onClick={() =>
                  props.onSelect({
                    structure: {
                      ...props.initial_state.structure,
                      ...structure,
                    },
                  })
                }
              >
                <td>
                  <img
                    className="sponsor-img"
                    src={(structure.picture || {}).secure_url}
                    alt={structure.acronyme}
                  />
                </td>
                <td>{structure.acronyme}</td>
                <th scope="row">{structure.nom}</th>
                <td>{(structure.membres || []).length}</td>
                <td>
                  <Badge color={colorStatut(structure.status)}>
                    {structure.status}
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

export default structuresList;
