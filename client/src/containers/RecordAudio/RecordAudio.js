import React, { Component } from 'react';
import track from 'react-tracking';
import { withTranslation } from 'react-i18next';
import RecorderJS from 'recorder-js';
import { Button } from 'reactstrap';

import API from '../../utils/API';
import { getAudioStream, exportBuffer } from './audio';

import './RecordAudio.scss';

class RecordAudio extends Component {
  state = {
    stream: null,
    recording: false,
    recorder: null
  }

  async componentDidMount() {
    let stream;
    try {
      stream = await getAudioStream();
    } catch (error) { console.log(error); }
    this.setState({ stream });
  }

  startRecord = () => {
    const { stream } = this.state;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const recorder = new RecorderJS(audioContext);
    recorder.init(stream);

    this.setState(
      {
        recorder,
        recording: true
      },
      () => {
        recorder.start();
      }
    );
  }

  stopRecord = async () => {
    const { recorder } = this.state;

    const { buffer } = await recorder.stop()
    const faudio = exportBuffer(buffer[0]);
    console.log(faudio)

    //Save audio
    API.set_audio({buffer:buffer, text:document.getElementById('content').innerText}).then(data => {
      console.log(data.data.data)
      API.get_audio({_id:data.data.data._id}).then(data => {
        let newData=data.data.data[0];
        console.log(newData.buffer)
        console.log(Object.values(newData.buffer[0]))
        let newBuffer=Object.values(newData.buffer[0]);
        let audio = exportBuffer(newBuffer);

        // Process the audio here.
        console.log(audio);
        var url = window.URL.createObjectURL(audio)
        let audioT = new Audio();
        audioT.src = url;
        audioT.load();
        audioT.play();
    
        this.setState({
          recording: false
        });
      })
    })

  }

  render(){
    const { recording, stream } = this.state;
    return(
      <div className="animated fadeIn record-audio">
        <div>
          {stream &&
            <Button color="primary" onClick={() => {
                recording ? this.stopRecord() : this.startRecord();
              }} >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </Button>}        
        </div>
        <h3>Lire le texte suivant :</h3>
        <div id="content">
          Ceci est un texte de test pour tester la fonction d'enregistrement audio. Allez-y, appuyez sur le bouton d'enregistrement et lisez-le.
        </div>
      </div>
    );
  }
}

export default track({
    page: 'RecordAudio',
  })(
    withTranslation()(RecordAudio)
  );