import React, { Component } from "react";
import lottie from "lottie-web";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { withRouter } from "react-router-dom";

import { onboarding } from "./data";
import "./OnBoardingTraducteurModal.scss";

class OnBoardingTraducteurModal extends Component {
  state = {
    onboardingNumber: 0,
  };

  componentDidMount() {
    this.changeLottieAnimation();
  }

  componentDidUpdate() {
    this.changeLottieAnimation();
  }

  continue = () => {
    this.setState(
      (prevState) => ({ onboardingNumber: prevState.onboardingNumber + 1 }),
      () => this.changeLottieAnimation()
    );
  };

  startOnBoarding = () => {
    this.props.history.push({
      pathname: "/login",
      state: { traducteur: true, redirectTo: "/backend/user-dashboard" },
    });
  };

  changeLottieAnimation = () => {
    if (this.props.show) {
      if (this.state.onboardingNumber > 0) {
        lottie.destroy();
      }
      lottie.loadAnimation({
        container: document.getElementById("svgContainer"), // the dom element that will contain the animation
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: onboarding[this.state.onboardingNumber].animation,
      });
    }
  };

  render() {
    let SuccessButton = () => {
      if (this.state.onboardingNumber < onboarding.length - 1) {
        return (
          <Button color="success" onClick={this.continue}>
            Continuer
          </Button>
        );
      } else {
        return (
          <Button color="success" onClick={this.startOnBoarding}>
            Terminer
          </Button>
        );
      }
    };

    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.closeOnBoardingTraducteurModal}
        className="modal-lg on-boarding-trad-modal"
      >
        <ModalHeader
          toggle={this.props.closeOnBoardingTraducteurModal}
          className="modal-primary"
        >
          {onboarding[this.state.onboardingNumber].title}
        </ModalHeader>
        <ModalBody>
          <Row className="standard-height">
            <Col className="align-self-center">
              <div id="svgContainer" />
            </Col>

            <Col className="align-self-center">
              <p>{onboarding[this.state.onboardingNumber].content}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="light"
            onClick={this.props.closeOnBoardingTraducteurModal}
          >
            Annuler
          </Button>
          <SuccessButton />
        </ModalFooter>
      </Modal>
    );
  }
}

export default withRouter(OnBoardingTraducteurModal);
