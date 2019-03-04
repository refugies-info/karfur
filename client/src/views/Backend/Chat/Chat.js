import React from 'react';
import track from 'react-tracking';
import { socket } from '../../../utils/API';

import users from './users';
import userdata from './userdata';
import messageHistory from './messageHistory';

import avatar_bg_colored from '../../../assets/avatar_bg_colored.svg'
import my_avatar from '../../../assets/avatar.png'

import './Chat.scss';

export class Chat extends React.Component {
  state={
    attachedClasses: ["action_menu"],
    messageList: messageHistory,
    newMessagesCount: 0,
    message:{
      type: 'text', 
      author: 'me', 
      data: { text: ''} 
    }
  }
  componentWillMount = () => {
    document.body.style.background = "#7F7FD5";
    document.body.style.background = "-webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)";
    document.body.style.background = "linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)";
  }

  componentWillUnmount = () => {
    document.body.style.background = null;
  }

  componentDidMount() {    
    socket.on('MessageSent', msg => {
      this.setState({
        messageList: [...this.state.messageList, msg]
      });
      this.scrollToBottom();
    });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  _onMessageWasSent = () => {
    this.props.socketFn.sendMessage(this.state.message, 'agent');
    this.setState({
      message: {
        ...this.state.message,
        data: { text: ''}
      }
    });
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

  _handleClick=() => {
    this.setState({
      newMessagesCount: 0
    })
  }

  handleChange = event => {
    this.setState({
      message: {
        ...this.state.message,
        data: { text: event.target.value}
      }
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  render() {
      this.toggleMenu = () => {
        if(this.state.attachedClasses.length===1){
          this.setState({attachedClasses : ["action_menu","display"]});
        }else{
          this.setState({attachedClasses : ["action_menu"]});
        }
      }
      return(
        <div className="chatContainer container-fluid h-100">
          <div className="row justify-content-center h-100">
            <div className="col-md-4 col-xl-3 chat">
              <div className="card mb-sm-3 mb-md-0 contacts_card">
                <div className="card-header">
                  <div className="input-group">
                    <input type="text" placeholder="Rechercher..." name="" className="form-control search" />
                    <div className="input-group-prepend">
                      <span className="input-group-text search_btn"><i className="fa fa-search"></i></span>
                    </div>
                  </div>
                </div>
                <div className="card-body contacts_body">
                  <div className="contacts">
                    {users.map((user, idx) => {
                      return (
                        <li key={user.userId} className={idx===0 ? "active" : undefined}>
                          <div className="d-flex bd-highlight">
                            <div className="img_cont">
                              <img 
                                src={avatar_bg_colored} 
                                className="rounded-circle user_img"
                                alt="avatar" />
                              <span className={user.satus==="en ligne" ? "online_icon" : "offline_icon offline"}></span>
                            </div>
                            <div className="user_info">
                              <span>{user.username}</span>
                              <p>{user.username} est {user.status}</p>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </div>
                </div>
                <div className="card-footer"></div>
                </div>
              </div>
              <div className="col-md-8 col-xl-6 chat">
                <div className="card">
                  <div className="card-header msg_head">
                    <div className="d-flex bd-highlight">
                      <div className="img_cont">
                        <img 
                          src={avatar_bg_colored} 
                          className="rounded-circle user_img"
                          alt="avatar" />
                        <span className="online_icon"></span>
                      </div>
                      <div className="user_info">
                        <span>Discuter avec {userdata.username}</span>
                        <p>1767 Messages</p>
                      </div>
                    </div>
                    <span id="action_menu_btn" onClick={this.toggleMenu}>
                      <i className="fa fa-ellipsis-v"></i>
                    </span>
                    <div className={this.state.attachedClasses.join(' ')}>
                      <ul>
                        <li><i className="fa fa-user-circle"></i> Voir le profil</li>
                        <li><i className="fa fa-users"></i> Ajouter aux favoris</li>
                        <li><i className="fa fa-plus"></i> Ajouter à un groupe</li>
                        <li><i className="fa fa-ban"></i> Bloquer</li>
                      </ul>
                    </div>
                  </div>
                  <div className="card-body msg_card_body">
                    {this.state.messageList.map((message, idx) => {
                      return (
                        <div key={idx} className={message.author==="me"?
                              "d-flex justify-content-end mb-4" :
                              "d-flex justify-content-start mb-4"}>
                          {message.author!=="me" && (
                            <div className="img_cont_msg">
                              <img 
                                src={avatar_bg_colored} 
                                className="rounded-circle user_img_msg"
                                alt="avatar" />
                            </div>
                          )}
                          <div className={message.author==="me"?
                              "msg_cotainer_send" :
                              "msg_cotainer"}>
                            {message.data.text}
                            <span className={message.author==="me"?
                              "msg_time_send" :
                              "msg_time"}>8:40 AM, Today</span>
                          </div>
                          {message.author==="me" && (
                            <div className="img_cont_msg">
                              <img 
                                src={my_avatar} 
                                className="rounded-circle user_img_msg"
                                alt="mon avatar" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="input-group">
                      <div className="input-group-append">
                        <span className="input-group-text attach_btn"><i className="fa fa-paperclip"></i></span>
                      </div>
                      <textarea name="" 
                        className="form-control type_msg" 
                        placeholder="Ecrivez votre message..."
                        value={this.state.message.data.text} 
                        onChange={this.handleChange}>
                      </textarea>
                      <div className="input-group-append">
                        <span className="input-group-text send_btn" onClick={this._onMessageWasSent}>
                          <i className="fa fa-location-arrow"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )
  }
};

export default track({
  page: 'Chat',
}, { dispatchOnMount: true })(Chat);