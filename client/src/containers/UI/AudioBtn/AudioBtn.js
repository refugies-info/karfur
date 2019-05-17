import React, { Component }  from 'react';
import track from 'react-tracking';
import { connect } from 'react-redux';
import Icon from 'react-eva-icons';

import * as actions from '../../../Store/actions';

import './AudioBtn.scss';

class AudioBtn extends Component {
  toggleAudio = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'toggleAudio', value : this.props.ttsActive });
    const action = { type: actions.TOGGLE_TTS }
    this.props.dispatch(action);
  }

  render() {
    return (
      <div className={"audio-icon-wrapper" + (this.props.ttsActive ? " pressed" : "")} onClick={this.toggleAudio}>
        <Icon name="volume-up-outline" size="large" fill="#3D3D3D" />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ttsActive: state.tts.ttsActive
  }
}

export default track({
        layout: 'AudioBtn',
    }, { dispatchOnMount: true })(
      connect(mapStateToProps)(AudioBtn)
    );