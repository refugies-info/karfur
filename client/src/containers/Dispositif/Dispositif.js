import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import track from 'react-tracking';
import { Col, Row, Modal, Spinner, Button } from 'reactstrap';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { savePDF } from '@progress/kendo-react-pdf';
import moment from 'moment/min/moment-with-locales';
import Swal from 'sweetalert2';
import Icon from 'react-eva-icons';
import h2p from 'html2plaintext';
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import _ from "lodash";
import querySearch from "stringquery";
import {convertToHTML} from "draft-convert";

import API from '../../utils/API';
import Sponsors from '../../components/Frontend/Dispositif/Sponsors/Sponsors';
import ContenuDispositif from '../../components/Frontend/Dispositif/ContenuDispositif/ContenuDispositif';
import {ReagirModal, BookmarkedModal, DispositifCreateModal, DispositifValidateModal, SuggererModal, MerciModal, EnConstructionModal, ResponsableModal, VarianteCreateModal} from '../../components/Modals/index';
import SVGIcon from '../../components/UI/SVGIcon/SVGIcon';
import Commentaires from '../../components/Frontend/Dispositif/Commentaires/Commentaires';
import Tags from './Tags/Tags';
import EVAIcon from '../../components/UI/EVAIcon/EVAIcon';
import LeftSideDispositif from '../../components/Frontend/Dispositif/LeftSideDispositif/LeftSideDispositif';
import BandeauEdition from '../../components/Frontend/Dispositif/BandeauEdition/BandeauEdition';
import TopRightHeader from '../../components/Frontend/Dispositif/TopRightHeader/TopRightHeader';
import {fetch_dispositifs, fetch_user} from '../../Store/actions/index';
import ContribCaroussel from './ContribCaroussel/ContribCaroussel';
import FButton from '../../components/FigmaUI/FButton/FButton';
import {ManLab, diair, FemmeCurly} from '../../assets/figma/index';
import SideTrad from './SideTrad/SideTrad';
import {initializeTimer} from '../Translation/functions';
import {readAudio} from "../Layout/functions";
import MoteurVariantes from './MoteurVariantes/MoteurVariantes';
import {contenu, lorems, menu, filtres, onBoardSteps, tutoSteps, importantCard, showModals, menuDemarche, demarcheSteps, tutoStepsDemarche, customConvertOption} from './data'
import {switchVariante, initializeVariantes, initializeInfoCards, verifierDemarche, validateVariante, deleteVariante} from "./functions";

import variables from 'scss/colors.scss';

moment.locale('fr');

const sponsorsData = [];
const uiElement = {isHover:false, accordion:false, cardDropdown: false, addDropdown:false, varianteSelected: false};
let user={_id:'', cookies:{}}

class Dispositif extends Component {
  constructor(props) {
    super(props);
    this.initializeTimer = initializeTimer.bind(this);
    this.readAudio = readAudio.bind(this);
    this.switchVariante = switchVariante.bind(this);
    this.initializeVariantes = initializeVariantes.bind(this);
    this.initializeInfoCards = initializeInfoCards.bind(this);
    this.verifierDemarche = verifierDemarche.bind(this);
    this.validateVariante = validateVariante.bind(this);
    this.deleteVariante = deleteVariante.bind(this);
  }
  audio = new Audio();

  state={
    menu: [],
    content:contenu,
    sponsors:sponsorsData,
    tags:[],
    mainTag: {darkColor: variables.darkColor, lightColor: variables.lightColor, hoverColor: variables.gris},
    dateMaj:new Date(),
    
    uiArray:new Array(menu.length).fill(uiElement),
    showModals: showModals,
    accordion: new Array(1).fill(false),
    dropdown: new Array(5).fill(false),
    disableEdit:true,
    tooltipOpen:false,
    showBookmarkModal:false,
    isAuth: false,
    showDispositifCreateModal:false,
    showDispositifValidateModal:false,
    showSpinnerPrint:false,
    showSpinnerBookmark:false,
    suggestion:'',
    mail: '',
    tKeyValue: -1, 
    tSubkey: -1,
    pinned:false,
    user:{},
    isDispositifLoading: true,
    contributeurs:[],
    withHelp: process.env.NODE_ENV !== "development",
    runFirstJoyRide: false,
    runJoyRide: false,
    stepIndex: 0,
    disableOverlay:false,
    joyRideWidth: 800,
    inputBtnClicked: false,
    mainSponsor:{},
    status: '',
    time: 0,
    initialTime: 0,
    typeContenu: "dispositif",
    variantes:[],
    search: {},
    inVariante: false,
    allDemarches: [],
    demarcheId: null,
    isVarianteValidated: false,
    dispositif: {},
  }
  newRef=React.createRef();
  mountTime=0;

  componentDidMount (){
    this._initializeDispositif(this.props);
  }

  componentWillReceiveProps(nextProps){
    if(((nextProps.match || {}).params || {}).id !== ((this.props.match || {}).params || {}).id){
      this._initializeDispositif(nextProps);
    }
    const userQuery = querySearch(_.get(nextProps, "history.location.search", ""));
    if(userQuery && userQuery.age !== this.state.search.age && userQuery.ville !== this.state.search.ville){
      this.setState({search: userQuery})
    }
  }

  componentWillUnmount (){
    clearInterval(this.timer)
  }

