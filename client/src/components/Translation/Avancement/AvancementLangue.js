import React from 'react';
import { Badge, Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink, Table, Progress } from 'reactstrap';

import './AvancementLangue.css';

const colorAvancement= avancement => {
  if(avancement >.75){
      return 'success'
  }else if(avancement >.50){
      return 'info'
  }else if(avancement >.25){
      return 'warning'
  }else{
      return 'danger'
  }
}

const colorStatut= avancement => {
  if(avancement === "Annulé"){
      return 'danger'
  }else if(avancement === "Inactif"){
      return 'secondary'
  }else if(avancement === "En attente"){
      return 'warning'
  }else{
      return 'success'
  }
}

export default function AvancementLangue(props) {
  return (
    <Card>
      <CardHeader>
        {props.title}
      </CardHeader>
      <CardBody>
        <Table responsive striped>
          <thead>
          <tr>
            <th>{props.headers[0]}</th>
            <th>{props.headers[1]}</th>
            <th>{props.headers[2]}</th>
            <th>{props.headers[3]}</th>
          </tr>
          </thead>
          <tbody>
          {props.data.map((element,key) => {
            return (
              <tr 
                key={key} 
                onClick={()=> props.switchView(props.mainView, element)}>
                <td className="align-middle">{element.name}</td>
                <td className="align-middle">
                  {props.mainView ?
                    <i className={'flag-icon flag-icon-' + element.code + ' h1'} title={element.code} id={element.code}></i>
                    :
                    element.nombreMots
                  }
                </td>
                <td className="align-middle">
                  <div>
                    {Math.round(element.avancement * 100)} %
                    {!props.mainView &&
                      ' (' + Math.round(element.nombreMots *(1-element.avancement)) + ' mots restants)'
                    }
                  </div>
                  <Progress color={colorAvancement(element.avancement)} value={element.avancement*100} className="mb-3" />
                </td>
                <td className="align-middle">
                  <Badge color={colorStatut(element.statut)}>{element.statut}</Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
        </Table>
        <Pagination>
          <PaginationItem disabled><PaginationLink previous tag="button">Précédant</PaginationLink></PaginationItem>
          <PaginationItem active>
            <PaginationLink tag="button">1</PaginationLink>
          </PaginationItem>
          <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink next tag="button">Suivant</PaginationLink></PaginationItem>
        </Pagination>
      </CardBody>
    </Card>
  );
}

