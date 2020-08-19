import React, { Component } from "react";
import { Modal } from "reactstrap";
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
    console.log("url", this.props.url);
    const defaultUrl =
      "https://help.refugies.info/fr/article/choisir-les-themes-creer-une-fiche-dispositif-210-rkbgfq";
    return (
      <Modal
        isOpen={this.props.show}
        toggle={this.props.toggle}
        className="frame"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "40px",
            background: "#FBFBFB",
          }}
        >
          <FButton
            // href="https://help.refugies.info/fr/article/choisir-les-themes-creer-une-fiche-dispositif-210-rkbgfq"
            href={this.props.url || defaultUrl}
            type="dark"
            name="expand-outline"
            fill={variables.noir}
            className="mr-10"
            target="_blank"
          >
            Voir en entier
          </FButton>
          <FButton
            type="tuto"
            name={"checkmark"}
            className="ml-10"
            onClick={this.props.toggle}
          >
            Compris !
          </FButton>
        </div>
        <div
          style={{ width: "100%", height: "2px", backgroundColor: "#828282" }}
        />
        <iframe
          style={{
            alignSelf: "center",
            width: "100%",
            height: 500,
            border: "1px solid #FBFBFB",
            borderRadius: "0px 0px 12px 12px",
          }}
          allowFullScreen
          src={
            "https://help.refugies.info/fr/article/choisir-les-themes-creer-une-fiche-dispositif-210-rkbgfq/reader/"
          }
        />
      </Modal>
    );
  }
}

export default withTranslation()(FrameModal);