  _initializeDispositif = props => {
    this.initializeTimer();
    const itemId = props.match && props.match.params && props.match.params.id;
    const typeContenu = (props.match.path || "").includes("demarche") ? "demarche" : "dispositif";
    const inVariante = _.get(props, "location.state.inVariante"), textInput = _.get(props, "location.state.textInput");
    if(itemId){
      this.props.tracking.trackEvent({ action: 'readDispositif', label: "dispositifId", value : itemId });
      API.get_dispositif({query: {_id: itemId},sort: {},populate: 'creatorId mainSponsor'}).then(data_res => {
        let dispositif={...data_res.data.data[0]};
        console.log(dispositif);
        const disableEdit = dispositif.status !== "Accepté structure" || !props.translating
        if(dispositif.status === "Brouillon"){
          this.initializeTimer();}
        this.setState({
          _id:itemId,
          menu: dispositif.contenu, 
          content: {titreInformatif:dispositif.titreInformatif, titreMarque: dispositif.titreMarque, abstract: dispositif.abstract, contact: dispositif.contact, externalLink: dispositif.externalLink}, 
          sponsors:dispositif.sponsors,
          tags:dispositif.tags,
          creator:dispositif.creatorId,
          uiArray: dispositif.contenu.map((x) => {return {...uiElement, ...( x.children && {children: new Array(x.children.length).fill({...uiElement, accordion: dispositif.status === "Accepté structure"})})}}),
          dispositif: dispositif,
          isDispositifLoading: false,
          contributeurs: [dispositif.creatorId].filter(x => x),
          mainTag: (dispositif.tags && dispositif.tags.length >0) ? (filtres.tags.find(x => x && x.name === (dispositif.tags[0] || {}).name) || {}) : {},
          mainSponsor: dispositif.mainSponsor,
          status: dispositif.status,
          variantes: dispositif.variantes || [],
          fiabilite: calculFiabilite(dispositif),
          disableEdit, typeContenu, inVariante,
          ...(inVariante && disableEdit && {showModals:{...this.state.showModals, variante: true}}),
          ...(dispositif.status==="Brouillon" && {initialTime: dispositif.timeSpent}),
        },()=>{
          if(typeContenu === "demarche"){
            this.initializeInfoCards();
            this.initializeVariantes(itemId, props);
          }else{
            this.setColors();
          }
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
      })
    }else if(API.isAuth()){
      this.initializeTimer();
      const menuContenu = typeContenu === "demarche" ? menuDemarche : menu;
      this.setState({
        disableEdit:false,
        uiArray: menuContenu.map((x) => {return {...uiElement, ...( x.children && {children: new Array(x.children.length).fill({...uiElement, accordion: true})})}}),
        showDispositifCreateModal: process.env.NODE_ENV !== "development", //A modifier avant la mise en prod
        isDispositifLoading: false,
        menu: menuContenu.map((x) => {return {...x, type:x.type || 'paragraphe', isFakeContent: true, placeholder: (x.tutoriel || {}).contenu, content: (x.type ? null : x.content), editorState: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft('').contentBlocks))}}),
        typeContenu,
        ...(textInput && {content: {...contenu, titreInformatif: textInput}})
      },()=>this.setColors());
    }else{ props.history.push({ pathname: '/login', state: {redirectTo:"/dispositif"} }); }
    window.scrollTo(0, 0);
  }

  setColors = () => {
    ["color", "borderColor", "backgroundColor", "fill"].map(s => {
      return ["dark", "light"].map(c => {
        return document.querySelectorAll('.' + s + '-' + c + 'Color').forEach(elem => {
          elem.style[s] = this.state.mainTag[c + 'Color'];
        });
      })
    })
  }

  onInputClicked = ev => {
    const id = ev.currentTarget.id;
    if( !this.state.disableEdit && ((id==="titreInformatif" && this.state.content.titreInformatif === contenu.titreInformatif)
        || (id==="titreMarque" && this.state.content.titreMarque === contenu.titreMarque)) ){
      this.setState({ content: { ...this.state.content, [id]: ""} })
    }
  }

  handleChange = (ev) => {
    this.setState({ content: {
      ...this.state.content,
      [ev.currentTarget.id]: ev.target.value
     }
    });
  };

  handleKeyPress = (ev, index) => {
    if(ev.key === 'Enter'){
      ev.preventDefault();
      this.setState({ stepIndex: index + 1});
      if( index===0 && this.state.content.titreMarque === contenu.titreMarque ){
        this.setState({ content: { ...this.state.content, titreMarque: ""} });
        document.getElementById("titreMarque").focus();
      }
    }
  };

  handleModalChange = (ev) => this.setState({ [ev.currentTarget.id]: ev.target.value });

  disableIsMapLoaded = (key, subkey) => {
    let state=[...this.state.menu];
    if(state.length > key && state[key].children && state[key].children.length > subkey){
      state[key].children[subkey].isMapLoaded = true;
      this.setState({ menu: state });
    }
  }
  
  fwdSetState = (fn, cb) => this.setState(fn, cb);

  handleMenuChange = (ev, value=null) => {
    const node=ev.currentTarget;
    let state = [...this.state.menu];
    state[node.id]={
      ...state[node.id],
      ...(!node.dataset.subkey && { [(node.dataset || {}).target || 'content'] : (value || (value === null && ev.target.value)), isFakeContent:false}), 
      ...(node.dataset.subkey && state[node.id].children && state[node.id].children.length > node.dataset.subkey && {children : state[node.id].children.map((y,subidx) => {return {
            ...y,
            ...(subidx===parseInt(node.dataset.subkey) && { [node.dataset.target || 'content'] : (value || (value === null && ev.target.value)), isFakeContent:false } )
          }
        })
      })
    }
    return this.setState({ menu: state });
  };

  handleContentClick = (key, editable, subkey=undefined) => {
    let state=[...this.state.menu];
    if(state.length > key && key >= 0 && !this.state.disableEdit && (!this.state.inVariante || _.get(this.state.uiArray, key + (subkey ? ".children." + subkey : "") + ".varianteSelected")) ){
      if(editable){  
        state = state.map(x => ({
          ...x, 
          editable:false, 
          ...(x.editable && x.editorState && x.editorState.getCurrentContent() && x.editorState.getCurrentContent().getPlainText() !== '' && 
            { content: convertToHTML(customConvertOption)(x.editorState.getCurrentContent()) } ), 
          ...(x.children && {children: x.children.map(y => ({ ...y, ...(y.editable && y.editorState && y.editorState.getCurrentContent() && y.editorState.getCurrentContent().getPlainText() !== '' && 
            { content: convertToHTML(customConvertOption)(y.editorState.getCurrentContent()) } ), editable:false }))})  //draftToHtml(convertToRaw(y.editorState.getCurrentContent()))
        }))
      }
      let right_node=state[key];
      if(subkey !==undefined && state[key].children.length > subkey){right_node= state[key].children[subkey];}
      right_node.editable = editable;
      if(editable && right_node.content){
        const contentState = ContentState.createFromBlockArray(htmlToDraft(right_node.isFakeContent ? '' : right_node.content).contentBlocks);
        const rawContentState = convertToRaw(contentState) || {};
        const rawBlocks = rawContentState.blocks || [];
        const textPosition = rawBlocks.findIndex(x => (x.text || "").includes("Bon à savoir :"));
        const newRawBlocks = rawBlocks.filter((_,i) => i < textPosition - 3 || i>=textPosition)
        const newRawContentState = {...rawContentState, blocks : newRawBlocks.map(x => x.text.includes("Bon à savoir :") ? {...x, text: x.text.replace("Bon à savoir :", ""), type: "header-six"} : x)}
        const newContentState = convertFromRaw(newRawContentState)
        right_node.editorState = EditorState.createWithContent(newContentState) ;
      }else if(!editable && right_node.editorState && right_node.editorState.getCurrentContent){
        right_node.content= convertToHTML(customConvertOption)(right_node.editorState.getCurrentContent()); //draftToHtml(convertToRaw(right_node.editorState.getCurrentContent()));
      }
      if(right_node.type === 'accordion'){ this.updateUIArray(key, subkey, 'accordion', true) }
      return new Promise(resolve => this.setState( { menu: state },()=>{ this.updateUI(key, subkey, editable) ; resolve()} ));
    }else{return new Promise(r=> r())}
  };

