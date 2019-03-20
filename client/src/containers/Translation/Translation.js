import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Card, CardBody, CardHeader, Col, Jumbotron, Row, Button, Spinner } from 'reactstrap';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import draftToHtml from 'draftjs-to-html';
import ReactHtmlParser from 'react-html-parser';
import {parse, stringify} from 'himalaya'

import API from '../../utils/API'

import './Translation.scss';

let last_target=null;
let letter_pressed=null;

const locale='en';
class Translation extends Component {
  state = {
    value: '',
    translated: {
      body:null,
      title:null,
    },
    texte_traduit:'',
    texte_a_traduire:'Les 3 petits cochons',

    title: '',
    body: '',
    itemId: '',
  }
  activeJumb='body';

  componentDidMount (){
    let itemId=this.props.match.params.id;
    if(itemId){
      API.get_article({_id: itemId}).then(data_res => {
        console.log(data_res)
        if(data_res.data.data.constructor === Array && data_res.data.data.length > 0){
          let article=data_res.data.data[0];
          this.setState({
            title: article.title,
            jsonBody:article.body,
            body: stringify(article.body),
            itemId: article._id,
          },()=>{
            //Je rend chaque noeud unique:
            this.translate(this.initial_text.innerHTML, locale, 'body')
            this.translate(this.initial_title.innerHTML, locale, 'title')
            this.setState({texte_a_traduire:this.initial_text.innerText})
          })
        }
      },function(error){
        console.log(error);
        return;
      })
    }
  }

  handleChange = (ev, value) => {
    let target=this.activeJumb.includes('title')?'title':'body';
    this.setState({ translated: {
      ...this.state.translated,
      [target]:ev.target.value
     }
    });
  };

  handleClickText= (e, initial, target) => {
    if(last_target){
      document.getElementById(last_target).classList.remove('temporarily_highlight');
    }
    let cible=e.target;
    last_target=cible.id.replace(initial + "_", target + "_");
    document.getElementById(last_target).classList.add('temporarily_highlight');
  }

  handleChangeEnCours= event => {
    // if(letter_pressed && letter_pressed===" " && this.state.texte_a_traduire.slice(0,1)!==" "){
    //   let i=0;
    //   let le_text=this.state.texte_a_traduire
    //   do{
    //     le_text=le_text.substring(1)
    //     i++
    //   } while (le_text.slice(0,1)!==" ");
    //   this.setState(prevState => ({
    //     texte_a_traduire: prevState.texte_a_traduire.substring(i+1)
    //   }));
    // }else if(letter_pressed && ((letter_pressed !==" " && this.state.texte_a_traduire.slice(0,1)!==" ") || 
    //   (letter_pressed ===" " && this.state.texte_a_traduire.slice(0,1)===" "))){
    //   this.setState(prevState => ({
    //     texte_a_traduire: prevState.texte_a_traduire.substring(1)
    //   }));
    // }
    // this.setState({texte_traduit: event.target.value});
    // letter_pressed=null;
  }

  handleKeyPress = (event) => {
    console.log(event.key)
    letter_pressed=event.key;
  }

  translate= (text,target,item) => {
    axios.post('http://localhost:8000/translate/get_translation',{
      q: text,
      target: target
    }).then(data => {
      this.setState({
        translated:{
          ...this.state.translated,
          [item]: data.data
          }
      },() =>{
        this.change_target_ids(document.getElementById(item+'_texte_final'))
      });
    }).catch(err => {
      console.log('error : ', err)
    })
  }

  change_target_ids = (html) => {
    [].forEach.call(html.children, (el, i) => { 
      el.setAttribute("id", el.id.replace("initial_", "target_"));
      if(el.hasChildNodes()){
        this.change_target_ids(el)
      }
    });
  }

  valider = () => {
    let traduction = {
      translated:{...this.state.translated},
      original:{
        title: this.state.title,
        jsonBody: this.state.jsonBody,
        itemId: this.state.itemId
      },
      locale:locale
    }
    // console.log(traduction)
    // let article={
    //   title : this.state.translated.title,
    //   body: this.state.translated.body
    // }
    // API.add_article(article).then(data_res => {
    //   console.log(data_res.data.article._id);
    //   this.setState({
    //     showModal:true,
    //     itemId: data_res.data.article._id
    //   })
    // },function(error){
    //   console.log(error);
    //   return;
    // })
    API.add_traduction(traduction).then(data_res => {
      console.log(data_res.data.data);
      // this.setState({
      //   showModal:true,
      //   itemId: data_res.data.article._id
      // })
    },function(error){
      console.log(error);
      return;
    })
  }

