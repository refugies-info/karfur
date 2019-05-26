import React from 'react';
import { Card, CardBody, CardHeader, Table, Button } from 'reactstrap';
import Icon from 'react-eva-icons';

import './AvancementTable.scss';
import SVGIcon from '../../UI/SVGIcon/SVGIcon';

export default function AvancementTable(props) {
  return (
    <Card className="avancement-table">
      {props.title && 
        <CardHeader>
          {props.title}
        </CardHeader>}
      <CardBody>
        <Table responsive striped>
          <thead>
            <tr>
              {props.headers.map((element,key) => {
                return (
                  <th key={key}>{element}</th>
                )}
              )}
            </tr>
          </thead>
          <tbody>
            {props.children}

            {props.limit && 
              <tr >
                <td colSpan="6" className="align-middle voir-plus" onClick={props.toggleModal}>
                  <Icon name="expand-outline" fill="#3D3D3D" size="large"/>&nbsp;
                  Voir plus
                </td>
              </tr>}
          </tbody>
        </Table>
      </CardBody>
      {props.protection && 
        <div className="ecran-protection no-recent">
          <div className="content-wrapper">
            <h1>Retrouvez ici vos traductions récentes</h1>
            <Button color="primary" onClick={()=>props.quickAccess()}>
              <SVGIcon name="translate" fill="#FFFFFF" />
              Commencer à traduire
            </Button>
          </div>
        </div>}
    </Card>
  );
}

