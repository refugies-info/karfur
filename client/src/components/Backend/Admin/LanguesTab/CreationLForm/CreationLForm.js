import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row} from 'reactstrap';
import './CreationLForm.css'

const creationLForm = (props) => {
  let statuts = ['Active', 'En attente', 'Inactive', 'Annulée']
  return(
    <Card>
      <CardHeader className="h1">
        <strong>
          {props.langue._id ? 'Modifier une langue' : 'Ajouter une nouvelle langue'}
        </strong>
      </CardHeader>
      <CardBody>
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="langueFr">Nom de la langue en français</Label>
            </Col>
            <Col xs="12" md="9">
              <Input 
                type="text" 
                id="langueFr" 
                name="langue" 
                placeholder="Anglais"
                value={props.langue.langueFr}
                onChange = {props.handleChange} />
              <FormText color="muted">Par exemple : Anglais</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="langueLoc">Nom de la langue en local</Label>
            </Col>
            <Col xs="12" md="9">
              <Input 
                type="text" 
                id="langueLoc" 
                name="langue" 
                placeholder="English"
                value={props.langue.langueLoc}
                onChange = {props.handleChange} />
              <FormText color="muted">Par exemple : English</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="langueCode">Code du drapeau</Label>
            </Col>
            <Col xs="12" md="9">
              <Input 
                type="text" 
                id="langueCode" 
                name="langue" 
                placeholder="gb"
                value={props.langue.langueCode}
                onChange = {props.handleChange} />
              <FormText color="muted">Le drapeau résultant : <i className={"flag-icon flag-icon-" + props.langue.langueCode} title={props.langue.langueCode}></i></FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="i18nCode">Code i18n</Label>
            </Col>
            <Col xs="12" md="9">
              <Input 
                type="text" 
                id="i18nCode" 
                name="langue" 
                placeholder="en"
                value={props.langue.i18nCode}
                onChange = {props.handleChange} />
              <FormText color="muted">
                Au format 'en' ou 'en-GB'. Voir <a href="http://www.i18nguy.com/unicode/language-identifiers.html" target="_blank" rel="noopener noreferrer">ce site</a> pour le tableau de correspondance.</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label>La langue est-elle un dialecte d'une autre langue ?</Label>
            </Col>
            <Col md="9">
              <FormGroup check inline className="radio">
                <Input 
                  className="form-check-input" 
                  type="radio" 
                  id="langueIsDialect" 
                  name="langue" 
                  value={true}
                  checked={props.langue.langueIsDialect === 'true' || props.langue.langueIsDialect===true}
                  onChange = {props.handleChange}  />
                <Label check className="form-check-label" htmlFor="langueIsDialect">Oui</Label>
              </FormGroup>
              <FormGroup check inline className="radio">
                <Input 
                  className="form-check-input" 
                  type="radio" 
                  id="langueIsDialectB|><" 
                  name="langue" 
                  value={false}
                  checked={props.langue.langueIsDialect === 'false' || props.langue.langueIsDialect===false}
                  onChange = {props.handleChange}  />
                <Label check className="form-check-label" htmlFor="langueIsDialectB|><">Non</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          {(props.langue.langueIsDialect === 'true' || props.langue.langueIsDialect===true) &&
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="select">Sélectionnez la langue de rattachement</Label>
              </Col>
              <Col xs="12" md="9">
                <Input 
                  type="select" 
                  id="langueBackupId" 
                  name="langue" 
                  value={props.langue.langueBackupId}
                  onChange = {props.handleChange}  >
                  <option value="undefined">Langue de rattachement</option>
                  {props.langues.map((langue) =>
                    <option 
                      value={langue._id.toString()}
                      key={langue._id.toString()}>
                      {langue.langueFr}
                    </option>
                  )}
                </Input>
              </Col>
            </FormGroup>
          }
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="select">Statut sur notre site</Label>
            </Col>
            <Col xs="12" md="9">
              <Input 
                type="select" 
                id="statusB|><" 
                name="langue" 
                value={props.langue.status}
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
        </Form>
      </CardBody>
      <CardFooter>
        <Row>
          <Col>
            <Button 
              color="success" 
              size="lg" 
              block
              onClick={()=>props.onValidate('langue')} >
              Valider
            </Button>
          </Col>
          <Col>
            <Button 
              color="danger" 
              size="lg" 
              block
              onClick={()=>props.onCancel('langue')}>
              Annuler
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  )
}

export default creationLForm;