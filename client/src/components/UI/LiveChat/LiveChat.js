import React, {Component} from 'react';
import {Launcher} from 'react-chat-window';
import track from 'react-tracking';

import messageHistory from './messageHistory';
import './LiveChat.css';

class LiveChat extends Component {
  state = {
    messageList: messageHistory,
    newMessagesCount: 0,
    isOpen: false
  };

  componentDidMount() {    
    this.props.socket.on('MessageSent', msg => {
      this.setState({
        messageList: [...this.state.messageList, msg],
        newMessagesCount : this.state.newMessagesCount +1
      });
    });
  }

  _onMessageWasSent(message) {
    message.author='them';
    this.props.socketFn.sendMessage(message, 'client');
  }

  _onFilesSelected(fileList) {
    const objectURL = window.URL.createObjectURL(fileList[0]);
    this.setState({
      messageList: [...this.state.messageList, {
        type: 'file', author: "me",
        data: {
          url: objectURL,
          fileName: fileList[0].name
        }
      }]
    })
  }

  _sendMessage(text) {
    if (text.length > 0) {
      const newMessagesCount = this.state.isOpen ? this.state.newMessagesCount : this.state.newMessagesCount + 1
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  _handleClick() {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0
    },()=>{
      this.props.tracking.trackEvent({ action: 'click', label: 'isOpen', value : this.state.isOpen });
    })
  }

  render() {
      return (
        <div className="myLiveChat">
          <Launcher
            agentProfile={{
              teamName: 'Fenêtre de discussion Karfu\'R',
              imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
            }} 
            //https://entrepreneur-interet-general.etalab.gouv.fr//img/communaute/soufiane-lamrissi.png
            onMessageWasSent={this._onMessageWasSent.bind(this)}
            onFilesSelected={this._onFilesSelected.bind(this)}
            messageList={this.state.messageList}
            newMessagesCount={this.state.newMessagesCount}
            handleClick={this._handleClick.bind(this)}
            isOpen={this.state.isOpen}
            showEmoji
          />
        </div>
      )
  }
}

export default track({
  component: 'LiveChat',
}, { dispatchOnMount: true })(LiveChat);