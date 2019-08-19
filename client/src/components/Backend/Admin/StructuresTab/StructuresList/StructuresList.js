import React from 'react';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Table} from 'reactstrap';

import {colorStatut} from '../../../../Functions/ColorFunctions'
import './StructuresList.scss'

const structuresList = (props) => {
  return(
    <Card className="themes-list">
      <CardHeader className="h1">
        <strong>Liste des structures</strong>
      </CardHeader>
      <CardBody>
        <Table responsive hover>
          <thead>
            <tr>
              <th scope="col">Acronyme</th>
              <th scope="col">Nom</th>
              <th scope="col">Statut</th>
            </tr>
          </thead>
          <tbody>
            {props.structures.map((structure) =>
              <tr key={structure._id} onClick={() => props.onSelect({structure : {...props.structure, ...structure}})}>
                <td>{structure.acronyme}</td>
                <th scope="row">{structure.nom}</th>
                <td><Badge color={colorStatut(structure.status)}>{structure.status}</Badge></td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

export default structuresList;