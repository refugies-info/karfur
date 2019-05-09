import React, { Component }  from 'react';
import track from 'react-tracking';
import { connect } from 'react-redux';

import * as actions from '../../../Store/actions';
import audioBtn from '../../../assets/figma/audioBtn.svg';
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
        <img className="audio-icon" src={audioBtn} alt="bouton audio"/>
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