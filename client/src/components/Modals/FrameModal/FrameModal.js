import React, { Component } from "react";
import { Modal } from "reactstrap";
import { withTranslation } from "react-i18next";
import { colors } from "colors";
import _ from "lodash";

import FButton from "../../FigmaUI/FButton/FButton";
import { sectionUrlCorrespondencies } from "./data";

import "./FrameModal.scss";

export class FrameModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCourseId: null,
    };
  }

  getTutoUrl = () => {
    const defaultUrl =
      "https://help.refugies.info/fr/article/comment-creer-une-page-dispositif-d82wz7";
    if (!this.props.section) {
      return defaultUrl;
    }
    const sectionUrlCorrespondency = _.find(sectionUrlCorrespondencies, {
      section: this.props.section,
    });

    if (!sectionUrlCorrespondency || !sectionUrlCorrespondency.tutoUrl) {
      return defaultUrl;
    }
    return sectionUrlCorrespondency.tutoUrl;
  };

  render() {
    const tutoUrl = this.getTutoUrl();
    return (
      <Modal
        isOpen={this.props.show}
        toggle={() => this.props.toggle("")}
        className="frame"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "40px",
            background: "#FBFBFB",
            filter: "drop-shadow(0px 8px 8px rgba(0, 0, 0, 0.15))",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        >
          <FButton
            href={tutoUrl}
            type="dark"
            name="external-link"
            fill={colors.noir}
            className="mr-10"
            target="_blank"
          >
            Voir dans le centre d'aide
          </FButton>
          <FButton
            type="tuto"
            name={"checkmark"}
            className="ml-10"
            onClick={() => this.props.toggle("")}
          >
            Compris !
          </FButton>
        </div>
        <iframe
          style={{
            alignSelf: "center",
            width: "100%",
            height: 500,
            border: "1px solid #FBFBFB",
            borderRadius: "0px 0px 12px 12px",
          }}
          allowFullScreen
          src={tutoUrl + "/reader/"}
        />
      </Modal>
    );
  }
}

export default withTranslation()(FrameModal);
