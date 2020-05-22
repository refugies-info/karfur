import React, { Component } from "react";
import track from "react-tracking";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import _ from "lodash";

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import * as actions from "../../../services/actions/actionTypes";

import "./AudioBtn.scss";
import variables from "scss/colors.scss";

class AudioBtn extends Component {
  toggleAudio = () => {
    this.props.tracking.trackEvent({
      action: "click",
      label: "toggleAudio",
      value: this.props.ttsActive,
    });
    this.props.toggleAudio();
  };

  render() {
    const { showAudioSpinner, ttsActive } = this.props;
    if (["fr", "en", "ar"].includes(_.get(this.props, "i18n.language"))) {
      return (
        <div
          className={"audio-icon-wrapper mr-10" + (ttsActive ? " pressed" : "")}
          onClick={this.toggleAudio}
        >
          {showAudioSpinner ? (
            <Spinner color="light" className="audio-spinner" />
          ) : (
            <EVAIcon
              name={"volume-up" + (ttsActive ? "" : "-outline")}
              fill={ttsActive ? "#FFFFFF" : variables.noir}
              id="audioBtn"
            />
          )}
        </div>
      );
    } else {
      return false;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive,
    showAudioSpinner: state.tts.showAudioSpinner,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAudio: () => dispatch({ type: actions.TOGGLE_TTS }),
  };
};

export default track(
  {
    layout: "AudioBtn",
  },
  { dispatchOnMount: true }
)(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AudioBtn)));
