import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Card, Button, ListGroup, ListGroupItem, Collapse, Tooltip } from 'reactstrap';
import { connect } from 'react-redux';
import Scrollspy from 'react-scrollspy';
import ContentEditable from 'react-contenteditable';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { savePDF } from '@progress/kendo-react-pdf';
import Icon from 'react-eva-icons';
import ReactToPrint from 'react-to-print';

import Sponsors from '../../components/Frontend/Dispositif/Sponsors/Sponsors';
import Modal from '../../components/Modals/Modal'
import ContenuDispositif from '../../components/Frontend/Dispositif/ContenuDispositif/ContenuDispositif'
import API from '../../utils/API';
import ReagirModal from '../../components/Modals/ReagirModal/ReagirModal';
import SVGIcon from '../../components/UI/SVGIcon/SVGIcon';
import AudioBtn from '../UI/AudioBtn/AudioBtn';
import Commentaires from '../../components/Frontend/Dispositif/Commentaires/Commentaires';

import {juliette, hugo, bookmark, femmeCurly, manLab, concordia, ligueEnseignement, minInt, serviceCivique, solidariteJeunesse} from '../../assets/figma/index';

import {contenu, lorems} from './data'

import './Dispositif.scss';

const menu=[
  {title:'C\'est quoi ?'},
  {title:'C\'est pour qui ?', type:'cards', children:[
    {type:'card',title:'Statut demandé',titleIcon:'papiers',contentTitle: 'Réfugié', contentBody: 'ou bénéficiaire de la protection subsidiaire', footer:'Pièces demandées',footerIcon:'file-text-outline'},
    {type:'card',title:'Tranche d\'âge',titleIcon:'calendar',contentTitle: '18 à 25 ans', contentBody: '30 ans pour les personnes en situations de handicap', footer:'Pourquoi ?',footerIcon:'question-mark-circle-outline'},
    {type:'card',title:'Durée',titleIcon:'horloge',contentTitle: '6 à 12 mois', contentBody: 'en fonction de ce qui est convenu sur votre contrat', footer:'En savoir plus',footerIcon:'plus-circle-outline'},
    {type:'card',title:'Niveau de français',titleIcon:'frBubble',contentTitle: 'Débutant (A1)', contentBody: 'Je peux poser et répondre à des questions simples', footer:'Pièces demandées',footerIcon:'file-text-outline'},
    {type:'card',title:'Important !',titleIcon:'warning',contentTitle: 'Compte bancaire', contentBody: 'nécessaire pour recevoir l’indemnité', footer:'Pourquoi ?',footerIcon:'question-mark-circle-outline'},
  ]},
  {title:'À quoi ça me sert ?', children:[{title:'Travailler dans une association ou une organisation publique',type:'accordion',content: lorems.sousParagraphe}]},
  {title:'Pourquoi ça m\'intéresse', children:[{title:'Vous êtes plutôt...',content: lorems.sousParagraphe}, {title:'Vous n\'êtes pas du tout',content: lorems.sousParagraphe}]},
  {title:'Comment y accéder', children:[{title:'Procédures',content: lorems.sousParagraphe}, {title:'Interlocuteurs experts',content: lorems.sousParagraphe}, {title:'Interlocuteurs concernés',content: lorems.sousParagraphe}]},
  {title:'Dispositifs connexes', children:[{title:'Dispositifs similaires',content: lorems.sousParagraphe}, {title:'Dispositifs complémentaires',content: lorems.sousParagraphe}]},
  {title:'Retours d\'expérience', children:[{title:'Questions réponses',content: lorems.sousParagraphe}, {title:'Avis',content: lorems.sousParagraphe}]},
]

const spyableMenu = menu.reduce((r, e, i) => {
  r.push('item-'+i);
  (e.children || []).map((_,subkey)=> {return r.push('item-'+i+'-sub-'+subkey)})
  return r
}, []);

const tags=[{name: "papiers", text: "Réfugiés"},{name: "calendar", text: "18 à 25 ans"}, {name: "horloge", text: "6 à 12 mois"},{name: "frBubble", text: "Débutant (A1)"}]

const sponsorsData = [
  {src:minInt,alt:"ministère de l'intérieur"},
  {src:serviceCivique,alt:"service civique"},
  {src:ligueEnseignement,alt:"ligue de l'enseignement"},
  {src:concordia,alt:"concordia"},
  {src:solidariteJeunesse,alt:"solidarite jeunesse"},
]

