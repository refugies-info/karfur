import React from "react";
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
  Row,
} from "reactstrap";
import "./CreationTForm.css";

const creationTForm = (props) => {
  let statuts = ["Actif", "En attente", "Inactif", "Supprimé"];
  return (
    <Card>
      <CardHeader className="h1">
        <strong>
          {props.theme._id ? "Modifier un thème" : "Ajouter un thème"}
        </strong>
      </CardHeader>
      <CardBody>
        <Form
          action=""
          method="post"
          encType="multipart/form-data"
          className="form-horizontal"
        >
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="themeNom">Nom du thème</Label>
            </Col>
            <Col xs="12" md="9">
              <Input
                type="text"
                id="themeNom"
                name="theme"
                placeholder="Nom du thème"
                value={props.theme.themeNom}
                onChange={props.handleChange}
              />
              <FormText color="muted">Par exemple : Hébérgement</FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="themeDescription">Description du thème</Label>
            </Col>
            <Col xs="12" md="9">
              <Input
                type="textarea"
                rows="6"
                id="themeDescription"
                name="theme"
                placeholder="Description"
                value={props.theme.themeDescription}
                onChange={props.handleChange}
              />
              <FormText color="muted">
                Description en bref (100 caractères environ)
              </FormText>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col md="3">
              <Label>Le thème est-il un sous-thème ?</Label>
            </Col>
            <Col md="9">
              <FormGroup check inline className="radio">
                <Input
                  className="form-check-input"
                  type="radio"
                  id="themeIsUnder"
                  name="theme"
                  value={true}
                  checked={
                    props.theme.themeIsUnder === "true" ||
                    props.theme.themeIsUnder === true
                  }
                  onChange={props.handleChange}
                />
                <Label
                  check
                  className="form-check-label"
                  htmlFor="themeIsUnder"
                >
                  Oui
                </Label>
              </FormGroup>
              <FormGroup check inline className="radio">
                <Input
                  className="form-check-input"
                  type="radio"
                  id="themeIsUnderB|><"
                  name="theme"
                  value={false}
                  checked={
                    props.theme.themeIsUnder === "false" ||
                    props.theme.themeIsUnder === false
                  }
                  onChange={props.handleChange}
                />
                <Label
                  check
                  className="form-check-label"
                  htmlFor="themeIsUnder"
                >
                  Non
                </Label>
              </FormGroup>
              <FormText color="muted">
                Le thème a-t-il des dépendances envers un autre thème ?
              </FormText>
            </Col>
          </FormGroup>
          {(props.theme.themeIsUnder === "true" ||
            props.theme.themeIsUnder === true) && (
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="themeUnderId">
                  Sélectionnez le thème de rattachement
                </Label>
              </Col>
              <Col xs="12" md="9">
                <Input
                  type="select"
                  id="themeUnderId"
                  name="theme"
                  value={props.theme.themeUnderId}
                  onChange={props.handleChange}
                >
                  <option value="undefined">Thème de rattachement</option>
                  {props.themes.map((theme) => (
                    <option
                      value={theme._id.toString()}
                      key={theme._id.toString()}
                    >
                      {theme.themeNom}
                    </option>
                  ))}
                </Input>
              </Col>
            </FormGroup>
          )}
          <FormGroup row>
            <Col md="3">
              <Label htmlFor="select">Statut sur notre site</Label>
            </Col>
            <Col xs="12" md="9">
              <Input
                type="select"
                id="statusT|=R"
                name="theme"
                value={props.theme.status}
                onChange={props.handleChange}
              >
                {statuts.map((statut) => (
                  <option value={statut} key={statut}>
                    {statut}
                  </option>
                ))}
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
              onClick={() => props.onValidate("theme")}
            >
              Valider
            </Button>
          </Col>
          <Col>
            <Button
              color="danger"
              size="lg"
              block
              onClick={() => props.onCancel("theme")}
            >
              Annuler
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>
  );
};

export default creationTForm;
