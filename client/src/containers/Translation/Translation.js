import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Card, CardBody, CardHeader, Col, Jumbotron, Row, Button } from 'reactstrap';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';

import {InitialText} from './data'

import './Translation.css';

let elementId = 8007888; //Math.floor(Math.random() * Math.floor(9999999)); //On génère un nombre aléatoire suffisamment élevé
let last_target=null;
let letter_pressed=null;
class Translation extends Component {
  state = {
    value: '',
    translated: null,
    texte_traduit:'',
    texte_a_traduire:'Les 3 petits cochons'
  }

  componentDidMount () {
    //Je rend chaque noeud unique:
    this.make_nodes_unique(document.getElementById('body_texte_initial'))
    this.translate(this.initial_text.innerHTML, 'en')
    this.setState({texte_a_traduire:this.initial_text.innerText})
  }

  handleChange = (ev, value) => {
    this.setState({ translated: ev.target.value });
  };

  handleClickText= (e, initial, target) => {
    if(last_target){
      document.getElementById(last_target).style.fontWeight = 'normal';
    }
    let cible=e.target;
    last_target=cible.id.replace(initial + "_", target + "_");
    document.getElementById(last_target).style.fontWeight = 'bold';
  }

  handleChangeEnCours= event => {
    if(letter_pressed && letter_pressed===" " && this.state.texte_a_traduire.slice(0,1)!==" "){
      let i=0;
      let le_text=this.state.texte_a_traduire
      do{
        le_text=le_text.substring(1)
        i++
      } while (le_text.slice(0,1)!==" ");
      this.setState(prevState => ({
        texte_a_traduire: prevState.texte_a_traduire.substring(i+1)
      }));
    }else if(letter_pressed && ((letter_pressed !==" " && this.state.texte_a_traduire.slice(0,1)!==" ") || 
      (letter_pressed ===" " && this.state.texte_a_traduire.slice(0,1)===" "))){
      this.setState(prevState => ({
        texte_a_traduire: prevState.texte_a_traduire.substring(1)
      }));
    }
    this.setState({texte_traduit: event.target.value});
    letter_pressed=null;
  }

  handleKeyPress = (event) => {
    console.log(event.key)
    letter_pressed=event.key;
  }

  translate= (text,target) => {
    axios.post('http://localhost:8000/translate/get_translation',{
      q: text,
      target: target
    }).then(data => {
      this.setState({translated: data.data},() =>{
        this.change_target_ids(document.getElementById('body_texte_final'))
      })
    }).catch(err => {
      console.log('error : ', err)
    })
  }

  make_nodes_unique = (html) => {
    [].forEach.call(html.children, (el, i) => { 
      el.setAttribute("id", (el.id && el.id + " ") + "initial_" + elementId.toString());
      elementId++;
      if(el.hasChildNodes()){
        this.make_nodes_unique(el)
      }
    });
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
    console.log(this.state.translated)
  }

  render(){
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
                <Jumbotron>
                  <div id="body_texte_initial"
                    ref={initial_text => {this.initial_text = initial_text}}
                    onClick={((e) => this.handleClickText(e, "initial", "target"))}>
                    <InitialText/>
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
                <Jumbotron>
                  {this.state.translated && 
                    <div id="body_texte_final"
                    onClick={((e) => this.handleClickText(e, "target", "initial"))}>
                      <ContentEditable
                        html={this.state.translated} // innerHTML of the editable div
                        disabled={false}       // use true to disable editing
                        onChange={this.handleChange} // handle innerHTML change
                      />
                      <h3>source</h3>
                      <textarea
                        className="form-control"
                        value={this.state.translated}
                        onChange={this.handleChange}
                      />
                    </div>
                  }
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