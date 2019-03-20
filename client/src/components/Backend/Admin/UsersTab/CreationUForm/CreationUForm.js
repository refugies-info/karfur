import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row} from 'reactstrap';

import UserChange from '../../../User/UserChange/UserChange'
import './CreationUForm.css'

const creationUForm = (props) => {
  return(
    <Card>
      <CardHeader className="h1">
        <strong>Ajouter un nouvel utilisateur</strong>
      </CardHeader>
      <CardBody>
        <UserChange {...props}/>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <Button 
              color="success" 
              size="lg" 
              block
              onClick={props.validateUser} >
              Valider
            </Button>
          </Col>
          <Col>
            <Button 
              color="danger" 
              size="lg" 
              block
              onClick={()=>props.onCancel('user')}>
              Annuler
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

export default creationUForm;