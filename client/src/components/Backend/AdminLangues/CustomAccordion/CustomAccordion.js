import React from 'react';
import {Button, Badge, Card, CardBody, CardHeader, Collapse } from 'reactstrap';

import './CustomAccordion.css'

const customAccordion = (props) => {

  return(
    <Card>
      <CardHeader>
        {props.data.title}
        <div className="card-header-actions">
          <Badge color="secondary">{props.data.badge}</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <div id="accordion">
          {props.data.headers.map((header, index) => {
            return (
              <Card className="mb-0" key={index}>
                <CardHeader id="headingOne">
                  <Button block color="link" className="text-left m-0 p-0" onClick={() => props.toggleAccordion(index, props.data.title)} aria-expanded={props.accordion[index]} aria-controls="collapseOne">
                    {header.title}
                    <div className="card-header-actions">
                      <Badge color={header.color} className="float-right">{header.badge}</Badge>
                    </div>
                  </Button>
                </CardHeader>
                <Collapse isOpen={props.accordion[index]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                  <CardBody>
                    1. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non
                    cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird
                    on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred
                    nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft
                    beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                  </CardBody>
                </Collapse>
              </Card>
            )}
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default customAccordion;