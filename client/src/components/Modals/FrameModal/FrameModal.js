import React, { Component } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import variables from "scss/colors.scss";

import FButton from "../../FigmaUI/FButton/FButton";

import "./FrameModal.scss";



export class FrameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCourseId: null,
    };
  }


  render() {
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="dispositif-validate-modal"
      >
        <ModalBody>
        <iframe style={{alignSelf: "center", width: "100%", height: 500, border:"1px solid black" }} allowFullScreen src="https://help.refugies.info/fr/article/comment-creer-une-page-dispositif-d82wz7/reader/"/>
        </ModalBody>
        <ModalFooter style={{ justifyContent: "space-between", marginTop: 50 }}>
            <FButton
            href="https://help.refugies.info/fr/article/comment-creer-une-page-dispositif-d82wz7/"
              type="dark"
              name="expand-outline"
              fill={variables.noir}
              className="mr-10"
              onClick={() => {}}
            >
              Voir en entier
            </FButton>
            <FButton
              type="tuto"
              name={"checkmark"}
              className="ml-10"
              onClick={() => {this.props.openTuto()}}
            >
              Compris !
            </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default withTranslation()(FrameModal);
