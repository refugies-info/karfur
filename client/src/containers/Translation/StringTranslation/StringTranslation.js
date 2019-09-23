import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Card, CardBody, CardHeader, Col, Tooltip, Row, Button, Spinner, FormGroup, Input } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import ReactHtmlParser from 'react-html-parser';
import {stringify} from 'himalaya';
import ms from 'pretty-ms';
import Icon from 'react-eva-icons/dist/Icon';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';

import FeedbackModal from '../../../components/Modals/FeedbackModal/FeedbackModal';
import Article from '../../Article/Article';
import API from '../../../utils/API';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';

import './StringTranslation.scss';

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
    feedbackModal:{
      show:false,
      title:'',
      success:false,
    },
    tooltipOpen: false,
  }

  componentDidMount (){
    if(this.props.itemId){
      this._initializeComponent(this.props);
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.itemId !== this.props.itemId){
      this._initializeComponent(nextProps);
      window.scrollTo(0, 0);
    }
  }

  _initializeComponent = async props => {
    const { itemId, locale, isExpert } = props;
    console.log(itemId, locale, isExpert)
    if(itemId && locale && !isExpert){
      this._getArticle(itemId,locale)
    }else if(itemId && isExpert){
      API.get_tradForReview({'_id':itemId}).then(data_res => {
        if(data_res.data.data.constructor === Array && data_res.data.data.length > 0){
          let traduction=data_res.data.data[0];
          this._getArticle(traduction.jsonId || traduction.articleId,'fr',isExpert)
          this.props.fwdSetState({
            translated:{
              title:traduction.translatedText.title,
              body: traduction.jsonId? traduction.translatedText.body : (stringify(traduction.translatedText.body) || '').replace(/ id='initial_/g,' id=\'target_') //Ici il y avait id=\'initial_/ avant
            },
            itemId: traduction.jsonId || traduction.articleId,
            translationId:itemId,
            locale : traduction.langueCible,
            isExpert:isExpert,
          },()=>{console.log(this.state)})
        }
      })
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

  _getArticle = (itemId) => {
    API.get_article({_id: itemId}).then(data_res => {
      if(data_res.data.data.constructor === Array && data_res.data.data.length > 0){
        let article=data_res.data.data[0];
        this.setArticle(article);
      }
    })
  }

  setArticle = article => {
    const { itemId, locale, isExpert } = this.props;
    this.props.fwdSetState({
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
        API.get_tradForReview({'jsonId': itemId, langueCible:  locale}, '-avancement').then(data => {
          if(data.data.data && data.data.data.length > 0){
            let traductionFaite = data.data.data[0];
            this.props.fwdSetState({ translated: {
              title: traductionFaite.translatedText.title,
              body: article.isStructure? traductionFaite.translatedText.body : stringify(traductionFaite.translatedText.body),
              }
            });
          }else{
            //Je rend chaque noeud unique:
            this.props.translate(this.initial_text.innerHTML, locale, 'body')
            // if(!this.props.isStructure){this.props.translate(this.initial_title.innerHTML, locale, 'title')}
          }
          this.props.fwdSetState({texte_a_traduire:this.initial_text.innerText})
        })
      }
    })
  }

  toggleTooltip = () => {
    this.props.tracking.trackEvent({ action: 'toggleTooltip', label: 'tooltipOpen', value : !this.state.tooltipOpen });
    this.setState({ tooltipOpen: !this.state.tooltipOpen});
  }

  modalClosed=()=> this.setState({feedbackModal:{...this.state.feedbackModal,show:false}})
  
  render(){
    const langue = this.state.langue || {};
    const { texte_a_traduire, texte_traduit, francais, isStructure, score, translated, isExpert, time, nbMotsRestants, avancement, itemId, isComplete } = this.props;
    
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
                      html={texte_traduit || ""}  // innerHTML of the editable div
                      placeholder="Commencez votre traduction ici"
                      disabled={false}       // use true to disable editing
                      onChange={this.props.handleChangeEnCours} // handle innerHTML change
                      onKeyPress={this.props.handleKeyPress}
                    />
                  </div>
                </div>
                <div className="input-wrapper">
                  <div className="test-prompt">
                    {(texte_a_traduire || '').split(' ').map((element,key) => {
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
                  {/* <div className="card-header-actions pointer" onClick={this.upcoming}>
                    <span className="text-muted">Voir en contexte</span>{' '} 
                    <Icon name="eye-outline" fill="#3D3D3D" />
                  </div> */}
                </CardHeader>
                <CardBody>
                  {!isStructure && 
                    <div className="titre text-center">
                      <h1 id="title_texte_initial"
                        ref={this.props.innerRef}
                        // ref={initial_title => { this.props.setRef(initial_title, "initial_title") }}
                        onClick={((e) => this.props.handleClickText(e, "initial", "target"))}>
                        {ReactHtmlParser(francais.title)}
                      </h1>
                    </div>
                  }
                  <div id="body_texte_initial"
                    ref={initial_text => {this.initial_text = initial_text}}
                    onClick={((e) => this.props.handleClickText(e, "initial", "target"))}>
                    {ReactHtmlParser(francais.body)}
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
                  <span className="ml-2">
                    {score !== -1 && 
                      ('Score : ' + (score * 100).toFixed(2) + ' %')}
                  </span>
                  {/* <div className="card-header-actions pointer" onClick={this.upcoming}>
                    <span className="text-muted">Voir le rendu</span>{' '}
                    <Icon name="eye-outline" fill="#3D3D3D" />
                  </div> */}
                </CardHeader>
                <CardBody>
                  {!isStructure && 
                    <div className="titre text-center">
                      <ConditionalSpinner show={!translated.title} />
                      <ContentEditable
                        id="title_texte_final"
                        className="title"
                        html={'<h1>'+translated.title+'</h1>'} 
                        disabled={isExpert}       
                        onChange={this.props.handleChange} 
                      />
                    </div>
                  }
                  <div id="body_texte_final"
                  onClick={((e) => this.props.handleClickText(e, "target", "initial"))}>
                    <ConditionalSpinner show={!translated.body} />
                    <ContentEditable
                      key="target-editor-body"
                      className="body"
                      placeholder="Renseignez votre traduction ici"
                      html={translated.body} // innerHTML of the editable div
                      disabled={isExpert}       // use true to disable editing
                      onChange={this.props.handleChange} // handle innerHTML change
                      onSelect={this.onSelect}
                    />
                    {/* <h3>Source</h3>
                    <textarea
                      className="form-control body"
                      value={translated.body}
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
              <span className="timer">{ms(time)} passées</span>
              <span className="words">{nbMotsRestants} mot{nbMotsRestants > 1 && "s"} restant{nbMotsRestants > 1 && "s"}</span>
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
                value={avancement}
              /> 
              <span>{Math.round((avancement || 0) * 100, 0)}%</span>

              {/* <Button className={"radio-btn" + (isComplete ? " active":"")} onClick={this.handleCheckboxClicked}>
                <FormGroup check className="checkbox">
                  <Input className="form-check-input" type="checkbox" id="isComplete" checked={isComplete} onChange={this.handleCheckboxChange}/>
                  <span className="form-check-label">100% traduit</span>
                </FormGroup>
              </Button> */}
              <Button onClick={this.props.onSkip} color="danger">
                <Icon name="skip-forward-outline" />
                Passer
              </Button>
              <Button onClick={()=> this.props.valider()} color="success">
                <Icon name="checkmark-circle-2-outline" />
                Valider
              </Button>
            </Col>
          </Row>
        </div>
        <Row className="article-container" id="article-container">
          {false && itemId && !isExpert && !isStructure && 
            <Article 
              id={itemId}
              francais={francais}
              translated={translated}
              />
          }
        </Row>
      </div>
    );
  }
}

const ConditionalSpinner = (props) => {
  if(props.show){
    return (
      <div className="text-center">
        <Spinner color="success" className="fadeIn fadeOut" />
      </div>
    )
  }else{return false}
}

export default track({
    page: 'Translation',
  })(
    withTranslation()(
      React.forwardRef((props, ref) => <Translation innerRef={ref} {...props} />)
    )
  );