class Dispositif extends Component {
  state={
    menu: menu.map((x) => {return {...x, type:x.type || 'paragraphe', content: (x.type ? null : lorems.paragraphe), editorState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(lorems.paragraphe).contentBlocks))}}),
    content:contenu,
    sponsors:sponsorsData,
    hovers: menu.map((x) => {return {isHover:false, ...( x.children && {children: new Array(x.children.length).fill({isHover:false})})}}),
    showModals:{
      reaction:false,
      fiabilite:false
    },
    accordion: new Array(1).fill(false),
    dropdown: new Array(5).fill(false),
    disableEdit:true,
    tooltipOpen:false,
    uiArray:new Array(menu.length).fill({isHover:false, accordion:false, cardDropdown: false, addDropdown:false}),
    sponsorLoading:false
  }
  _initialState=this.state;
  newRef=React.createRef();

  componentDidMount (){
    let itemId=this.props.match && this.props.match.params && this.props.match.params.id;
    if(itemId){
      API.get_dispositif({_id: itemId}).then(data_res => {
        let dispositif={...data_res.data.data[0]};
        console.log(dispositif);
        this.setState({
          menu: dispositif.contenu, 
          content: {titreInformatif:dispositif.titreInformatif, titreMarque: dispositif.titreMarque, abstract: dispositif.abstract}, 
          sponsors:dispositif.sponsors,
          uiArray: dispositif.contenu.map((x) => {return {isHover:false, accordion:false, cardDropdown: false, addDropdown:false, ...( x.children && {children: new Array(x.children.length).fill({isHover:false, accordion:false, cardDropdown: false, addDropdown:false})})}}),
          disableEdit: true
        })
      },function(error){ console.log(error); return; })
    }else{
      this.setState({
        disableEdit:false,
        uiArray: menu.map((x) => {return {isHover:false, accordion:false, cardDropdown: false, addDropdown:false, ...( x.children && {children: new Array(x.children.length).fill({isHover:false, accordion:false, cardDropdown: false, addDropdown:false})})}}),
      })
    }
  }

  toggleAccordion = (tab,e={}) => {
    if(!e.target || e.target.id !== 'title'){
      const prevState = this.state.accordion;
      const state = prevState.map((x, index) => tab === index ? !x : false);
      this.setState({
        accordion: state,
      });
    }
  }

  onMenuNavigate = (tab) => {
    const prevState = this.state.menu;
    const state = prevState.map((x, index) => tab === index ? {...x, accordion : !x.accordion} : {...x, accordion: false});
    this.setState({
      menu: state,
    });
  }

  _handleScrollSpy = el => {
    if(el && el.id && el.id.includes('item-')){
      let num=parseInt(el.id.replace( /^\D+/g, ''),10);
      if(this.state.menu.length>num && this.state.menu[num].children && this.state.menu[num].children.length>0){
        this.onMenuNavigate(num)
      }
    }
  }

  _handleChange = (ev) => {
    this.setState({ content: {
      ...this.state.content,
      [ev.currentTarget.id]:ev.target.value
     }
    });
  };

  handleMenuChange = (ev) => {
    let node=ev.currentTarget;
    let state = JSON.parse(JSON.stringify(this.state.menu));
    state[node.id]={
      ...state[node.id],
      ...(!node.dataset.subkey && {content : ev.target.value}), 
      ...(node.dataset.subkey && state[node.id].children && state[node.id].children.length > node.dataset.subkey && {children : state[node.id].children.map((y,subidx) => { return {
            ...y,
            ...(subidx==node.dataset.subkey && {[node.dataset.target || 'content'] : ev.target.value})
          }
        })
      })
    }
    this.setState({ menu: state });

    // let state=[...this.state.menu];
    // console.log(ev.currentTarget.dataset.target, ev.currentTarget.dataset.subkey, ev.currentTarget)
    // if(ev.currentTarget && state.length > ev.currentTarget.id){
    //   if(ev.currentTarget.getAttribute('subkey') !== null && ev.currentTarget.getAttribute('subkey') !== undefined && state[ev.currentTarget.id].children.length > ev.currentTarget.getAttribute('subkey')){
    //     state[ev.currentTarget.id].children[ev.currentTarget.getAttribute('subkey')].content = ev.target.value;
    //   }else{
    //     state[ev.currentTarget.id].content = ev.target.value;
    //   }
    //   this.setState({
    //     menu: state,
    //   });
    // }
  };

  handleContentClick = (key, editable, subkey=null) => {
    let state=[...this.state.menu];
    if(state.length > key){
      let right_node=state[key];
      if(subkey !==null && state[key].children.length > subkey){right_node= state[key].children[subkey];}
      right_node.editable = editable;
      if(editable){
        right_node.editorState=EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(right_node.content).contentBlocks));
      }else{
        right_node.content=draftToHtml(convertToRaw(right_node.editorState.getCurrentContent()));
      }
      this.setState({
        menu: state,
      });
    }
  };

  onEditorStateChange = (editorState, key, subkey=null) => {
    let state=[...this.state.menu];
    if(state.length > key){
      if(subkey!==null && state[key].children.length > subkey){
        state[key].children[subkey].editorState =  editorState;
      }else{
        state[key].editorState =  editorState;
      }
      this.setState({
        menu: state,
      });
    }
  };

  hoverOn=(key, subkey=null)=>{
    let uiArray = JSON.parse(JSON.stringify(this.state.uiArray));
    uiArray = uiArray.map((x,idx) => {return {
      ...x,
      ...((subkey==null && idx==key && {isHover : true}) || {isHover : false}), 
      ...(x.children && {children : x.children.map((y,subidx) => { return {
            ...y,
            ...((subidx==subkey && idx==key && {isHover : true}) || {isHover : false})
          }
        })
      })
    }});
    this.setState({ uiArray: uiArray });
  }

  addItem=(key, type='paragraphe', subkey=null)=>{
    const prevState = [...this.state.menu];
    if(prevState[key].children && prevState[key].children.length > 0){
      let newChild={...prevState[key].children[prevState[key].children.length - 1]};
      if(type==='card' && newChild.type!=='card'){
        prevState[key].type='cards';
        newChild={type:'card',title:'Important !',titleIcon:'warning',contentTitle: 'Compte bancaire', contentBody:'nécessaire pour recevoir l’indemnité', footer:'Pourquoi ?',footerIcon:'question-mark-circle-outline'};
      }
      newChild.type=type;
      if(subkey == null || subkey==undefined){
        prevState[key].children.push(newChild)
      }else{
        prevState[key].children.splice(subkey+1,0,newChild)
      }
    }else{
      prevState[key].children=[{title:'Nouveau sous-paragraphe',[type]:true,content: lorems.sousParagraphe}];
    }
    this.setState({ menu: prevState });
  }

  removeItem=(key, subkey=null)=>{
    const prevState = [...this.state.menu];
    if(prevState[key].children && prevState[key].children.length > 0){
      if(subkey == null || subkey == undefined){
        prevState[key].children.pop()
      }else if(prevState[key].children.length > subkey){
        prevState[key].children.splice(subkey,1)
      }
    }
    this.setState({ menu: prevState });
  }

  deleteCard=(key,subkey)=>{
    const prevState = [...this.state.menu];
    prevState[key].children = prevState[key].children.filter((x, index) => index !== subkey);
    this.setState({
      menu: prevState,
    });
  }

  toggleModal = (show, name) => {
    this.setState({showModals:{...this.state.showModals,[name]:show}})
  }


  toggleTooltip = () => {
    this.setState({ tooltipOpen: !this.state.tooltipOpen});
  }

  changeCardTitle = (key, subkey, title='', titleIcon='') => {
    const prevState = [...this.state.menu];
    prevState[key].children[subkey].title=title;
    prevState[key].children[subkey].titleIcon=titleIcon;
    this.setState({ menu: prevState });
  }

  handleFileInputChange = event => {
    this.setState({sponsorLoading:true})
    const formData = new FormData()
    formData.append(0, event.target.files[0])

    API.set_image(formData).then(data_res => {
      let imgData=data_res.data.data;
      this.setState({sponsors: [...this.state.sponsors, {src: imgData.secure_url, alt:"sponsor " + imgData.public_id}], sponsorLoading:false})
    },(error) => {console.log(error);return;})
  }

  deleteSponsor = key => {
    this.setState({
      sponsors: [...this.state.sponsors].filter( (_,i) => i !== key),
    });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  valider_dispositif = () => {
    let dispositif = {
      ...this.state.content,
      contenu : [...this.state.menu.map(x=> {return {title: x.title, content : x.content, ...( x.children && {children : x.children.map(y => {return {title: y.title, content : y.content}})})}})],
      sponsors:this.state.sponsors
    }
    API.add_dispositif(dispositif).then((data) => {
      console.log(data.data)
    },(error)=>{
      console.log(error);return;})
  }

  createPdf = () => {
    this.setState({accordion: this.state.accordion.map(x => true)}, ()=>{
      console.log(this.newRef)
      setTimeout(()=>{
        savePDF(this.newRef.current, { 
          fileName: 'dispositif.pdf',
          scale:.5
        })
        //this.setState({accordion: this.state.accordion.map(_ => false)})
      }, 3000);
    })
  }

  render(){
    const {t} = this.props;

    return(
      <div className="animated fadeIn dispositif" ref={this.newRef}>
        <section className="banniere-dispo">
          <Row className="header-row">
            <Col className="top-left" onClick={this.goBack}>
              <i className="cui-arrow-left icons"></i> 
              <span>Retour à la recherche</span>
            </Col>
            <Col className="top-right">
              <AudioBtn />
              <div className={"bookmark-icon-wrapper" + (this.props.ttsActive ? " pressed" : "")} onClick={this.toggleAudio}>
                <img className="bookmark-icon" src={bookmark} alt="bouton bookmark"/>
              </div>
            </Col>
          </Row>
          <img className="femme-icon" src={femmeCurly} alt="femme"/>
          <Col lg="12" md="12" sm="12" className="post-title-block">
            <div className="bloc-titre">
              <h1>
                <ContentEditable
                  id='titreInformatif'
                  html={this.state.content.titreInformatif}  // innerHTML of the editable div
                  disabled={this.state.disableEdit}       // use true to disable editing
                  onChange={this._handleChange} // handle innerHTML change
                />
              </h1>
              <h2 className="bloc-subtitle">
                <span>avec le programme&nbsp;</span>
                <ContentEditable
                  id='titreMarque'
                  html={this.state.content.titreMarque}  // innerHTML of the editable div
                  disabled={this.state.disableEdit}
                  onChange={this._handleChange} // handle innerHTML change
                />
              </h2>
            </div>
          </Col>
          <img className="homme-icon" src={manLab} alt="homme"/>
          <Row className="header-footer">
            <Col className="align-right">
              Dernière mise à jour : <span className="date-maj">3 avril 2019</span>
            </Col>
            <Col>
              Fiabilité de l'information : <span className="fiabilite">Faible</span>
              <span className="question-bloc" id="question-bloc" onClick={()=>this.toggleModal(true, 'fiabilite')}>
                ?
              </span>
              <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="question-bloc" toggle={this.toggleTooltip} onClick={()=>this.toggleModal(true, 'fiabilite')}>
                Une information avec une <b>faible</b> fiabilité n'a pas été vérifiée auparavant.
                Cliquez sur le '?' pour en savoir plus
              </Tooltip>
            </Col>
          </Row>
          <div className="contrustion-wrapper">
            <SVGIcon name="construction" />
            <b>En construction</b>
          </div>
        </section>
        <Row className="tags-row">
          <b className="en-bref">En bref : </b>
          {((this.state.menu.find(x=> x.title==='C\'est pour qui ?') || []).children || []).map((card, key) => {
            if(card.type==='card'){
              return (
                <div className="tag-wrapper" key={key}>
                  <div className="tag-item">
                    <SVGIcon name={card.titleIcon} />
                    <span>{card.contentTitle}</span>
                  </div>
                </div>
              )
            }else{return false}
          })}
        </Row>
        <Row className="give-it-space">
          <Col md="3">
            <div className="sticky-affix">
              <ListGroup className="list-group-flush">
                <Scrollspy 
                  items={ this.state.menu.map((_,key) => 'item-'+key) }
                  currentClassName="active"
                  onUpdate={this._handleScrollSpy}>
                  {this.state.menu.map((item, key) => {
                    return ( 
                      <div key={key} className="list-item-wrapper">
                        <ListGroupItem tag="a" data-toggle="list" action
                          href={'#item-head-' + key} 
                          onClick={() => this.onMenuNavigate(key)} >
                          {item.title}
                        </ListGroupItem>
                        {item.children &&
                          <Collapse isOpen={this.state.menu[key].accordion} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                            <ListGroup>
                              {item.children.map((subitem, subkey) => {
                                return ( 
                                  <div key={subkey}>
                                    <ListGroupItem 
                                      tag="a" 
                                      action 
                                      href={'#item-head-' + key + '-sub-' + subkey} >
                                      {subitem.title}
                                    </ListGroupItem>
                                  </div>
                                )}
                              )}
                            </ListGroup>
                          </Collapse>
                        }
                      </div>
                    )}
                  )}
                </Scrollspy>
              </ListGroup>
              <Card my="4">
                <h5 className="card-header">{t('article.Explication en 30 secondes')}</h5>
                <div className="card-body">
                  <ContentEditable
                    id='abstract'
                    html={this.state.content.abstract}  // innerHTML of the editable div
                    disabled={this.state.disableEdit}       // use true to disable editing
                    onChange={this._handleChange} // handle innerHTML change
                  />
                </div>
              </Card>
            </div>
          </Col>
          <Col lg="6">
            <ContenuDispositif 
              hoverOn={this.hoverOn}
              handleContentClick={this.handleContentClick}
              handleMenuChange={this.handleMenuChange}
              onEditorStateChange={this.onEditorStateChange}
              toggleModal={this.toggleModal}
              toggleAccordion={this.toggleAccordion}
              deleteCard={this.deleteCard}
              addItem={this.addItem}
              removeItem={this.removeItem}
              changeTitle={this.changeCardTitle}
              {...this.state}
            />
            
            <Button onClick={this.valider_dispositif} color="success" size="lg" block>
              Valider ce dispositif
            </Button>
            
            {false && <Commentaires />}
          </Col>
          <Col md="3" className="aside-right">
            <div className="tags">
              <span className="first-item">#&nbsp;<u>Insertion professionnelle</u></span>
              <span className="second-item">#&nbsp;<u>Apprendre le français</u></span>
            </div>

            <div className="print-buttons">
              <Button className="print-button" onClick={this.createPdf}>
                <Icon name="download-outline" fill="#3D3D3D" />
                <span>Télécharger en PDF</span>
              </Button>
              <Button className="print-button" onClick={this.createPdf}>
                <Icon name="paper-plane-outline" fill="#3D3D3D" />
                <span>Envoyer par mail</span>
              </Button>
              <ReactToPrint
                trigger={() => 
                  <Button className="print-button" onClick={this.createPdf}>
                    <Icon name="printer-outline" fill="#3D3D3D" />
                    <span>Imprimer</span>
                  </Button>}
                content={() => this.bodyRef}
                onBeforePrint={()=>this.setState({accordion: this.state.accordion.map(x => true)})}
              />
            </div>
          </Col>
        </Row>
        

        <div className="contact-footer">
          Des questions ? Contactez-nous par email à&nbsp;<u>contact@volont-r.fr</u>
        </div>
        <div className="people-footer">
          <Row>
            <Col lg="6" className="people-col">
              <div className="people-title">Contributeurs</div>
              <div className="people-card">
                <img className="people-img" src={juliette} alt="juliette"/>
                <div className="right-side">
                  <h6>Juliette Ducoulombier</h6>
                  <span>Chargée de mission pour la Diair</span>
                </div>
              </div>
            </Col>
            <Col lg="6" className="people-col">
              <div className="people-title">Traducteurs</div>
              <div className="people-card">
                <img className="people-img" src={hugo} alt="hugo"/>
                <div className="right-side">
                  <h6>Hugo Stéphan</h6>
                  <span>Designer pour la Diair</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <Sponsors 
          handleFileInputChange={this.handleFileInputChange} 
          deleteSponsor={this.deleteSponsor} 
          sponsors={this.state.sponsors} 
          loading={this.state.sponsorLoading} />
        
        <ReagirModal 
          show={this.state.showModals.reaction}
          toggleModal={this.toggleModal}
          name='reaction'
        />

        <Modal show={this.state.showModals.fiabilite} modalClosed={()=>this.toggleModal(false, 'fiabilite')} classe='modal-fiabilite'>
          <h1>Fiabilité de l’information</h1>
          <div className="liste-fiabilite">
            <Row>
              <Col lg="4" className="make-it-red">
                Faible
              </Col>
              <Col lg="8">
                L’information a été rédigée par un contributeur qui n’est pas directement responsable et n’a pas été validée par l’autorité compétente.
              </Col>
            </Row>
            <Row>
              <Col lg="4" className="make-it-orange">
                Moyenne
              </Col>
              <Col lg="8">
                L’information a été rédigée par un contributeur qui n’est pas directement responsable et n’a pas été validée par l’autorité compétente.
              </Col>
            </Row>
            <Row>
              <Col lg="4" className="make-it-green">
                Forte
              </Col>
              <Col lg="8">
                L’information a été rédigée par un contributeur qui n’est pas directement responsable et n’a pas été validée par l’autorité compétente.
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.languei18nCode
  }
}

export default track({
    page: 'Dispositif',
  })(
    connect(mapStateToProps)(
      withTranslation()(Dispositif)
    )
  );