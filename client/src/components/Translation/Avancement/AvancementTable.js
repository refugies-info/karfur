import React from 'react';
import { Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

import './AvancementTable.css';

export default function AvancementTable(props) {
  return (
    <Card className="avancement-table">
      <CardHeader>
        {props.title}
      </CardHeader>
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

