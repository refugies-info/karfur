import React, { Component } from "react";
import {
  Row,
  Col,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import FButton from "../../FigmaUI/FButton/FButton";

import "./ObjectifsModal.scss";

class ObjectifsModal extends Component {
  state = {
    objectifs: [
      {
        objectifTemps: 3,
        objectifMots: 150,
        status: "ponctuel",
        texte: "« Je n’ai vraiment pas beaucoup de temps en ce moment... »",
        selected: false,
      },
      {
        objectifTemps: 8,
        objectifMots: 400,
        status: "régulier",
        texte: "« Je vais trouver un peu de temps ! »",
        selected: false,
      },
      {
        objectifTemps: 20,
        objectifMots: 800,
        status: "Grand",
        texte: "« Je vais m’investir sérieusement  »",
        selected: false,
      },
      {
        objectifTemps: 30,
        objectifMots: 2000,
        status: "Ambassadeur",
        texte: "« Vous êtes ma priorité du moment  »",
        selected: false,
      },
    ],
    notifyObjectifs: false,
  };

  toggleActive = (key) => {
    this.setState({
      objectifs: this.state.objectifs.map((x, i) =>
        i === key ? { ...x, selected: true } : { ...x, selected: false }
      ),
    });
  };

  handleCheckChange = (ev) =>
    this.setState({ notifyObjectifs: ev.target.checked });

  _validateObjectifs = () => {
    let objectif = this.state.objectifs.find((x) => x.selected);
    const contribPrepend = this.props.contributeur ? "Contrib" : "";
    let newUser = {
      ["objectifTemps" + contribPrepend]: objectif.objectifTemps,
      ["objectifMots" + contribPrepend]: objectif.objectifMots,
      ["notifyObjectifs" + contribPrepend]: this.state.notifyObjectifs,
    };
    this.props.validateObjectifs(newUser);
  };

  render() {
    let { objectifs, notifyObjectifs } = this.state;
    let { contributeur } = this.props;
    const statut = contributeur ? "Rédacteur" : "Traducteur";
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="modal-objectifs"
      >
        <ModalHeader toggle={this.props.toggle}>
          Mon objectif de {contributeur ? "rédaction" : "traduction"}
        </ModalHeader>
        <ModalBody>
          <span className="text-small">
            Ces objectifs mensuels vous aident à définir un niveau d’engagement
            et nous aident à mieux vous comprendre. Vous pouvez les modifier à
            tout moment.
          </span>
          <div className="objectifs-wrapper">
            {objectifs.map((objectif, key) => (
              <Row
                className={
                  "obj-row mt-10" + (objectifs[key].selected ? " active" : "")
                }
                onClick={() => this.toggleActive(key)}
                key={key}
              >
                <Col xl="1" lg="1" md="1" sm="1" xs="1" className="obj-col">
                  <div className="dot-circle" />
                </Col>
                <Col
                  xl="4"
                  lg="4"
                  md="4"
                  sm="4"
                  xs="4"
                  className="obj-col texte-normal"
                >
                  <b>
                    {(key === 2 ? objectif.status + " " : "") +
                      (key < 3 ? statut : "") +
                      (key < 2 || key === 3 ? " " + objectif.status : "")}
                  </b>
                </Col>
                <Col
                  xl="4"
                  lg="4"
                  md="4"
                  sm="4"
                  xs="4"
                  className="obj-col texte-very-small texte-gris-fonce"
                >
                  {objectif.texte}
                </Col>
                <Col
                  xl="3"
                  lg="3"
                  md="3"
                  sm="3"
                  xs="3"
                  className="obj-col texte-small"
                >
                  <div>
                    <b>
                      {(key === 3 ? "+ de " : "") + objectif.objectifTemps}{" "}
                      heures
                    </b>
                    {key < 3 && <span className="texte-gris"> données</span>}
                  </div>
                  <div>
                    <b>
                      {(key === 3 ? "+ de " : "") + objectif.objectifMots} mots
                    </b>
                    {key < 3 && <span className="texte-gris"> traduits</span>}
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Label check>
            <Input
              type="checkbox"
              checked={notifyObjectifs}
              onChange={this.handleCheckChange}
            />{" "}
            Je souhaite être notifié par email si je ne parviens pas à tenir mes
            objectifs hebdomadaires.
          </Label>
          <FButton
            type="validate"
            name="checkmark-circle-outline"
            disabled={!objectifs.some((x) => x.selected)}
            onClick={this._validateObjectifs}
          >
            C’est parti !
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ObjectifsModal;
