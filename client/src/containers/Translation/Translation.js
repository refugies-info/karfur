import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Card, CardBody, CardHeader, Col, Jumbotron, Row, Button, Spinner, CardFooter, FormGroup, FormText, Label, Input } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import ReactHtmlParser from 'react-html-parser';
import {stringify} from 'himalaya';
import ms from 'pretty-ms'

import FeedbackModal from '../../components/Modals/FeedbackModal/FeedbackModal'
import Article from '../Article/Article'
import API from '../../utils/API'

import './Translation.scss';
import Icon from 'react-eva-icons/dist/Icon';

let last_target=null;
let letter_pressed=null;

const SliderWithTooltip = createSliderWithTooltip(Slider);

var option = {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
};

const localeFormatter = (v) => {
  return new Intl.NumberFormat('fr-FR', option).format(v)
}

class Translation extends Component {
  state = {
    value: '',
    francais:{
      title: '',
      body: '',
    },
    translated: {
      body:'',
      title:'',
    },
    texte_traduit:'',
    texte_a_traduire:'',
    avancement:0.495,
    isComplete:false,

    itemId: '',
    isExpert:false,
    isStructure:false,
    path:[],
    id:'',
    locale:'',
    translationId:'',
    time: 0,
    langue:{},

    feedbackModal:{
      show:false,
      title:'',
      success:false,
    },
  }
  mountTime=0;

  componentDidMount (){
    this.mountTime = Date.now();
    this.timer = setInterval(() => {
      this.setState({
        time: Date.now() - this.mountTime
      })}, 1000);
    let itemId=null, locale=null;
    try{itemId=this.props.match.params.id}catch(e){console.log(e)}
    try{
      this.setState({langue: this.props.location.state.langue})
      locale=this.props.location.state.langue.i18nCode
    }catch(e){console.log(e)} //Aller chercher ici par api la langue
    let isExpert=this.props.location.pathname.includes('/validation');
    // API.remove_traduction({query:{'_id':'5c9a1f235de3940eca6b7a6b'}, locale:locale})
    if(itemId && locale){
      this._getArticle(itemId,locale)
    }
    if(itemId && isExpert){
      API.get_tradForReview({'_id':itemId}).then(data_res => {
        if(data_res.data.data.constructor === Array && data_res.data.data.length > 0){
          let traduction=data_res.data.data[0];
          this._getArticle(traduction.jsonId || traduction.articleId,'fr',isExpert)
          this.setState({
            translated:{
              title:traduction.translatedText.title,
              body: traduction.jsonId? traduction.translatedText.body : (stringify(traduction.translatedText.body) || '').replace(/ id=\'initial_/g,' id=\'target_')
            },
            itemId: traduction.jsonId || traduction.articleId,
            translationId:itemId,
            locale : traduction.langueCible,
            isExpert:isExpert,
          },()=>{console.log(this.state)})
        }
      },function(error){console.log(error);return;})
    }
    if(!itemId || !locale){
      console.log('informations manquantes au chargement de la vue')
    }else if(!isExpert){
      this.setState({
        itemId: itemId,
        locale: locale
      })
    }
    window.scrollTo(0, 0);
  }

  componentWillUnmount (){
    console.log((new Date).getTime()-this.mountTime)
    clearInterval(this.timer)
  }

  _getArticle = (itemId, locale='fr', isExpert=false) => {
    API.get_article({_id: itemId}).then(data_res => {
      if(data_res.data.data.constructor === Array && data_res.data.data.length > 0){
        let article=data_res.data.data[0];
        console.log(article)
        this.setState({
          francais:{
            title: article.title,
            body: article.isStructure? article.body : stringify(article.body),
          },
          isStructure: article.isStructure,
          path: article.path,
          id: article.articleId,
          jsonBody:article.body,
          ...(article.avancement && article.avancement[locale] && {avancement : article.avancement[locale]})
        },()=>{
          if(!isExpert){
            //Je vérifie d'abord s'il n'y a pas eu une première traduction effectuée par un utilisateur :
            API.get_tradForReview({'articleId':itemId}, '-avancement').then(data => {
              if(data.data.data && data.data.data.length > 0){
                let traductionFaite = data.data.data[0];
                this.setState({ translated: {
                  title: traductionFaite.translatedText.title,
                  body: article.isStructure? traductionFaite.translatedText.body : stringify(traductionFaite.translatedText.body),
                 }
                });
              }else{
                //Je rend chaque noeud unique:
                this.translate(this.initial_text.innerHTML, locale, 'body')
                if(!this.state.isStructure){this.translate(this.initial_title.innerHTML, locale, 'title')}
              }
              this.setState({texte_a_traduire:this.initial_text.innerText})
            })
          }
        })
      }
    })
  }

