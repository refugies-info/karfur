import React from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row} from 'reactstrap';

import CreationContent from "../../../../Frontend/Dispositif/CreationContent/CreationContent"

import './CreationSForm.scss'

const creationTForm = (props) => {
  let statuts = ['Actif', 'En attente', 'Inactif', 'Supprimé'];
  return(
    <Card>
      <CardHeader className="h1">
        <strong>
          {props.structure._id ? 'Modifier une structure' : 'Ajouter une structure'}
        </strong>
      </CardHeader>
      <CardBody className="structure-body">
        <CreationContent
          adminView
          handleChange={props.handleChange} 
          handleBelongsChange={props.handleBelongsChange} 
          handleFileInputChange={props.handleFileInputChange}
          uploading={props.uploading}
          users={props.users}
          {...props.structure} />
        <FormGroup row>
          <Col md="3" className="status-label">
            <Label htmlFor="select"><b>Statut sur notre site</b></Label>
          </Col>
          <Col xs="12" md="9">
            <Input 
              type="select" 
              id="statusK//R" 
              name="structure" 
              value={props.structure.status}
              onChange = {props.handleChange}  >
              {statuts.map((statut) =>
                <option 
                  value={statut}
                  key={statut}>
                  {statut}
                </option>
              )}
            </Input>
          </Col>
        </FormGroup>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <Button 
              color="success" 
              size="lg" 
              block
              onClick={props.preTraitementStruct} >
              Enregistrer
            </Button>
          </Col>
          <Col>
            <Button 
              color="danger" 
              size="lg" 
              block
              onClick={()=>props.onCancel('structure')}>
              Annuler
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

export default creationTForm;