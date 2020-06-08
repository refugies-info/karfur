import React, { Component } from "react";
import lottie from "lottie-web";
import { Row, Col, Button } from "reactstrap";
import { Link } from "react-router-dom";

import "./SuccessModal.css";
import Modal from "../Modal";

class SuccessModal extends Component {
  componentDidMount() {
    lottie.loadAnimation({
      container: document.getElementById("svgContainer"), // the dom element that will contain the animation
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "./lottie/lottie-success-animation.json",
    });
  }

  render() {
    return (
      <Modal show={this.props.show} classe="success-modal text-center">
        <div id="svgContainer" />

        <h1>Succès !</h1>
        <p>Nous avons enregistré votre article avec succès.</p>
        <span className="change">
          Cliquez sur le bouton ci-dessous pour le voir en contexte
        </span>

        <Row className="align-items-center">
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Link to={"/article/" + this.props.article_id}>
              <Button
                block
                outline
                color="success"
                className="btn-pill"
                onClick={this.props.clicked}
              >
                Ok
              </Button>
            </Link>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default SuccessModal;
