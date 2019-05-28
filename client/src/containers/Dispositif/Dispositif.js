import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Tooltip } from 'reactstrap';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { savePDF } from '@progress/kendo-react-pdf';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import Icon from 'react-eva-icons';
import h2p from 'html2plaintext';

import Sponsors from '../../components/Frontend/Dispositif/Sponsors/Sponsors';
import Modal from '../../components/Modals/Modal'
import ContenuDispositif from '../../components/Frontend/Dispositif/ContenuDispositif/ContenuDispositif'
import API from '../../utils/API';
import {ReagirModal, BookmarkedModal, DispositifCreateModal, DispositifValidateModal, SuggererModal, MerciModal, EnConstructionModal} from '../../components/Modals/index';
import SVGIcon from '../../components/UI/SVGIcon/SVGIcon';
import Commentaires from '../../components/Frontend/Dispositif/Commentaires/Commentaires';
import Tags from './Tags/Tags';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import LeftSideDispositif from '../../components/Frontend/Dispositif/LeftSideDispositif/LeftSideDispositif';
import TopRightHeader from '../../components/Frontend/Dispositif/TopRightHeader/TopRightHeader';

import {hugo, femmeCurly, manLab, diair} from '../../assets/figma/index';

import {contenu, lorems, menu, filtres} from './data'

import './Dispositif.scss';

moment.locale('fr');

const spyableMenu = menu.reduce((r, e, i) => {
  r.push('item-'+i);
  (e.children || []).map((_,subkey)=> {return r.push('item-'+i+'-sub-'+subkey)})
  return r
}, []);

const sponsorsData = [
  {src:diair,alt:"logo DIAIR"},
]

const uiElement = {isHover:false, accordion:false, cardDropdown: false, addDropdown:false};

