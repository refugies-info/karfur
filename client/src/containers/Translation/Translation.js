import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Card, CardBody, CardHeader, Col, Tooltip, Row, Button, Spinner, FormGroup, FormText, Label, Input } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import ReactHtmlParser from 'react-html-parser';
import {stringify} from 'himalaya';
import ms from 'pretty-ms';
import Swal from 'sweetalert2';
import querySearch from "stringquery";
import h2p from 'html2plaintext';

import FeedbackModal from '../../components/Modals/FeedbackModal/FeedbackModal'
import Article from '../Article/Article'
import API from '../../utils/API'

import './Translation.scss';
import Icon from 'react-eva-icons/dist/Icon';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';

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
    tooltipOpen:false,
    nbMotsRestants:0,

    feedbackModal:{
      show:false,
      title:'',
      success:false,
    },
  }
  mountTime=0;

  componentDidMount (){
    this._initializeComponent(this.props)
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.match.params.id !== this.props.match.params.id){
      this._initializeComponent(nextProps);
    }
  }

  componentWillUnmount (){
    clearInterval(this.timer)
  }

  componentWillUpdate(nextProps, nextState){
    if(nextState.translated.body !== this.state.translated.body){
      this.setState({nbMotsRestants : Math.max(0, h2p(nextState.francais.body).split(/\s+/).length - h2p(nextState.translated.body).split(/\s+/).length) })
    }
  }

  _initializeComponent = async props => {
    clearInterval(this.timer)
    this.mountTime = Date.now();
    this.timer = setInterval(() => {
      this.setState({
        time: Date.now() - this.mountTime
      })}, 1000);
    let itemId=null, locale=null;
    try{itemId=props.match.params.id}catch(e){console.log(e)}
    try{
      this.setState({langue: props.location.state.langue})
      locale=props.location.state.langue.i18nCode
      console.log(locale)
    }catch(e){ try{
      const params = querySearch(props.location.search);
      let langue = await API.get_langues({_id:params.id}).then(data => { return data.data.data[0]; })
      this.setState({langue: langue});
      locale=langue.i18nCode;
    } catch(err){console.log(err)} }
    let isExpert=props.location.pathname.includes('/validation');
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
  }

  _getArticle = (itemId, locale='fr', isExpert=false) => {
    API.get_article({_id: itemId}).then(data_res => {
      if(data_res.data.data.constructor === Array && data_res.data.data.length > 0){
        let article=data_res.data.data[0];
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
            API.get_tradForReview({'articleId':itemId, langueCible: locale}, '-avancement').then(data => {
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
      [target]:value
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
      let i=0, le_text=this.state.texte_a_traduire;
      do{
        le_text=le_text.substring(1)
        i++
      } while (le_text.slice(0,1) !==" " && le_text !=="" && le_text);
      this.setState(prevState => ({
        texte_a_traduire: prevState.texte_a_traduire.substring(i+1)
      }));
    }else if(letter_pressed && ((letter_pressed !==" " && this.state.texte_a_traduire.slice(0,1)!==" ") || 
      (letter_pressed ===" " && this.state.texte_a_traduire.slice(0,1)===" "))){
      this.setState(prevState => ({ texte_a_traduire: prevState.texte_a_traduire.substring(1) }));
    }
    this.setState({
      texte_traduit: h2p(event.target.value),
      translated:{...this.state.trandslated,
        body: h2p(event.target.value) + (this.state.translated.body.length > event.target.value.length ? this.state.translated.body.substring(event.target.value.length) : '')
      }
    });
    letter_pressed=null;
  }

  handleKeyPress = (event) => {
    letter_pressed=event.key;
  }

  translate= (text,target,item) => {
    API.get_translation({ q: text, target: target }).then(data => {
      this.setState({
        translated:{
          ...this.state.translated,
          [item]: data.data.replace(/ id=\'initial_/g,' id=\'target_').replace(/ id="initial_/g,' id="target_')
          }
      });
    }).catch((err)=>{ console.log('error : ', err);
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

  toggleTooltip = () => {
    this.props.tracking.trackEvent({ action: 'toggleTooltip', label: 'tooltipOpen', value : !this.state.tooltipOpen });
    this.setState({ tooltipOpen: !this.state.tooltipOpen});
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
    API.add_traduction(traduction).then((data) => {
      Swal.fire( 'Yay...', 'La traduction a bien été enregistrée', 'success').then(()=>{
        this.onSkip();
      })
    })
  }

  onSelect = (e) => {
    //this.activeJumb=e.target.className;
  }

  onSkip=()=>{
    let i18nCode=(this.state.langue || {}).i18nCode;
    let nom='avancement.'+i18nCode;
    let query ={$or : [{[nom]: {'$lt':1} }, {[nom]: null}]};
    API.getArticle({query: query, locale:i18nCode, random:true}).then(data_res => {
      let articles=data_res.data.data;
      if(articles.length===0){Swal.fire( 'Oh non', 'Aucun résultat n\'a été retourné, veuillez rééssayer', 'error')}
      else{ clearInterval(this.timer);
        this.props.history.push({ 
          pathname: '/traduction/'+ articles[0]._id, 
          search: '?id=' + this.state.langue._id,
          state: { langue: this.state.langue} })
      }    
    })
  }

  modalClosed=()=> this.setState({feedbackModal:{...this.state.feedbackModal,show:false}})
  
  handleCheckboxChange = event => {
    event.stopPropagation();
    this.setState({
      isComplete: event.target.checked,
      avancement: event.target.checked ? 1 : 0.495
    }); 
  }

  handleCheckboxClicked = () => {
    this.setState(prevState => ({
      isComplete: !prevState.isComplete,
      avancement: !prevState.isComplete ? 1 : 0.495
    })); 
  }
  
  handleSliderChange = (value) => {
    this.setState({ avancement: value })
    if(value === 1 || this.state.isComplete){
      this.setState({ isComplete: value === 1 });
    }
  }
  
  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')

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
          <Row className="typing-row">
            <div className="typing-bar">
              <div className="type-input">
                <div className="input-wrapper">
                  <div className="test-input-group">
                    <ContentEditable
                      id="test-input" 
                      className="test-input" 
                      html={this.state.texte_traduit}  // innerHTML of the editable div
                      placeholder="Commencez votre traduction ici"
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
            </div>
          </Row>
          <Row className="translation-row">
            <Col>
              <Card id="card_texte_initial">
                <CardHeader>
                  <i className={'flag-icon flag-icon-fr'} title='fr' id='fr'></i>
                  <strong>Français</strong>
                  <div className="card-header-actions pointer" onClick={this.upcoming}>
                    {/* <a href="/" rel="noreferrer noopener" target="_blank" className="card-header-action"> */}
                      <span className="text-muted">Voir en contexte</span>{' '} 
                      <Icon name="eye-outline" fill="#3D3D3D" />
                    {/* </a> */}
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
                  <div className="card-header-actions pointer" onClick={this.upcoming}>
                    {/* <a href="#article-container" rel="noreferrer noopener" className="card-header-action"> */}
                      <span className="text-muted">Voir le rendu</span>{' '}
                      <Icon name="eye-outline" fill="#3D3D3D" />
                    {/* </a> */}
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
                      placeholder="Renseignez votre traduction ici"
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
              </Card>
            </Col>
          </Row>
          <Row className="trad-footer">
            <Col lg="auto" className="left-col">
              <span className="timer">{ms(this.state.time)} passées</span>
              <span className="words">{this.state.nbMotsRestants} mot{this.state.nbMotsRestants > 1 && "s"} restant{this.state.nbMotsRestants > 1 && "s"}</span>
            </Col>
            <Col className="right-col">
              <span>Progression</span>
              <EVAIcon name="alert-circle" fill="#3D3D3D" id="tooltip-icon" />
              <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="tooltip-icon" toggle={this.toggleTooltip}>
                Définissez ici le pourcentage d'avancement estimé de votre traduction
              </Tooltip>
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
              <span>{Math.round((this.state.avancement || 0) * 100, 0)}%</span>

              <Button className={"radio-btn" + (this.state.isComplete ? " active":"")} onClick={this.handleCheckboxClicked}>
                <FormGroup check className="checkbox">
                  <Input className="form-check-input" type="checkbox" id="isComplete" checked={this.state.isComplete} onChange={this.handleCheckboxChange}/>
                  <span className="form-check-label">100% traduit</span>
                </FormGroup>
              </Button>
              <Button onClick={this.onSkip} color="danger">
                <Icon name="skip-forward-outline" />
                Passer
              </Button>
              <Button onClick={this.valider} color="success">
                <Icon name="checkmark-circle-2-outline" />
                Valider
              </Button>
            </Col>
          </Row>
        </div>
        <Row className="article-container" id="article-container">
          {false && this.state.itemId && !this.state.isExpert && !this.state.isStructure && 
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