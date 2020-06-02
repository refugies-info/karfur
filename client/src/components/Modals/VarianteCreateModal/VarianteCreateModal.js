import React, { Component } from "react";
import { ModalBody, ModalFooter } from "reactstrap";

import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import FButton from "../../FigmaUI/FButton/FButton";
import Modal from "../Modal";
import { tutos } from "./data";

import "./VarianteCreateModal.scss";
import variables from "scss/colors.scss";

class VarianteCreateModal extends Component {
  render() {
    const { toggle } = this.props;
    return (
      <Modal
        className="variante-create-modal"
        modalHeader={
          <>
            Créer une variante
            <div className="temps-right">
              <EVAIcon
                className="mr-8"
                name="clock-outline"
                size="large"
                fill={variables.noir}
              />
              <span>≈ 40 min</span>
            </div>{" "}
          </>
        }
        {...this.props}
      >
        <ModalBody>
          <b>Vous allez rédiger une variante pour la démarche suivante :</b>
          <div className="bandeau-bleu" onClick={toggle}>
            <span>{this.props.titreInformatif}</span>
            <FButton
              type="light-action"
              name="eye-outline"
              fill={variables.noir}
              onClick={toggle}
            />
          </div>
          {tutos.map((tuto, key) => (
            <div className="video-bloc" key={key}>
              <div className="video-wrapper">
                <EVAIcon name="video" />
              </div>
              <div className="texte-video">
                <b>{key + 1}</b>
                <br />
                {tuto.texte}
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <div className="left-side">
            <FButton
              type="outline-black"
              name="arrow-back-outline"
              onClick={toggle}
              className="mr-10"
            >
              Retour
            </FButton>
            <FButton
              type="help"
              name="question-mark-circle"
              fill={variables.error}
              onClick={this.props.upcoming}
            >
              J'ai besoin d'aide
            </FButton>
          </div>
          <FButton type="validate" name="checkmark" onClick={toggle}>
            Ok, j’ai compris !
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default VarianteCreateModal;