let user={_id:'', cookies:{}}
class Dispositif extends Component {
  state={
    menu: menu.map((x) => {return {...x, type:x.type || 'paragraphe', isFakeContent: true, content: (x.type ? null : x.tutoriel.contenu), editorState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(lorems.paragraphe).contentBlocks))}}),
    content:contenu,
    sponsors:sponsorsData,
    tags:['Formation professionnelle', 'Apprendre le français'],
    dateMaj:new Date(),
    
    hovers: menu.map((x) => {return {isHover:false, ...( x.children && {children: new Array(x.children.length).fill({isHover:false})})}}),
    showModals:{
      reaction:false,
      fiabilite:false,
      suggerer:false,
      question:false, //correspond au modal suggerer, mais permet de différencier comment on est arrivés là
      signaler:false, //correspond au modal suggerer, mais permet de différencier comment on est arrivés là
      merci:false,
      allGood:false,
      construction:false,
      map:false
    },
    accordion: new Array(1).fill(false),
    dropdown: new Array(5).fill(false),
    disableEdit:true,
    tooltipOpen:false,
    uiArray:new Array(menu.length).fill(uiElement),
    sponsorLoading:false,
    showBookmarkModal:false,
    showDispositifCreateModal:false,
    showDispositifValidateModal:false,
    withHelp:true,
    showSpinnerPrint:false,
    showSpinnerBookmark:false,
    suggestion:'',
    mail: '',
    tKeyValue: -1, 
    tSubkey: -1,
    pinned:false,
    user:{}
  }
  _initialState=this.state;
  newRef=React.createRef();

  componentDidMount (){
    let itemId=this.props.match && this.props.match.params && this.props.match.params.id;
    if(itemId){
      API.get_dispositif({_id: itemId},{},'creatorId').then(data_res => {
        let dispositif={...data_res.data.data[0]};
        console.log(dispositif);
        this.setState({
          _id:itemId,
          menu: dispositif.contenu, 
          content: {titreInformatif:dispositif.titreInformatif, titreMarque: dispositif.titreMarque, abstract: dispositif.abstract, contact: dispositif.contact}, 
          sponsors:dispositif.sponsors,
          tags:dispositif.tags,
          creator:dispositif.creatorId,
          uiArray: dispositif.contenu.map((x) => {return {...uiElement, ...( x.children && {children: new Array(x.children.length).fill(uiElement)})}}),
          dispositif: dispositif,
          disableEdit: true
        })
        //On récupère les données de l'utilisateur
        if(API.isAuth()){
          API.get_user_info().then(data_res => {
            let u=data_res.data.data;
            user={_id:u._id, cookies:u.cookies || {}}
            this.setState({
              pinned: (user.cookies.dispositifsPinned || []).some( x => x._id === itemId),
              isAuthor: u._id === (dispositif.creatorId || {})._id,
            })
          })
        }
      },function(error){ console.log(error); return; })
    }else if(API.isAuth()){
      this.setState({
        disableEdit:false,
        uiArray: menu.map((x) => {return {...uiElement, ...( x.children && {children: new Array(x.children.length).fill(uiElement)})}}),
        showDispositifCreateModal:true, //A modifier avant la mise en prod
      })
    }else{ this.props.history.push({ pathname: '/login', state: {redirectTo:"/dispositif"} }); }
    window.scrollTo(0, 0);
  }

  onMenuNavigate = (tab) => {
    const prevState = this.state.menu;
    const state = prevState.map((x, index) => tab === index ? {...x, accordion : !x.accordion} : {...x, accordion: false});
    this.setState({
      menu: state,
    });
  }

  handleScrollSpy = el => {
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
      [ev.currentTarget.id]: ev.target.value
     }
    });
  };

  handleModalChange = (ev) => this.setState({ [ev.currentTarget.id]: ev.target.value });

  disableIsMapLoaded = (key, subkey) => {
    let state=[...this.state.menu];
    if(state.length > key && state[key].children && state[key].children.length > subkey){
      state[key].children[subkey].isMapLoaded = true;
      this.setState({ menu: state });
    }
  }
  
  handleMenuChange = (ev) => {
    let node=ev.currentTarget;
    let state = JSON.parse(JSON.stringify(this.state.menu));
    state[node.id]={
      ...state[node.id],
      ...(!node.dataset.subkey && {content : ev.target.value, isFakeContent:false}), 
      ...(node.dataset.subkey && state[node.id].children && state[node.id].children.length > node.dataset.subkey && {children : state[node.id].children.map((y,subidx) => { return {
            ...y,
            ...(subidx==node.dataset.subkey && {[node.dataset.target || 'content'] : ev.target.value, isFakeContent:false})
          }
        })
      })
    }
    this.setState({ menu: state });
  };

  handleContentClick = (key, editable, subkey=null) => {
    let state=[...this.state.menu];
    if(state.length > key){
      let right_node=state[key];
      if(subkey !==null && state[key].children.length > subkey){right_node= state[key].children[subkey];}
      right_node.editable = editable;
      if(editable && right_node.content){
        right_node.editorState=EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(right_node.isFakeContent ? '' : right_node.content).contentBlocks));
      }else if(!editable && right_node.editorState){
        right_node.content=draftToHtml(convertToRaw(right_node.editorState.getCurrentContent()));
      }
      if(right_node.type === 'accordion'){ this.updateUIArray(key, subkey, 'accordion', true) }
      this.setState({ menu: state });
    }
  };

  onEditorStateChange = (editorState, key, subkey=null) => {
    let state=[...this.state.menu];
    if(state.length > key){
      if(subkey!==null && state[key].children.length > subkey){
        state[key].children[subkey].editorState =  editorState;
        state[key].children[subkey].isFakeContent = false;
      }else{
        state[key].editorState =  editorState;
        state[key].isFakeContent = false;
      }
      this.setState({ menu: state });
    }
  };

  updateUIArray=(key, subkey=null, node='isHover', value=true)=>{
    let uiArray = JSON.parse(JSON.stringify(this.state.uiArray));
    uiArray = uiArray.map((x,idx) => {return {
      ...x,
      ...((subkey==null && idx==key && {[node] : value}) || {[node] : false}), 
      ...(x.children && {children : x.children.map((y,subidx) => { return {
            ...y,
            ...((subidx==subkey && idx==key && {[node] : value}) || {[node] : false})
          }
        })
      })
    }});
    this.setState({ uiArray: uiArray, tKeyValue: key, tSubkey: subkey });
  }

  addItem=(key, type='paragraphe', subkey=null)=>{
    let prevState = [...this.state.menu];
    let uiArray = [...this.state.uiArray];
    if(prevState[key].children && prevState[key].children.length > 0){
      let newChild={...prevState[key].children[prevState[key].children.length - 1]};
      if(type==='card' && newChild.type!=='card'){
        prevState[key].type='cards';
        newChild={type:'card', isFakeContent: true,title:'Important !',titleIcon:'warning',contentTitle: 'Compte bancaire', contentBody:'nécessaire pour recevoir l’indemnité', footer:'Pourquoi ?',footerIcon:'question-mark-circle-outline'};
      }else if(type==='accordion' && !newChild.content){
        newChild={type:'accordion', isFakeContent: true, title:'Un exemple d\'accordéon',content: lorems.sousParagraphe};
      }else if(type==='map'){
        newChild={type:'map', isFakeContent: true, isMapLoaded:false, markers: [{nom: "Test Paris", ville: "Paris", description: "Antenne locale de Test", latitude: "48.856614", longitude: "2.3522219"}]};
      }else if(type === 'paragraph' && !newChild.content){
        newChild={title:'Un exemple de paragraphe', isFakeContent: true,content: lorems.sousParagraphe, type:type}
      }
      newChild.type=type;
      if(subkey == null || subkey==undefined){
        prevState[key].children.push(newChild)
      }else{
        prevState[key].children.splice(subkey+1,0,newChild)
      }
    }else{
      if(type==='card'){
        prevState[key].type='cards';
        prevState[key].children=[{type:'card', isFakeContent: true,title:'Important !',titleIcon:'warning',contentTitle: 'Compte bancaire', contentBody:'nécessaire pour recevoir l’indemnité', footer:'Pourquoi ?',footerIcon:'question-mark-circle-outline'}];
      }else if(type==='map'){
        prevState[key].children=[{type:'map', isFakeContent: true, isMapLoaded:false, markers: [{nom: "Test Paris", ville: "Paris", description: "Antenne locale de Test", latitude: "48.856614", longitude: "2.3522219"}]}];
      }else{
        prevState[key].children=[{title:'Nouveau sous-paragraphe', type:type,content: lorems.sousParagraphe}];
      }
    }
    uiArray[key].children= [...(uiArray[key].children || []), uiElement];
    this.setState({ menu: prevState, uiArray: uiArray });
  }

  removeItem=(key, subkey=null)=>{
    let prevState = [...this.state.menu];
    let uiArray = [...this.state.uiArray];
    if(prevState[key].children && prevState[key].children.length > 0){
      if(subkey == null || subkey == undefined){
        prevState[key].children.pop();
        uiArray[key].children.pop();
      }else if(prevState[key].children.length > subkey){
        prevState[key].children.splice(subkey,1);
        uiArray[key].children.splice(subkey,1);
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
    this.props.tracking.trackEvent({ action: 'toggleModal', label: name, value : show });
    if(name==='merci' && this.state.showModals.merci){
      Swal.fire( 'Yay...', 'Votre suggestion a bien été enregistrée, merci', 'success')
    }
    this.setState(prevState=>({showModals:{...prevState.showModals,[name]:show}, suggestion:''}))
  }

  toggleTooltip = () => {
    this.props.tracking.trackEvent({ action: 'toggleTooltip', label: 'tooltipOpen', value : !this.state.tooltipOpen });
    this.setState({ tooltipOpen: !this.state.tooltipOpen});
  }

  toggleBookmarkModal = () => this.setState(prevState=>({showBookmarkModal:!prevState.showBookmarkModal}))
  toggleDispositifCreateModal = () => this.setState(prevState=>({showDispositifCreateModal:!prevState.showDispositifCreateModal}))
  toggleDispositifValidateModal = () => this.setState(prevState=>({showDispositifValidateModal:!prevState.showDispositifValidateModal}))

  toggleHelp = () => this.setState(prevState=>({withHelp:!prevState.withHelp}))

  openAllAccordions = () =>this.setState({accordion: this.state.accordion.map(x => true)})

  bookmarkDispositif = () => {
    this.setState({showSpinnerBookmark:true})
    if(API.isAuth()){
      if(this.state.pinned){
        user.cookies.dispositifsPinned = user.cookies.dispositifsPinned.filter(x => x._id !== this.state.dispositif._id)
      }else{
        user.cookies.dispositifsPinned=[...(user.cookies.dispositifsPinned || []), {...this.state.dispositif, pinned:true}];
      }
      API.set_user_info(user).then((data) => {
        this.setState({
          showSpinnerBookmark: false,
          showBookmarkModal: !this.state.pinned,
          pinned: !this.state.pinned
        })
      })
    }else{Swal.fire( 'Oh non!', 'Vous devez être connecté pour utiliser cette fonctionnalité', 'error')}
  }

  changeCardTitle = (key, subkey, node, value) => {
    const prevState = [...this.state.menu];
    prevState[key].children[subkey][node]=value;
    this.setState({ menu: prevState });
  }

  changeTag = (key, value) => this.setState({ tags: this.state.tags.map((x,i)=> i===key ? value : x) });
  addTag = () => this.setState({ tags: [...this.state.tags, 'Autre'] });
  deleteTag = (idx) => this.setState({ tags: [...this.state.tags].filter((_,i) => i!==idx) });

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
    this.props.tracking.trackEvent({ action: 'click', label: 'goBack' });
    this.props.history.push("/dispositifs");
  }

  createPdf = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'createPdf' });
    let uiArray = JSON.parse(JSON.stringify(this.state.uiArray));
    uiArray = uiArray.map(x => ({
      ...x,
      accordion : true, 
      ...(x.children && {children : x.children.map(y => { return { ...y, accordion : true } }) })
    }));
    this.setState({ uiArray: uiArray, showSpinnerPrint:true }, ()=>{
      setTimeout(()=>{
        savePDF(this.newRef.current, { 
          fileName: 'dispositif' + ((this.state.content && this.state.content.titreMarque) ? (' - ' + this.state.content.titreMarque) : '') +'.pdf',
          scale:.5
        })
        this.setState({showSpinnerPrint: false})
      }, 3000);
    })
  }

  editDispositif = () => this.setState({disableEdit: false})

  pushReaction = (modalName, fieldName) => {
    this.toggleModal(false, modalName);
    let dispositif = {
      dispositifId: this.state._id,
      keyValue: this.state.tKeyValue, 
      subkey: this.state.tSubkey,
      fieldName: fieldName,
      type:'push',
      ...(this.state.suggestion && {suggestion: h2p(this.state.suggestion)})
    }
    API.update_dispositif(dispositif).then(data => {
      if(modalName === 'reaction'){
        Swal.fire( 'Yay...', 'Votre réaction a bien été enregistrée, merci', 'success')
      }else if(API.isAuth()){
        Swal.fire( 'Yay...', 'Votre suggestion a bien été enregistrée, merci', 'success')
      }else{
        this.toggleModal(true, 'merci');
      }
    })
  }

  valider_dispositif = (status='Actif') => {
    let content = {...this.state.content}
    Object.keys(content).map( k => content[k] = h2p(content[k]))
    let dispositif = {
      ...content,
      contenu : [...this.state.menu].map(x=> {return {title: x.title, content : x.content, type:x.type, ...(x.children && {children : x.children.map(x => ({...x, ...(x.title && {title: h2p(x.title)})}))}) }}),
      sponsors:this.state.sponsors,
      tags:this.state.tags,
      avancement:1,
      status:status,
      dispositifId:this.state._id
    }
    let cardElement=(this.state.menu.find(x=> x.title==='C\'est pour qui ?') || []).children;
    dispositif.audience= cardElement.find(x=> x.title==='Public visé') ?
      [(cardElement.find(x=> x.title==='Public visé') || []).contentTitle] :
      filtres.audience;
    dispositif.audienceAge= cardElement.find(x=> x.title==='Tranche d\'âge') ? 
      [(cardElement.find(x=> x.title==='Tranche d\'âge').contentTitle || '').replace(' à ', '-').replace(' ans', '')] :
      filtres.audienceAge.map(x=> x.replace(' à ', '-').replace(' ans', ''));
    dispositif.niveauFrancais= cardElement.find(x=> x.title==='Niveau de français') ?
      (cardElement.find(x=> x.title==='Niveau de français') || []).contentTitle :
      filtres.niveauFrancais;
    console.log(dispositif)
    API.add_dispositif(dispositif).then((data) => {
      Swal.fire( 'Yay...', 'Enregistrement réussi !', 'success').then(() => {
        this.setState({disableEdit: status==='Actif'}, () => {
          this.props.history.push("/dispositif/" + data.data.data._id)
        })
      });
    },(e)=>{Swal.fire( 'Oh non!', 'Une erreur est survenue !', 'error');console.log(e);return;})
  }

  render(){
    const {t} = this.props;
    const creator=this.state.creator || {};
    const creatorImg= (creator.picture || {}).secure_url || hugo;    
    const {showModals} = this.state;
    return(
      <div className="animated fadeIn dispositif" ref={this.newRef}>
        <section className="banniere-dispo">
          <Row className="header-row">
            <Col className="top-left" onClick={this.goBack}>
              <i className="cui-arrow-left icons"></i> 
              <span>{t("Retour à la recherche")}</span>
            </Col>
            <TopRightHeader 
              disableEdit={this.state.disableEdit} 
              withHelp={this.state.withHelp}
              showSpinnerBookmark={this.state.showSpinnerBookmark}
              pinned={this.state.pinned}
              isAuthor={this.state.isAuthor}
              bookmarkDispositif={this.bookmarkDispositif}
              toggleHelp={this.toggleHelp}
              toggleDispositifValidateModal={this.toggleDispositifValidateModal}
              editDispositif = {this.editDispositif}
              valider_dispositif={this.valider_dispositif} />
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
                <span>{t("avec le programme")}&nbsp;</span>
                <ContentEditable
                  id='titreMarque'
                  html={this.state.content.titreMarque}  // innerHTML of the editable div
                  disabled={this.state.disableEdit}
                  onChange={this._handleChange} // handle innerHTML change
                />
              </h2>
              <div className="header-footer">
                <Tags tags={this.state.tags} filtres={filtres.tags} disableEdit={this.state.disableEdit} changeTag={this.changeTag} addTag={this.addTag} deleteTag={this.deleteTag} />
              </div>
            </div>
          </Col>
          <img className="homme-icon" src={manLab} alt="homme"/>
        </section>
        <Row className="tags-row">
          <b className="en-bref">{t("En bref")} : </b>
          {((this.state.menu.find(x=> x.title==='C\'est pour qui ?') || []).children || []).map((card, key) => {
            if(card.type==='card'){
              return (
                <div className="tag-wrapper" key={key}>
                  <div className="tag-item">
                    <a href={'#item-head-1'} className="no-decoration">
                      <SVGIcon name={card.titleIcon} />
                      <span>{card.contentTitle}</span>
                    </a>
                  </div>
                </div>
              )
            }else{return false}
          })}
          <Row className="right-side-row">
            <Col className="align-right">
              {t("Dernière mise à jour")} :&nbsp;<span className="date-maj">{moment(this.state.dateMaj).format('ll')}</span>
            </Col>
            <Col>
              {t("Fiabilité de l'information")} :&nbsp;<span className="fiabilite">{t("Faible")}</span>
              <EVAIcon className="question-bloc" id="question-bloc" name="question-mark-circle" fill="#828282"  onClick={()=>this.toggleModal(true, 'fiabilite')} />
              
              <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="question-bloc" toggle={this.toggleTooltip} onClick={()=>this.toggleModal(true, 'fiabilite')}>
                {t("Dispositif.fiabilite_faible_1")} <b>{t("Dispositif.fiabilite_faible_2")}</b> {t("Dispositif.fiabilite_faible_3")}{' '}
                {t("Dispositif.cliquez")}
              </Tooltip>
            </Col>
          </Row>
        </Row>
        <Row className="give-it-space">
          <Col md="3">
            <LeftSideDispositif
              menu={this.state.menu}
              accordion={this.state.accordion}
              showSpinner={this.state.showSpinnerPrint}
              content={this.state.content}
              handleScrollSpy={this.handleScrollSpy}
              onMenuNavigate={this.onMenuNavigate}
              createPdf={this.createPdf}
              newRef={this.newRef}
              openAllAccordions={this.openAllAccordions}
            />
          </Col>
          <Col lg="7">
            <ContenuDispositif 
              updateUIArray={this.updateUIArray}
              handleContentClick={this.handleContentClick}
              handleMenuChange={this.handleMenuChange}
              onEditorStateChange={this.onEditorStateChange}
              toggleModal={this.toggleModal}
              deleteCard={this.deleteCard}
              addItem={this.addItem}
              removeItem={this.removeItem}
              changeTitle={this.changeCardTitle}
              disableIsMapLoaded={this.disableIsMapLoaded}
              filtres={filtres}
              {...this.state}
            />
            
            {false && <Commentaires />}
          </Col>
          <Col md="2" className="aside-right">
          </Col>
        </Row>
        

        <div className="contact-footer">
          {t("Dispositif.questions")}&nbsp;
          <u>
            <ContentEditable
              id='contact'
              html={this.state.content.contact || ''}  // innerHTML of the editable div
              disabled={this.state.disableEdit}       // use true to disable editing
              onChange={this._handleChange} // handle innerHTML change
            />
          </u>
        </div>
        <div className="bottom-wrapper">
          <div className="people-footer">
            <Row>
              <Col lg="6" className="people-col">
                <div className="people-title">{t("Contributeurs")}</div>
                <div className="people-card">
                  <img className="people-img" src={creatorImg} alt="juliette"/>
                  <div className="right-side">
                    <h6>{creator.username}</h6>
                    <span>{creator.description}</span>
                  </div>
                </div>
              </Col>
              <Col lg="6" className="people-col">
                <div className="people-title">{t("Traducteurs")}</div>
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

          {!this.state.disableEdit &&
              <div className="ecran-protection">
                <div className="content-wrapper">
                  <Icon name="alert-triangle-outline" fill="#FFFFFF" />
                  <span>Ajout des contributeurs <u className="pointer" onClick={()=>this.toggleModal(true, 'construction')}>disponible prochainement</u></span>
                </div>
              </div>
            }
        </div>

        <Sponsors 
          sponsors={this.state.sponsors} 
          loading={this.state.sponsorLoading}
          disableEdit={this.state.disableEdit}
          handleFileInputChange={this.handleFileInputChange} 
          deleteSponsor={this.deleteSponsor}  />
        
        <ReagirModal name='reaction' show={showModals.reaction} toggleModal={this.toggleModal} onValidate={this.pushReaction} />
        <SuggererModal showModals={showModals} toggleModal={this.toggleModal} onChange={this.handleModalChange} suggestion={this.state.suggestion} onValidate={this.pushReaction} />
        <MerciModal name='merci' show={showModals.merci} toggleModal={this.toggleModal} onChange={this.handleModalChange} mail={this.state.mail} />
        <EnConstructionModal name='construction' show={showModals.construction} toggleModal={this.toggleModal} />

        <Modal show={this.state.showModals.fiabilite} modalClosed={()=>this.toggleModal(false, 'fiabilite')} classe='modal-fiabilite'>
          <h1>{t("Dispositif.fiabilite")}</h1>
          <div className="liste-fiabilite">
            <Row>
              <Col lg="4" className="make-it-red">
                {t("Faible")}
              </Col>
              <Col lg="8">
                L’information a été rédigée par un contributeur qui n’est pas directement responsable et n’a pas été validée par l’autorité compétente.
              </Col>
            </Row>
            <Row>
              <Col lg="4" className="make-it-orange">
                {t("Moyenne")}
              </Col>
              <Col lg="8">
                L’information a été rédigée par un contributeur qui n’est pas directement responsable et n’a pas été validée par l’autorité compétente.
              </Col>
            </Row>
            <Row>
              <Col lg="4" className="make-it-green">
                {t("Forte")}
              </Col>
              <Col lg="8">
                L’information a été rédigée par un contributeur qui n’est pas directement responsable et n’a pas été validée par l’autorité compétente.
              </Col>
            </Row>
          </div>
        </Modal>

        <BookmarkedModal 
          showBookmarkModal={this.state.showBookmarkModal}
          toggleBookmarkModal={this.toggleBookmarkModal}
        />
        <DispositifCreateModal 
          show={this.state.showDispositifCreateModal}
          toggle={this.toggleDispositifCreateModal}
        />
        <DispositifValidateModal
          show={this.state.showDispositifValidateModal}
          toggle={this.toggleDispositifValidateModal} 
          abstract={this.state.content.abstract} 
          onChange={this._handleChange}
          validate={this.valider_dispositif}
        />
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