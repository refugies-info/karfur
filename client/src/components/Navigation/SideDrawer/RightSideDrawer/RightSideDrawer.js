import React from 'react';
import { Row, TabPane} from 'reactstrap';
import moment from 'moment';
import { connect } from 'react-redux';
import {withRouter, matchPath} from 'react-router-dom';

import { socket } from '../../../../utils/API';
import * as actions from '../../../../Store/actions'
import defaultAvatar from '../../../../assets/avatar_bg_colored.svg';
import API from '../../../../utils/API';

import './RightSideDrawer.scss'

const messages=new Array(6).fill({
  text : 'Ad fugiat amet mollit quis do eiusmod duis cillum velit.',
  from : {username: 'Soufiane'},
  created_at: "2019-03-15T11:50:37.877Z"
});

class RightSideDrawer extends React.Component {
  state = {
    messages: messages.map(x => {return {...x, isMe: Math.random() >= 0.5}}),
    message: '',
    urlId:'',
    locale:'',
    path:''
  };
  
  componentDidMount (){
    let urlId, locale;
    let pathData=matchPath(this.props.location.pathname, {
      path: "/traduction/:id"
    });
    try{
      locale=this.props.location.state.langue.i18nCode
      this.setState({locale: locale});
    }catch(e){console.log(e)};
    if(pathData && pathData.params && pathData.params.id){
      urlId = pathData.params.id;
      this.setState({urlId: urlId, path:this.props.location.pathname});
      
      console.log(urlId,locale)
      API.get_channel({ itemId: urlId, itemName: 'traduction', filter: locale || {"$exists": false}}).then(data_res => {
        console.log(data_res.data.data[0])
        let channel=data_res.data.data[0];
        if(channel){
          this.setState({
            messages: channel.messages
          })
          this.scrollToBottom();
        }
      });
      socket.on('MessageSent', msg => {
        console.log(msg)
        if(msg.type==='sidechat'){
          this.setState({
            messages: msg.messages
          })
        }
      });
    }
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  handleChange = (e) => {
    this.setState({message: e.target.value})
  }

  sendMessage = (message,side) => {
    socket.emit(side + ':sendMessage', message)
  }

  submitChat = () => {
    if(!this.state.message){return;}
    let channel={
      message: this.state.message,
      itemId: this.state.urlId,
      itemName: 'traduction',
      filter: this.state.locale,
      path: this.state.path,
      type:'sidechat'
    }
    API.add_channel(channel).then(data_res => {
      this.sendMessage(data_res.data.data, 'client');
      this.setState({ message:'' })
    });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return(
      <TabPane tabId="2" className="p-3 right-side-drawer">
        <Row className="chat-content">
          <ul>
            {this.state.messages.map((msg, idx) => {
              return(
                <li key={idx}>
                  <div className={"msj" + (msg.isMe ? '' : '-rta') + " macro"}>
                    {msg.isMe && <div className="avatar">
                      <img className="img-circle" src={defaultAvatar} />
                    </div>}
                    <div className={"text text-" + (msg.isMe ? 'l' : 'r')}>
                      <b>{(msg.from || {}).username}</b>
                      <p>{msg.text}</p>
                      <p><small>{moment.utc(msg.created_at).fromNow()}</small></p>
                    </div>
                    {!msg.isMe && <div className="avatar not-me">
                      <img className="img-circle" src={defaultAvatar} />
                    </div> }   
                  </div>
                </li>
              )}
            )}
            <li style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
            </li>    
          </ul>  
        </Row>

        <Row className="chat-footer">
          <div className="macro input-wrapper">                        
            <div className="text-wrapper">
              <textarea 
                rows="1"
                className="form-control type_msg" 
                placeholder="Votre message..."
                value={this.state.message} 
                onChange={this.handleChange} />
            </div> 
          </div>
          <div className="send-wrapper" onClick={this.submitChat}>
            <span className="fa fa-share share-icon"></span>
          </div>
        </Row>
      </TabPane>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages,
    message: state.message,
  }
}

export default connect(mapStateToProps)(withRouter(RightSideDrawer));