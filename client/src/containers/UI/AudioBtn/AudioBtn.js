import React, { Component }  from 'react';
import track from 'react-tracking';
import { connect } from 'react-redux';

import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';

import * as actions from '../../../Store/actions/actionTypes';

import './AudioBtn.scss';
import variables from 'scss/colors.scss';

class AudioBtn extends Component {
  toggleAudio = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'toggleAudio', value : this.props.ttsActive });
    this.props.toggleAudio();
  }

  render() {
    return (
      <div className={"audio-icon-wrapper" + (this.props.ttsActive ? " pressed" : "")} onClick={this.toggleAudio}>
        <EVAIcon name={"volume-up" + (this.props.ttsActive ? "" : "-outline")} fill={(this.props.ttsActive ? "#FFFFFF" : variables.noir)} id="audioBtn" />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleAudio: () => dispatch({type: actions.TOGGLE_TTS}),
  }
}

export default track({
        layout: 'AudioBtn',
    }, { dispatchOnMount: true })(
      connect(mapStateToProps, mapDispatchToProps)(AudioBtn)
    );