  handleChange = (ev) => {
    var targetNode = ev.currentTarget;
    let target=targetNode.className.includes('title')?'title':'body';
    let value=target === 'title' ? targetNode.innerText : ev.target.value;
    this.setState({ translated: {
      ...this.state.translated,
      [target]:value || 'Remplissez ici votre traduction'
     }
    });
  };

  handleClickText= (e, initial, target) => {
    try{
      if(last_target){
        document.getElementById(last_target).classList.remove('temporarily_highlight');
      }
      let cible=e.target;
      last_target=cible.id.replace(initial + "_", target + "_");
      if(last_target){
        document.getElementById(last_target).classList.add('temporarily_highlight');
      }
    }catch(e){console.log(e)}
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
          [item]: data.data.replace(/ id=\'initial_/g,' id=\'target_').replace(/ id="initial_/g,' id="target_')
          }
      });
    }).catch(err => {
      console.log('error : ', err);
      this.setState({
        translated:{
          ...this.state.translated,
          [item]: this.state.francais[item]
          }
      });
    })
  }

  _change_target_ids = (html) => {
    [].forEach.call(html.children, (el, i) => { 
      el.setAttribute("id", el.id.replace(/ id=\'initial_/g, "target_"));
      if(el.hasChildNodes()){
        this._change_target_ids(el)
      }
    });
  }

  valider = () => {
    let traduction={
      langueCible: this.state.locale,
      articleId: this.state.itemId,
      initialText: this.state.francais,
      translatedText: this.state.translated,
      timeSpent : this.state.time,
      isStructure: this.state.isStructure,
      path: this.state.path,
      id: this.state.id,
      avancement:this.state.avancement
    }
    if(this.state.isExpert){
      traduction={
        ...traduction,
        translationId:this.state.translationId
      }
    }
    API.add_traduction(traduction).then(() => {
      this.setState({
        feedbackModal:{
          title:'Enregistrement effectué',
          success:true,
          show:true,
        }
      })
      clearInterval(this.timer)
    },(error)=>{
      this.setState({
        feedbackModal:{
          title:'Une erreur est survenue',
          success:false,
          show:true,
        }
      });
      console.log(error);return;})
  }

  onSelect = (e) => {
    //this.activeJumb=e.target.className;
  }

  onSkip=()=>{
    console.log('pas assez de contenu')
  }

  modalClosed=()=>{
    this.setState({feedbackModal:{...this.state.feedbackModal,show:false}})
  }
  
  handleCheckboxChange = event => {
    this.setState({
      isComplete: event.target.checked,
      avancement: event.target.checked ? 1 : 0.495
    }); 
  }

  handleSliderChange = (value) => {
    this.setState({ avancement: value })
    if(value === 1 || this.state.isComplete){
      this.setState({ isComplete: value === 1 });
    }
  }
  
  render(){
    let langue = this.state.langue || {};
    const ConditionalSpinner = (props) => {
      if(props.show){
        return (
          <div className="text-center">
            <Spinner color="success" className="fadeIn fadeOut" />
          </div>
        )
      }else{return false}
    }
    
    let feedbackModal = (
      this.state.feedbackModal.show && 
        <FeedbackModal 
          show={this.state.feedbackModal.show}
          title={this.state.feedbackModal.title}
          success={this.state.feedbackModal.success}
          clicked={this.modalClosed}
          modalClosed={this.modalClosed}
        />
    )

    return(
      <div className="animated fadeIn traduction">
        <div className="animated fadeIn traduction-container">
          {feedbackModal}
          <Row id="translation-container">
            <Col>
              <Card id="card_widgets">
                <CardBody>
                  <Row>
                    <Col>
                      Widget1
                    </Col>
                    <Col>
                      Widget2
                    </Col>
                    <Col>
                      <h3>timer: {ms(this.state.time)}</h3>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
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
          <Row className="translation-row">
            <Col>
              <Card id="card_texte_initial">
                <CardHeader>
                  <i className={'flag-icon flag-icon-fr'} title='fr' id='fr'></i>
                  <strong>Français</strong>
                  <div className="card-header-actions">
                    <a href="/" rel="noreferrer noopener" target="_blank" className="card-header-action">
                      <span className="text-muted">Voir en contexte</span>{' '} 
                      <Icon name="eye-outline" fill="#3D3D3D" />
                    </a>
                  </div>
                </CardHeader>
                <CardBody>
                  {!this.state.isStructure && 
                    <div className="titre text-center">
                      <h1 id="title_texte_initial"
                        ref={initial_title => {this.initial_title = initial_title}}
                        onClick={((e) => this.handleClickText(e, "initial", "target"))}>
                        {ReactHtmlParser(this.state.francais.title)}
                      </h1>
                    </div>
                  }
                  <div id="body_texte_initial"
                    ref={initial_text => {this.initial_text = initial_text}}
                    onClick={((e) => this.handleClickText(e, "initial", "target"))}>
                    {ReactHtmlParser(this.state.francais.body)}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card id="card_texte_final"> 
                {/* style={{height : 'calc(' + this.state.height + 'px - .8rem)'}} */}
                <CardHeader>
                  <i className={'flag-icon flag-icon-' + langue.langueCode} title={langue.langueCode} id={langue.langueCode}></i>
                  <strong>{langue.langueFr}</strong>
                  <div className="card-header-actions">
                    <a href="#article-container" rel="noreferrer noopener" className="card-header-action">
                      <span className="text-muted">Voir le rendu</span>{' '}
                      <Icon name="eye-outline" fill="#3D3D3D" />
                    </a>
                  </div>
                </CardHeader>
                <CardBody>
                  {!this.state.isStructure && 
                    <div className="titre text-center">
                      <ConditionalSpinner show={!this.state.translated.title} />
                      <ContentEditable
                        id="title_texte_final"
                        className="title"
                        html={'<h1>'+this.state.translated.title+'</h1>'} 
                        disabled={this.state.isExpert}       
                        onChange={this.handleChange} 
                        onSelect={this.onSelect}
                      />
                    </div>
                  }
                  <div id="body_texte_final"
                  onClick={((e) => this.handleClickText(e, "target", "initial"))}>
                    <ConditionalSpinner show={!this.state.translated.body} />
                    <ContentEditable
                      key="target-editor-body"
                      className="body"
                      html={this.state.translated.body} // innerHTML of the editable div
                      disabled={this.state.isExpert}       // use true to disable editing
                      onChange={this.handleChange} // handle innerHTML change
                      onSelect={this.onSelect}
                    />
                    {/* <h3>Source</h3>
                    <textarea
                      className="form-control body"
                      value={this.state.translated.body}
                      onChange={this.handleChange}
                      onSelect={this.onSelect}
                    /> */}
                  </div>
                </CardBody>
                <CardFooter>
                  <Label>Estimez le niveau d'avancement de la traduction :</Label>
                  <Row>
                    <Col md="9">
                      <FormGroup check className="checkbox">
                        <Input className="form-check-input" type="checkbox" id="isComplete" checked={this.state.isComplete} onChange={this.handleCheckboxChange}/>
                        <Label check className="form-check-label" htmlFor="isComplete">Cette traduction est complète à 100%</Label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="9">
                      <SliderWithTooltip 
                        min={0}
                        max={1}
                        step={0.05}
                        tipFormatter={localeFormatter}
                        trackStyle={{ background: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)', height: 10 }}
                        handleStyle={{
                          borderColor: 'blue',
                          height: 20,
                          width: 20,
                          marginLeft: -14,
                          marginTop: -5,
                          backgroundColor: 'blue',
                        }}
                        railStyle={{ backgroundColor: 'red', height: 10 }}
                        name="user" 
                        onChange={this.handleSliderChange}
                        value={this.state.avancement}
                      /> 
                      <FormText color="muted">Définissez ici le pourcentage d'avancement estimé de votre traduction</FormText>
                    </Col>
                    <Col>
                      {Math.round((this.state.avancement || 0) * 100, 0)}% d'avancement
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button onClick={this.valider} color="success" size="lg" block>
                        Valider cette traduction
                      </Button>
                    </Col>
                    <Col>
                      <Button onClick={this.onSkip} color="danger" size="lg" block>
                        Passer
                      </Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
        <Row className="article-container" id="article-container">
          {this.state.itemId && !this.state.isExpert && !this.state.isStructure && 
            <Article 
              id={this.state.itemId}
              francais={this.state.francais}
              translated={this.state.translated}
              />
          }
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