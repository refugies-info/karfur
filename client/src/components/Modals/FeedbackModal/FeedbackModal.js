import React, { Component } from "react";
import lottie from "lottie-web";
import { Row, Col, Button } from "reactstrap";

import "./FeedbackModal.css";
import Modal from "../Modal";

class FeedbackModal extends Component {
  componentDidMount() {
    lottie.destroy();
    if (this.props.success) {
      lottie.loadAnimation({
        container: document.getElementById("svgContainer"), // the dom element that will contain the animation
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "./lottie/4920-google-forms.json",
      });
    } else {
      lottie.loadAnimation({
        container: document.getElementById("svgContainer"), // the dom element that will contain the animation
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/4920-google-forms.json",
      });
    }
  }

  render() {
    return (
      <Modal
        show={this.props.show}
        classe="feedback-modal text-center"
        modalClosed={this.props.modalClosed}
      >
        <div id="svgContainer" />

        <h1>{this.props.title}</h1>
        <p>{this.props.content}</p>
        <span className="change">{this.props.small}</span>

        <Row className="align-items-center">
          <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
            <Button
              block
              outline
              color="success"
              className="btn-pill"
              onClick={this.props.clicked}
            >
              Ok
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default FeedbackModal;