  onSelect = (e) => {
    this.activeJumb=e.target.className;
    console.log(this.activeJumb)
  }

  render(){
    const TranslatedTitle = () => {
      if(this.state.translated.title){
        return (
          <ContentEditable
            id="title_texte_final"
            className="title"
            html={'<h1>'+this.state.translated.title+'</h1>'} 
            disabled={false}       
            onChange={this.handleChange} 
            onSelect={this.onSelect}
          />
        )
      }else{
        return(
          <div className="text-center">
            <Spinner color="success" className="fadeIn fadeOut" />
          </div>
        )
      }
    }
    const TranslatedBody = () => {
      if(this.state.translated.body){
        return (
          <div id="body_texte_final"
          onClick={((e) => this.handleClickText(e, "target", "initial"))}>
            <ContentEditable
              className="body"
              html={this.state.translated.body} // innerHTML of the editable div
              disabled={false}       // use true to disable editing
              onChange={this.handleChange} // handle innerHTML change
              onSelect={this.onSelect}
            />
            <h3>Source</h3>
            <textarea
              className="form-control body"
              value={this.state.translated.body}
              onChange={this.handleChange}
              onSelect={this.onSelect}
            />
          </div>
        )
      }else{
        return (
          <div className="text-center">
            <Spinner color="success" className="fadeIn fadeOut" />
          </div>
        )
      }
    }
    
    return(
      <div className="animated fadeIn traduction">
        <Row>
          <div className="typing-bar">
            <span>
              <div className="type-input">
                <div className="input-wrapper">
                  <div className="test-input-group">
                    <ContentEditable
                      id="test-input" 
                      className="test-input" 
                      html={this.state.texte_traduit}  // innerHTML of the editable div
                      disabled={false}       // use true to disable editing
                      onChange={this.handleChangeEnCours} // handle innerHTML change
                      onKeyPress={this.handleKeyPress}
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <div className="test-prompt">
                    {this.state.texte_a_traduire.split(' ').map((element,key) => {
                      return (
                        <span key={key} className="test-word">
                          {element}
                        </span> 
                      );
                    })}
                  </div>
                </div>
              </div>
            </span>
          </div>
        </Row>
        <Row>
          <Col>
            <Card id="card_texte_initial">
              <CardHeader>
                <strong>Texte initial</strong>
                <div className="card-header-actions">
                  <a href="/" rel="noreferrer noopener" target="_blank" className="card-header-action">
                    <small className="text-muted">Voir en contexte</small>
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <Jumbotron className="titre text-center">
                  <h1 id="title_texte_initial"
                    ref={initial_title => {this.initial_title = initial_title}}
                    onClick={((e) => this.handleClickText(e, "initial", "target"))}>
                    {ReactHtmlParser(this.state.title)}
                  </h1>
                </Jumbotron>
                <Jumbotron>
                  <div id="body_texte_initial"
                    ref={initial_text => {this.initial_text = initial_text}}
                    onClick={((e) => this.handleClickText(e, "initial", "target"))}>
                    {ReactHtmlParser(this.state.body)}
                  </div>
                </Jumbotron>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card 
              id="card_texte_final"> 
              {/* style={{height : 'calc(' + this.state.height + 'px - .8rem)'}} */}
              <CardHeader>
                <strong>Texte final</strong>
                <div className="card-header-actions">
                  <a href="/" rel="noreferrer noopener" target="_blank" className="card-header-action">
                    <small className="text-muted">Voir le rendu</small>
                  </a>
                </div>
              </CardHeader>
              <CardBody>
                <Jumbotron className="titre text-center">
                  <TranslatedTitle />
                </Jumbotron>
                <Jumbotron>
                  <TranslatedBody />
                </Jumbotron>

                <Button onClick={this.valider} color="success" size="lg" block>
                  Valider cette traduction
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default track({
    page: 'Translation',
  })(
    withTranslation()(Translation)
  );