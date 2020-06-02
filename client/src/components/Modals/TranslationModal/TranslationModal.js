import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import DiptyqueTraduction from "../../Translation/DiptyqueTraduction/DiptyqueTraduction";

import "./TranslationModal.css";
import Modal from "../Modal";

class TranslationModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.show}
        modalClosed={this.props.modalClosed}
        classe="translation-modal text-center"
      >
        <DiptyqueTraduction {...this.props} />

        <span className="change">
          Cliquez sur le bouton ci-dessous pour le voir en contexte
        </span>

        <Row className="align-items-center">
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button
              block
              outline
              color="success"
              className="btn-pill"
              onClick={this.props.clicked}
            >
              Suggérer cette traduction
            </Button>
          </Col>
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button
              block
              outline
              color="danger"
              className="btn-pill"
              onClick={this.props.modalClosed}
            >
              Annuler
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default TranslationModal;