  updateUI = (key, subkey, editable) => {
    if(editable && (subkey===undefined || (subkey===0 && key>1) ) && this.state.withHelp){ 
      const seuil_tuto = this.state.typeContenu === "demarche" ? 3 : 4;
      try{ //On place le curseur à l'intérieur du wysiwyg et on ajuste la hauteur
        const target = (key === 0 || subkey !== undefined) ? 
          ('editeur-' + key + '-' + subkey) : 
          (key === 1 ? "card-col col-lg-4" : undefined);
        console.log(target)
        let parentNode = document.getElementsByClassName(target)[0];
        if(subkey && parentNode){
          parentNode.getElementsByClassName('public-DraftEditor-content')[0].focus();
          window.getSelection().addRange( document.createRange() );
          parentNode.getElementsByClassName("DraftEditor-root")[0].style.height = (parentNode.getElementsByClassName("public-DraftEditorPlaceholder-inner")[0] || {}).offsetHeight + "px";
          this.setState(pS => ({ joyRideWidth: parentNode.offsetWidth || pS.joyRideWidth }))
        }
        if(parentNode){
          parentNode.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        }
      } catch(e){console.log(e)} 
      console.log(key, seuil_tuto)
      this.setState({ stepIndex: key + seuil_tuto, runJoyRide: true, disableOverlay: true, inputBtnClicked: false }) 
    } 
  }

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
    let uiArray = [...this.state.uiArray];
    const updateOthers = node !=="varianteSelected" && (this.state.disableEdit || node !=="accordion") ;
    uiArray = uiArray.map((x,idx) => {
      return {
      ...x,
      ...((subkey===null && idx===key && {[node] : value}) || (updateOthers && {[node] : false})), 
      ...(x.children && {children : x.children.map((y,subidx) => { return {
            ...y,
            ...((subidx===subkey && idx===key && {[node] : value}) || (updateOthers && {[node] : false}))
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
        newChild={type:'accordion', isFakeContent: true, title:'Un exemple d\'accordéon', placeholder: lorems.sousParagraphe,content: ''};
      }else if(type==='map'){
        newChild={type:'map', isFakeContent: true, isMapLoaded:false, markers: [{nom: "Test Paris", ville: "Paris", description: "Antenne locale de Test", latitude: "48.856614", longitude: "2.3522219"}]};
      }else if(type === 'paragraph' && !newChild.content){
        newChild={title:'Un exemple de paragraphe', isFakeContent: true, placeholder: lorems.sousParagraphe,content: '', type:type}
      }else if(type === "etape"){
        newChild = {...newChild, papiers: [], duree: "00", timeStepDuree: "minutes", delai: "00", timeStepDelai: "minutes", option:{}}
      }
      newChild.type=type;
      if(subkey === null || subkey === undefined){
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
    uiArray[key].children= [...(uiArray[key].children || []), {...uiElement, accordion: true, varianteSelected: true}];
    console.log(prevState)
    this.setState({ menu: prevState, uiArray: uiArray }, () => (type === "card" || type==="map") && this.setColors() );
  }

  removeItem=(key, subkey=null)=>{
    let prevState = [...this.state.menu];
    let uiArray = [...this.state.uiArray];
    if(prevState[key].children && prevState[key].children.length > 0 && (prevState[key].children.length > 1 || prevState[key].content)){
      if(subkey === null || subkey === undefined){
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
      Swal.fire( {title: 'Yay...', text: 'Votre suggestion a bien été enregistrée, merci', type: 'success', timer: 1500})
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
  toggleInputBtnClicked = () => this.setState(prevState=>({inputBtnClicked:!prevState.inputBtnClicked}))
  
  toggleNiveau = (nv, key, subkey) => {
    let niveaux = _.get(this.state.menu, key + ".children." + subkey + ".niveaux", [])
    niveaux = niveaux.some( x => x===nv) ? niveaux.filter(x => x!==nv) : [...niveaux, nv]
    this.setState({menu: [...this.state.menu].map( (x,i) => i===key ? {...x, children: x.children.map((y,ix) => ix === subkey ? {...y, niveaux: niveaux} : y)} : x) })
  }

  toggleFree = (key, subkey) => this.setState({menu: [...this.state.menu].map( (x,i) => i===key ? {...x, children: x.children.map((y,ix) => ix === subkey ? {...y, free: !y.free, isFakeContent: false} : y)} : x) })
  changePrice = (e, key, subkey) => this.setState({menu: [...this.state.menu].map( (x,i) => i===key ? {...x, children: x.children.map((y,ix) => ix === subkey ? {...y, price: e.target.value, isFakeContent: false} : y)} : x) })
  changeAge = (e, key, subkey, isBottom=true) => this.setState({menu: [...this.state.menu].map( (x,i) => i===key ? {...x, children: x.children.map((y,ix) => ix === subkey ? {...y, [isBottom ? "bottomValue" : "topValue"]: (e.target.value || "").replace(/\D/g, ''), isFakeContent: false} : y)} : x) })
  setMarkers = (markers, key, subkey) => this.setState({menu: [...this.state.menu].map( (x,i) => i===key ? {...x, children: x.children.map((y,ix) => ix === subkey ? {...y, markers: markers, isFakeContent: false} : y)} : x) })

  startFirstJoyRide = () => this.setState({showDispositifCreateModal: false, runJoyRide: true});
  startJoyRide = (idx = 0) => this.setState({runJoyRide: true, stepIndex:idx});

  toggleHelp = () => this.setState(prevState=>({withHelp:!prevState.withHelp}))

  bookmarkDispositif = () => {
    this.setState({showSpinnerBookmark:true})
    if(API.isAuth()){
      if(this.state.pinned){
        user.cookies.dispositifsPinned = user.cookies.dispositifsPinned.filter(x => x._id !== this.state.dispositif._id)
      }else{
        user.cookies.dispositifsPinned=[...(user.cookies.dispositifsPinned || []), {...this.state.dispositif, pinned:true, datePin: new Date()}];
      }
      API.set_user_info(user).then(() => {
        this.props.fetch_user();
        this.setState(pS=>({
          showSpinnerBookmark: false,
          showBookmarkModal: !pS.pinned,
          pinned: !pS.pinned,
          isAuth: true,
        }))
      })
    }else{
      this.setState(pS=>({
        showBookmarkModal: !pS.pinned,
        isAuth: false,
      }))
    }
  }

  changeCardTitle = (key, subkey, node, value) => {
    const prevState = [...this.state.menu];
    if(node==="title"){
      prevState[key].children[subkey] = [...menu[1].children, importantCard].find(x => x.title === value);
    }else{
      prevState[key].children[subkey][node]=value;
    }
    this.setState({ menu: prevState });
  }

  changeTag = (key, value) => {
    this.setState({ 
      tags: this.state.tags.map((x,i)=> i===key ? value : x), 
      ...(key===0 && {mainTag: filtres.tags.find( x => x.short === value.short) } ) 
    }, () => {
      if(key===0){ this.setColors(); }
    });
  }

  addTag = () => this.setState({ tags: [...(this.state.tags || []), 'Autre'] });
  deleteTag = (idx) => this.setState({ tags: [...this.state.tags].filter((_,i) => i!==idx) });

  handleJoyrideCallback = data => {
    const { action, index, type, lifecycle, status } = data;
    const etapes_tuto = this.state.typeContenu === "demarche" ? tutoStepsDemarche : tutoSteps;
    const trigger_lower = this.state.typeContenu === "demarche" ? 2 : 3, trigger_upper = this.state.typeContenu === "demarche" ? 5 : 7;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status) || (action === ACTIONS.CLOSE  && type === EVENTS.STEP_AFTER)) {
      this.setState({ runJoyRide: false, disableOverlay: false });
    }else if(((action === ACTIONS.NEXT && index >= trigger_lower) || index > trigger_lower + 1) && index < trigger_upper && type === EVENTS.STEP_AFTER && lifecycle === "complete"){
      let key = index - trigger_lower + (action === ACTIONS.PREV ? -2 : 0);
      if(this.state.typeContenu === "demarche" && key === 1){ key = 2; }
      this.handleContentClick(key, true, key>1 ? 0 : undefined);
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1); 
      const inputBtnClicked= ((action === ACTIONS.NEXT && index === 2) || (action === ACTIONS.PREV && index===4));
      this.setState({ stepIndex, disableOverlay: index>trigger_lower, inputBtnClicked});
      if(this.state.withHelp && etapes_tuto[stepIndex] && etapes_tuto[stepIndex].target && etapes_tuto[stepIndex].target.includes("#") && document.getElementById(etapes_tuto[stepIndex].target.replace("#", ""))){
        const cible = document.getElementById(etapes_tuto[stepIndex].target.replace("#", ""));
        cible.focus();
        cible.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
      }
    }
  };

  handleFirstJoyrideCallback = data => {
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
      this.setState({ runJoyRide: true, runFirstJoyRide: false });
    }
  };

  addSponsor = sponsor => this.setState({sponsors: [...(this.state.sponsors || []).filter(x => !x.dummy), sponsor]})
  deleteSponsor = key => {
    if(this.state.status === "Accepté structure"){
      Swal.fire( {title: 'Oh non!', text: 'Vous ne pouvez plus supprimer de structures partenaires', type: 'error', timer: 1500}); return;
    }
    this.setState({ sponsors: (this.state.sponsors || []).filter( (_,i) => i !== key) });
  }

  goBack = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'goBack' });
    this.props.history.push("/advanced-search");
  }

  createPdf = () => {
    this.props.tracking.trackEvent({ action: 'click', label: 'createPdf' });
    let uiArray = [...this.state.uiArray];
    uiArray = uiArray.map(x => ({ ...x, accordion : true,  ...(x.children && {children : x.children.map(y => { return { ...y, accordion : true } }) }) }));
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

  editDispositif = (_ = null, disableEdit = false) => this.setState(pS => ({
    disableEdit: disableEdit, 
    uiArray:  pS.menu.map((x,i) => ({
      ...uiElement, 
      ...(pS.uiArray.length > i && {varianteSelected: pS.uiArray[i].varianteSelected}), 
      ...( x.children && {
        children: x.children.map((_, j) => ({
          ...uiElement, 
          ...(pS.uiArray.length > i && pS.uiArray[i] && pS.uiArray[i].children && pS.uiArray[i].children.length > j && {
            varianteSelected: pS.uiArray[i].children[j].varianteSelected
          }),
          accordion: !disableEdit, 
        })
      )}
    )}
  )) }), ()=>this.setColors())

  pushReaction = (modalName=null, fieldName) => {
    if(modalName){this.toggleModal(false, modalName);}
    const dispositif = {
      dispositifId: this.state._id,
      keyValue: this.state.tKeyValue, 
      subkey: this.state.tSubkey,
      fieldName: fieldName,
      type:'push',
      ...(this.state.suggestion && {suggestion: h2p(this.state.suggestion)})
    }
    API.update_dispositif(dispositif).then(data => {
      if(modalName === 'reaction'){
        Swal.fire( {title: 'Yay...', text: 'Votre réaction a bien été enregistrée, merci', type: 'success', timer: 1500})
      }else if(API.isAuth()){
        Swal.fire( {title: 'Yay...', text: 'Votre suggestion a bien été enregistrée, merci', type: 'success', timer: 1500})
      }else{
        this.toggleModal(true, 'merci');
      }
    })
  }

  update_status = status => {
    let dispositif = {
      status:status,
      dispositifId:this.state._id
    }
    API.add_dispositif(dispositif).then((data) => {
      this.props.fetch_dispositifs();
      this.setState({status: status, disableEdit: status !== "Accepté structure"})
      if(status==="Rejeté structure"){
        this.props.history.push("/backend/user-dash-structure");
      }
    });
  }

  valider_dispositif = (status='En attente') => {
    if(!this.verifierDemarche()){return};
    this.setState({isDispositifLoading: true});
    let content = {...this.state.content};
    const uiArray = {...this.state.uiArray}, inVariante= this.state.inVariante;
    Object.keys(content).map( k => content[k] = h2p(content[k]));
    let dispositif = {
      ...content,
      contenu : [...this.state.menu].map((x, i)=> ({
        title: x.title, 
        ...({content : x.editable && x.editorState && x.editorState.getCurrentContent() && x.editorState.getCurrentContent().getPlainText() !== '' ? draftToHtml(convertToRaw(x.editorState.getCurrentContent())) : x.content}), 
        ...(inVariante && {isVariante: _.get(uiArray, `${i}.varianteSelected`)}),
        editable: false,
        type:x.type, 
        ...(x.children && {children : x.children.map((y,j) => ({
          ...y, 
          ...(y.editable && y.editorState && y.editorState.getCurrentContent() && y.editorState.getCurrentContent().getPlainText() !== '' && { content: draftToHtml(convertToRaw(y.editorState.getCurrentContent())) } ),
          ...(inVariante && {isVariante: _.get(uiArray, `${i}.children.${j}.varianteSelected`)}),
          editable: false, 
          ...(y.title && {title: h2p(y.title)} )
        }))}) 
      })),
      sponsors:(this.state.sponsors || []).filter(x => !x.dummy),
      tags: this.state.tags,
      avancement: 1,
      status: status,
      typeContenu: this.state.typeContenu,
      ...(this.state.inVariante ? {demarcheId: this.state._id} : {dispositifId: this.state._id}),
      ...(!this.state._id && this.state.status!=="Brouillon" && {timeSpent : this.state.time}),
    }
    if(dispositif.typeContenu === "dispositif"){
      let cardElement=(this.state.menu.find(x=> x.title==='C\'est pour qui ?') || []).children || [];
      dispositif.audience = cardElement.some(x=> x.title==='Public visé') ?
        cardElement.filter(x=> x.title==='Public visé').map(x => x.contentTitle) :
        filtres.audience;
      dispositif.audienceAge= cardElement.some(x=> x.title==='Âge requis') ? 
        cardElement.filter(x=> x.title==='Âge requis').map(x => ({contentTitle: x.contentTitle, bottomValue: x.bottomValue, topValue:x.topValue})) :
        [{contentTitle: "Plus de ** ans", bottomValue: -1, topValue: 999}];
      dispositif.niveauFrancais= cardElement.some(x=> x.title==='Niveau de français') ?
        cardElement.filter(x=> x.title==='Niveau de français').map(x => x.contentTitle) :
        filtres.niveauFrancais;
      dispositif.cecrlFrancais= cardElement.some(x=> x.title==='Niveau de français') ?
        [...new Set(cardElement.filter(x=> x.title==='Niveau de français').map(x => x.niveaux).reduce((acc, curr) => [...acc, ...curr]))] :
        [];
      dispositif.isFree= cardElement.some(x=> x.title==='Combien ça coûte ?') ?
        cardElement.find(x=> x.title==='Combien ça coûte ?').free :
        true;
    }else{dispositif.variantes = this.state.variantes; delete dispositif.titreMarque;}
    dispositif.mainSponsor = ((dispositif.sponsors || [{}])[0] || {})._id;
    if(this.state.status && this.state.status!== '' && this.state._id && this.state.status!=="En attente non prioritaire" && !inVariante && this.state.status !== "Brouillon" && status !== "Brouillon"){
      dispositif.status = this.state.status;
    }else if(dispositif.sponsors &&  dispositif.sponsors.length > 0){
      //Si l'auteur appartient à la structure principale je la fait passer directe en validation
      const membre = (dispositif.sponsors[0].membres || []).find(x => x.userId === this.props.userId);
      if(membre && membre.roles && membre.roles.some(x => x==="administrateur" || x==="contributeur")){
        dispositif.status = "En attente admin";
      }
    }else{
      dispositif.status = "En attente non prioritaire";
    }
    console.log(dispositif)
    API.add_dispositif(dispositif).then((data) => {
      Swal.fire( 'Yay...', 'Enregistrement réussi !', 'success').then(() => {
        this.props.fetch_user();
        this.props.fetch_dispositifs();
        this.setState({disableEdit: ['En attente admin', 'En attente', "En attente non prioritaire", "Brouillon", "Actif"].includes(status), isDispositifLoading: false}, () => {
          this.props.history.push("/" + dispositif.typeContenu + "/" + data.data.data._id)
        })
      });
    })
  }

  upcoming = () => Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore disponible', type: 'error', timer: 1500 })

  render(){
    const {t, translating} = this.props;
    const {showModals, isDispositifLoading, typeContenu, runJoyRide, stepIndex, disableOverlay, joyRideWidth, 
      withHelp, disableEdit, mainTag, fiabilite, inVariante} = this.state;
    const etapes_tuto = typeContenu === "demarche" ? tutoStepsDemarche : tutoSteps;
    
    const Tooltip = ({
      index,
      step,
      backProps,
      primaryProps,
      tooltipProps,
      closeProps,
      isLastStep
    }) => {
      if(step){ return (
      <div
        key="JoyrideTooltip"
        className="tooltip-wrapper custom-tooltip" 
        style={{width: joyRideWidth + "px", /*backgroundColor: mainTag.darkColor,*/ marginRight: "40px"}}
        {...tooltipProps}>
        <div className="tooltipContainer">
          <b>{step.title}</b> : {step.content}
        </div>
        <div className="tooltipFooter">
          <ul className="nav nav-tabs" role="tablist">
            {etapes_tuto.map((_,idx) => (
              <li role="presentation" className={idx <= stepIndex ? "active" : "disabled"} key={idx}>
                <span className="round-tab" />
              </li>
            ))}
          </ul>
          {index > 0 && 
            <FButton onMouseEnter={e => e.target.focus()} type="pill" className="mr-10" name="arrow-back-outline" fill="#FFFFFF" {...backProps} /> }
          <FButton
            onMouseEnter={e => e.target.focus()} 
            {...primaryProps}>
            {isLastStep ? 
              <span>Terminer</span> : 
              <span>
                Suivant
                <EVAIcon name="arrow-forward-outline" fill={variables.grisFonce} className="ml-10" />
              </span>}
          </FButton>
        </div>
        <EVAIcon onMouseEnter={e => e.currentTarget.focus()} {...closeProps} name="close-outline" className="close-icon" />
      </div>
    )}else{return false}};

    return(
      <div className={"animated fadeIn dispositif" + (!disableEdit ? " edition-mode" : translating ? " side-view-mode" : " reading-mode")} ref={this.newRef}>
        {/* Second guided tour */}
        <ReactJoyride
          continuous
          steps={etapes_tuto}
          run={!disableEdit && withHelp && runJoyRide}
          showProgress
          disableOverlay={disableOverlay}
          disableOverlayClose={true}
          spotlightClicks={true}
          callback={this.handleJoyrideCallback}
          stepIndex={stepIndex}
          tooltipComponent={Tooltip}
          debug={false}
          styles={{
            options: {
              arrowColor: mainTag.darkColor
            },
          }}
          joyRideWidth={joyRideWidth}
          mainTag={mainTag}
        />

        <Row className="main-row">
          {translating && 
            <Col lg={translating ? "4" : "0"} md={translating ? "4" : "0"} sm={translating ? "4" : "0"} xs={translating ? "4" : "0"} className="side-col">
              <SideTrad 
                menu={this.state.menu}
                content={this.state.content}
                updateUIArray={this.updateUIArray}
                {...this.props}
              />
            </Col>}
          <Col lg={translating ? "8" : "12"} md={translating ? "8" : "12"} sm={translating ? "8" : "12"} xs={translating ? "8" : "12"} className="main-col">
            <section className="banniere-dispo" style={mainTag && mainTag.short && {backgroundImage: `url(${bgImage(mainTag.short)})`}}>
              {inVariante &&
                <BandeauEdition
                  menu={this.state.menu}
                  uiArray={this.state.uiArray}
                  withHelp={withHelp}
                  disableEdit={disableEdit}
                  editDispositif={this.editDispositif}
                  upcoming={this.upcoming}
                  toggleDispositifValidateModal={this.toggleDispositifValidateModal}
                  valider_dispositif={this.valider_dispositif}
                  toggleHelp={this.toggleHelp}
                />}

              <Row className="header-row">
                <Col lg="6" md="6" sm="12" xs="12" className="top-left" onClick={this.goBack}>
                  <FButton type="light-action" name="arrow-back" className="btn-retour">
                    <span>{t("Retour à la recherche", "Retour à la recherche")}</span>
                  </FButton>
                </Col>
                {!inVariante &&
                  <TopRightHeader 
                    validateStructure={false}
                    disableEdit={this.state.disableEdit} 
                    withHelp={this.state.withHelp}
                    showSpinnerBookmark={this.state.showSpinnerBookmark}
                    pinned={this.state.pinned}
                    isAuthor={this.state.isAuthor}
                    status={this.state.status}
                    mainSponsor={this.state.mainSponsor}
                    userId={this.props.userId}
                    update_status={this.update_status}
                    bookmarkDispositif={this.bookmarkDispositif}
                    toggleHelp={this.toggleHelp}
                    toggleModal={this.toggleModal}
                    toggleDispositifValidateModal={this.toggleDispositifValidateModal}
                    editDispositif = {this.editDispositif}
                    valider_dispositif={this.valider_dispositif}
                    toggleDispositifCreateModal={this.toggleDispositifCreateModal}
                    admin={this.props.admin}
                    translating={translating} />}
              </Row>
              <Col lg="12" md="12" sm="12" xs="12" className="post-title-block">
                <div className="bloc-titre">
                  <h1 className={disableEdit ? "" : "editable"}>
                    <ContentEditable
                      id='titreInformatif'
                      html={this.state.content.titreInformatif}  // innerHTML of the editable div
                      disabled={disableEdit || inVariante}
                      onClick={e=> {if(!disableEdit && !inVariante){this.startJoyRide(); this.onInputClicked(e)}}}
                      onChange={this.handleChange}
                      onMouseEnter={e => e.target.focus()} 
                      onKeyPress={e=> this.handleKeyPress(e, 0)}
                    />
                  </h1>
                  {typeContenu === "dispositif" &&
                    <h2 className="bloc-subtitle">
                      <span>{t("avec", "avec")}&nbsp;</span>
                      <ContentEditable
                        id='titreMarque'
                        html={this.state.content.titreMarque}  // innerHTML of the editable div
                        disabled={this.state.disableEdit}
                        onClick={e=>{this.startJoyRide(1); this.onInputClicked(e)}}
                        onChange={this.handleChange} 
                        onKeyDown={this.onInputClicked}
                        onMouseEnter={e => e.target.focus()} 
                        onKeyPress={e=>this.handleKeyPress(e, 1)}
                      />
                    </h2>}
                </div>
              </Col>
            </section>
            
            {!inVariante && 
              <Row className="tags-row backgroundColor-darkColor">
                <Col lg="8" md="8" sm="8" xs="8" className="col right-bar">
                  {(disableEdit || typeContenu !== "demarche") &&
                    <Row>
                      <b className="en-bref mt-10">{t("En bref", "En bref")} </b>
                      {((this.state.menu.find(x=> x.title==='C\'est pour qui ?') || []).children || []).map((card, key) => {
                        if(card.type==='card'){
                          let texte = card.contentTitle;
                          if(card.title==='Âge requis'){
                            texte = (card.contentTitle === 'De ** à ** ans') ? 'De ' + card.bottomValue + ' à ' + card.topValue + ' ans' :
                                                (card.contentTitle === 'Moins de ** ans') ? 'Moins de ' + card.topValue + ' ans' :
                                                'Plus de ' + card.bottomValue + ' ans';
                          }else if(card.title === 'Combien ça coûte ?'){
                            texte = card.free ? "gratuit" : (card.price + " € " + card.contentTitle)
                          }
                          return (
                            <div className="tag-wrapper" key={key}>
                              <div className="tag-item">
                                <a href={'#item-head-1'} className="no-decoration">
                                  {card.typeIcon==="eva" ?
                                    <EVAIcon name={card.titleIcon} fill="#FFFFFF"/> :
                                    <SVGIcon fill="#FFFFFF" width="20" height="20" viewBox="0 0 25 25" name={card.titleIcon} />}
                                  <span>{h2p(texte)}</span>
                                </a>
                              </div>
                            </div>
                          )
                        }else{return false}
                      })}
                    </Row>}
                </Col>
                <Col lg="4" md="4" sm="4" xs="4" className="tags-bloc">
                  <Tags tags={this.state.tags} filtres={filtres.tags} disableEdit={this.state.disableEdit} changeTag={this.changeTag} addTag={this.addTag} deleteTag={this.deleteTag} history={this.props.history} />
                </Col>
              </Row>}
            
            <Row className="no-margin-right">
              <Col xl="3" lg="3" md="12" sm="12" xs="12" className={"left-side-col pt-40" + (translating ? " sideView" : "")}>
                <LeftSideDispositif
                  menu={this.state.menu}
                  accordion={this.state.accordion}
                  showSpinner={this.state.showSpinnerPrint}
                  content={this.state.content}
                  inputBtnClicked = {this.state.inputBtnClicked}
                  disableEdit = {this.state.disableEdit}
                  toggleInputBtnClicked={this.toggleInputBtnClicked}
                  handleScrollSpy={this.handleScrollSpy}
                  createPdf={this.createPdf}
                  newRef={this.newRef}
                  handleChange = {this.handleChange}
                  typeContenu={typeContenu}
                />
              </Col>
              {inVariante && disableEdit && 
                <Col className="variante-col">
                  <div className="radio-btn" />
                </Col>}
              <Col xl={translating ? "12" : "7"} lg={translating ? "12" : "7"} md={translating ? "12" : "10"} sm={translating ? "12" : "10"} xs={translating ? "12" : "10"} className="pt-40 col-middle">
                {disableEdit && !inVariante && 
                  <Row className="fiabilite-row">
                    <Col lg="auto" md="auto" sm="auto" xs="auto" className="col align-right">
                      {t("Dernière mise à jour", "Dernière mise à jour")} :&nbsp;<span className="date-maj">{moment(this.state.dateMaj).format('ll')}</span>
                    </Col>
                    <Col className="col">
                      {t("Fiabilité de l'information", "Fiabilité de l'information")} :&nbsp;<span className={"fiabilite color-" + (fiabilite > 0.5 ? "vert" : fiabilite > 0.2 ? "orange" : "rouge")}>{t(fiabilite > 0.5 ? "Forte" : fiabilite > 0.2 ? "Moyenne" : "Faible")}</span>
                      <EVAIcon className="question-bloc" id="question-bloc" name="question-mark-circle" fill={variables[fiabilite > 0.5 ? "validationHover" : fiabilite > 0.2 ? "orange" : "error"]}  onClick={()=>this.toggleModal(true, 'fiabilite')} />
                      
                      <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="question-bloc" toggle={this.toggleTooltip} onClick={()=>this.toggleModal(true, 'fiabilite')}>
                        <span className="texte-small ml-10" dangerouslySetInnerHTML={{ __html: t("Dispositif.fiabilite_faible", "Une information avec une <b>faible</b> fiabilité n'a pas été vérifiée auparavant") }} />
                        {t("Dispositif.cliquez", "Cliquez sur le '?' pour en savoir plus")}
                      </Tooltip>
                    </Col>
                  </Row>}

                {typeContenu === "demarche" && !(disableEdit && inVariante) && 
                  <MoteurVariantes 
                    itemId={this.state._id}
                    disableEdit={disableEdit}
                    inVariante={inVariante}
                    validateVariante={this.validateVariante} 
                    deleteVariante={this.deleteVariante}
                    filtres={filtres}
                    upcoming={this.upcoming}
                    switchVariante={this.switchVariante}
                    variantes = {this.state.variantes}
                    allDemarches={this.state.allDemarches}
                    search={this.state.search} />}

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
                  toggleNiveau={this.toggleNiveau}
                  changeAge = {this.changeAge}
                  changePrice={this.changePrice}
                  toggleFree = {this.toggleFree}
                  setMarkers = {this.setMarkers}
                  filtres={filtres}
                  sideView={translating}
                  readAudio={this.readAudio}
                  demarcheSteps={demarcheSteps}
                  upcoming={this.upcoming}
                  {...this.state}
                />
                
                {this.state.disableEdit && !inVariante &&
                  <>
                    <div className="feedback-footer">
                      <div>
                        <h5 className="color-darkColor">{t("Dispositif.informations_utiles", "Vous avez trouvé des informations utiles ?")}</h5>
                        <span className="color-darkColor">{t("Dispositif.remerciez", "Remerciez les contributeurs qui les ont rédigé pour vous")}&nbsp;:</span>
                      </div>
<<<<<<< Updated upstream
                      <div className="negative-margin">
                        <Button color="light" className="thanks-btn mt-10" onClick={()=>this.pushReaction(null, "merci")}>
                          {t("Merci", "Merci")} <span role="img" aria-label="merci">🙏</span>
                        </Button>
                        <Button color="light" className="down-btn mt-10" onClick={()=>this.pushReaction(null, "pasMerci")}>
=======
                      <div>
                        <Button color="light" className="thanks-btn color-darkColor" onClick={()=>this.pushReaction(null, "merci")}>
                          {t("Merci", "Merci")}
                        </Button>
                        {/*<Button color="light" className="down-btn" onClick={()=>this.pushReaction(null, "pasMerci")}>
>>>>>>> Stashed changes
                          <span role="img" aria-label="merci">👎</span>
                         </Button>*/}
                      </div>
                    </div>
                    <div className="discussion-footer backgroundColor-darkColor">
                      <h5>{t("Dispositif.Avis", "Avis et discussions")}</h5>
                      <span>{t("Bientôt disponible !", "Bientôt disponible !")}</span>
                    </div>
                    {this.state.contributeurs.length>0 && 
                      <div className="bottom-wrapper">
                        <ContribCaroussel 
                          contributeurs={this.state.contributeurs}
                        />

                        {!this.state.disableEdit &&
                          <div className="ecran-protection">
                            <div className="content-wrapper">
                              <Icon name="alert-triangle-outline" fill="#FFFFFF" />
                              <span>Ajout des contributeurs <u className="pointer" onClick={()=>this.toggleModal(true, 'construction')}>disponible prochainement</u></span>
                            </div>
                          </div>}
                      </div>}
                  </>
                }

                <Sponsors 
                  sponsors={this.state.sponsors} 
                  disableEdit={disableEdit}
                  addSponsor = {this.addSponsor}
                  deleteSponsor={this.deleteSponsor}
                  t={t}  />

                {false && <Commentaires />}
              </Col>
              <Col xl="2" lg="2" md="2" sm="2" xs="2" className={"aside-right pt-40" + (translating ? " sideView" : "")} />
            </Row>
            
            <ReagirModal name='reaction' show={showModals.reaction} toggleModal={this.toggleModal} onValidate={this.pushReaction} />
            <SuggererModal showModals={showModals} toggleModal={this.toggleModal} onChange={this.handleModalChange} suggestion={this.state.suggestion} onValidate={this.pushReaction} />
            <MerciModal name='merci' show={showModals.merci} toggleModal={this.toggleModal} onChange={this.handleModalChange} mail={this.state.mail} />
            <EnConstructionModal name='construction' show={showModals.construction} toggleModal={this.toggleModal} />
            <ResponsableModal name='responsable' show={showModals.responsable} toggleModal={this.toggleModal} createur={this.state.creator} mainSponsor={this.state.mainSponsor} editDispositif={this.editDispositif} update_status={this.update_status} />

            <Modal isOpen={this.state.showModals.fiabilite} toggle={()=>this.toggleModal(false, 'fiabilite')} className='modal-fiabilite'>
              <h1>{t("Dispositif.fiabilite", "Fiabilité de l’information")}</h1>
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
              success={this.state.isAuth}
              show={this.state.showBookmarkModal}
              toggle={this.toggleBookmarkModal}
            />
            <DispositifCreateModal 
              show={this.state.showDispositifCreateModal}
              toggle={this.toggleDispositifCreateModal}
              typeContenu={typeContenu}
              startFirstJoyRide={this.startFirstJoyRide}
              onBoardSteps={onBoardSteps}
            />
            <DispositifValidateModal
              show={this.state.showDispositifValidateModal}
              toggle={this.toggleDispositifValidateModal} 
              abstract={this.state.content.abstract} 
              onChange={this.handleChange}
              validate={this.valider_dispositif}
            />
            <VarianteCreateModal
              titreInformatif={this.state.content.titreInformatif}
              show={showModals.variante}
              toggle={()=>this.toggleModal(false, 'variante')}
              upcoming={this.upcoming}
            />

            {isDispositifLoading &&
              <div className="ecran-protection no-main">
                <div className="content-wrapper">
                  <h1 className="mb-3">{t("Chargement", "Chargement")}...</h1>
                  <Spinner color="success" />
                </div>
              </div>}

          </Col>
        </Row>
      </div>
    );
  }
}

const calculFiabilite = dispositif => {
  let score = 0;
  if(dispositif.status ===  "Actif"){score = 1};
  const nbMoisAvantMaJ = (new Date().getTime() -  new Date(dispositif.updatedAt).getTime()) / (1000 * 3600 * 24 * 30);
  const nbMoisEntreCreationEtMaj = (new Date(dispositif.updatedAt).getTime() -  new Date(dispositif.created_at).getTime()) / (1000 * 3600 * 24 * 30);
  const hasSponsor = dispositif.sponsors && dispositif.sponsors.length > 0 && dispositif.sponsors[0] && dispositif.sponsors[0]._id ? true : false;
  const nbMots = dispositif.nbMots;
  const nbLangues = Object.keys(dispositif.avancement || {}).length || 1;
  const nbTags = (dispositif.tags || []).length;
  const tagAutreExist = (dispositif.tags || []).includes("Autre");
  const hasExternalLink = dispositif.externalLink ? true : false;
  // nbSections Seulement pour le calcul 
  const nbSections = dispositif.contenu.length + dispositif.contenu.reduce((acc, curr) => acc += curr.children && curr.children.length > 1 ? curr.children.length : 0, 0);
  const nbSectionsSansContenu = (dispositif.contenu.filter(x => (!x.content || x.content === "" || x.content === "null") && (!x.children || x.children.some(y => !y.title || (!y.content && !y.contentTitle) ))) || []).length;
  const nbFakeContent = (dispositif.contenu.filter(x => x.isFakeContent) || []).length + dispositif.contenu.reduce((acc, curr) => acc += curr.children && curr.children.length > 1 ? (curr.children.filter(x => x.isFakeContent) || []).length : 0, 0)
  const nbAddedChildren = nbSections - menu.length - menu.reduce((acc, curr) => acc += curr.children && curr.children.length > 1 ? curr.children.length : 0, 0)
  const hasMap = dispositif.contenu.some(x => x.children && x.children.length > 0 && x.children.some(y => y.type==="map" && y.markers && y.markers.length > 0))

  score = score * (1 - (Math.min(3, nbMoisAvantMaJ) / 3)) //Dernière mise à jour date de moins de 3 mois
    * ( Math.min(6, nbMoisEntreCreationEtMaj + 1) / 6 )   //Doit avoir été créé au moins 6 mois depuis la dernière mise à jour
    * (1 - 0.1 * !hasSponsor)                             //10% de pénalité si pas de sponsor
    * ( Math.min(100, nbMots) / 100 )                     //Au moins 100 mots
    * ( Math.min(5, nbLangues) / 5 )                      // Doit être traduit en au moins 5 langues
    * ( Math.max(Math.min(nbTags,2), 1) / 2 )             // Doit avoir au moins 2 tags
    * (1 - 0.1 * tagAutreExist)                           // 10% de pénalité si le tag "Autres" est mis
    * (1 + 0.1 * hasExternalLink)                         // 10% de bonus si de lien externe
    * (1 - nbSectionsSansContenu / menu.length)           // Grosse pénalité si une section n'a pas de contenu dessus
    * (1 - nbFakeContent / (2 * nbSections))              // Si un contenu est laissé sans modification, on sanctionne à 50%
    * (1 + Math.min(nbAddedChildren, 30) / (2 * 30))      // On rajoute un bonus jusqu'à 50% si du contenu original est créé
    * (1 + 0.1 * hasMap);                                 // 10% de bonus si une map est créée
  // console.log(score, dispositif, nbMoisAvantMaJ, nbMoisEntreCreationEtMaj, 
  //   hasSponsor, nbMots, nbLangues, nbTags, tagAutreExist, hasExternalLink,
  //   nbSectionsSansContenu, nbFakeContent, nbAddedChildren, hasMap, nbSections)
  console.log(score)
  return score;
  //Nouvelles idées: nombre de suggestions, merci etc
}

function bgImage(short) {
  const imageUrl = require("../../assets/figma/illustration_" + short.split(" ").join("-") + ".svg") //illustration_
  return imageUrl
}

const mapStateToProps = (state) => {
  return {
    languei18nCode: state.langue.languei18nCode,
    user: state.user.user,
    userId: state.user.userId,
    admin: state.user.admin,
  }
}

const mapDispatchToProps = {fetch_dispositifs, fetch_user};

export default track({
    page: 'Dispositif',
  })(
    connect(mapStateToProps, mapDispatchToProps)(
      withTranslation()(Dispositif)
    )
  );