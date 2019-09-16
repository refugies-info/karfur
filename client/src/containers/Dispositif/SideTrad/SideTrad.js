import React, {Component} from 'react';
import ReactHtmlParser from 'react-html-parser';
import { Spinner, Tooltip, ListGroup, ListGroupItem } from 'reactstrap';
import { connect } from 'react-redux';  
import Swal from 'sweetalert2';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import h2p from 'html2plaintext';
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

import FButton from '../../../components/FigmaUI/FButton/FButton';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import {boldBtn, italicBtn, underBtn, listBtn} from '../../../assets/figma/index';
import marioProfile from '../../../assets/mario-profile.jpg';
import { RejectTradModal } from '../../../components/Modals';

import './SideTrad.scss';
import variables from 'scss/colors.scss';
import API from '../../../utils/API';

const pointeurs = [ "titreInformatif", "titreMarque", "abstract"];

class SideTrad extends Component {
  state= {
    currIdx: "titreInformatif",
    currSubIdx: -1,
    currSubName: "content",
    hasBeenSkipped: false,
    tooltipOpen: false,
    tooltipScoreOpen: false,
    listTrad: [],
    selectedTrad:{},
    score: 0,
    userId:{},
    showModals:{
      rejected:false,
    },
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.content.titreInformatif !== this.props.content.titreInformatif || nextProps.traductionsFaites !== this.props.traductionsFaites){
      this._initializeComponent(nextProps);
    }
  }

  _initializeComponent = async props => {
    if(props.content && props.content.titreInformatif !== "Titre informatif" && props.fwdSetState && props.translate){
      props.fwdSetState(() => ({francais: {body: props.content.titreInformatif} }), ()=> this.checkTranslate(props.locale));
      this._scrollAndHighlight("titreInformatif");
    }
    window.scrollTo(0, 0);
  }

  goChange = (isNext=true, fromFn=true) => {
    if(isNext && fromFn){this.setState({hasBeenSkipped: true})}
    if(this.state.currIdx > this.props.menu.length - 1){this._endingFeedback(); return;}
    const oldP = pointeurs.findIndex(x => this.state.currIdx === x);
    console.log(oldP)
    if( (oldP > (- 1 + (isNext ? 0 : 1)) && oldP < pointeurs.length - (isNext ? 1 : 0))
        || (!isNext && this.state.currIdx === 0 && this.state.currSubIdx === -1 && this.state.currSubName === "content") ){
      this.setState({currIdx: pointeurs[oldP + (isNext ? 1 : this.state.currIdx === 0 ? pointeurs.length : -1)]}, () => {
        this.props.fwdSetState(() => ({francais: {body: this.props.content[ pointeurs[oldP + (isNext ? 1 : this.state.currIdx === 0 ? pointeurs.length : -1)] ]} }), ()=> this.checkTranslate(this.props.locale))
        this._scrollAndHighlight(this.state.currIdx);
      })
    }else{
      let idx = -1, subidx = -1, subname = "";
      if( (isNext && oldP === pointeurs.length - 1) 
          || (!isNext && this.state.currIdx === 0 && this.state.currSubIdx === -1 && this.state.currSubName === "content") ){
        idx = isNext ? 0 : pointeurs[pointeurs.length - 1];
        subidx = -1;
        subname = "content";
      }else if(!isNext && this.state.currSubIdx === -1 && this.state.currSubName === "title"){
        idx = this.state.currIdx - 1;
        subidx = this.props.menu[idx].children.length - 1;
        subname = "content";
      }else if( (isNext && this.state.currSubIdx >= this.props.menu[this.state.currIdx].children.length - 1 && this.state.currSubName === "content" )
                || (!isNext && this.state.currSubIdx <= 0 && this.state.currSubName === "title") ){
        idx = this.state.currIdx + (isNext ? 1 : 0);
        subidx = -1;
        subname = "content";
      }else{
        idx = this.state.currIdx;
        if(this.state.currSubName === "title"){
          subidx = this.state.currSubIdx + (isNext ? 0 : -1);
          subname="content";
        }else{
          subidx = this.state.currSubIdx + (isNext ? 1 : 0);
          subname = "title";
        }
      }
      this.setState({currIdx: idx, currSubIdx: subidx, currSubName: subname}, () => {
        let value = "";
        console.log('ici', idx, subidx, subname)
        if(idx > this.props.menu.length - 1){
          console.log('la')
          this._endingFeedback();
          return;
        }else if(subidx > -1 && this.props.menu[idx].type === "cards"){
          console.log('la 1')
          if(this.props.menu[idx].children[subidx][subname] === "Important !"){
            subname = "contentTitle";
            value = this.props.menu[idx].children[subidx].contentTitle;
          }
        }else{
          value = subidx > -1 ? this.props.menu[idx].children[subidx][subname] : this.props.menu[idx].content;
          console.log('la 2', this.props.menu[idx].content, h2p(value))
        }
        if(!value || h2p(value) === "" || h2p(value) === "undefined" || h2p(value) === "null"){this.goChange(isNext, false); return;}
        this._scrollAndHighlight(idx, subidx, subname);
        this.props.fwdSetState(() => ({francais: {body: value } }), ()=> this.checkTranslate(this.props.locale));
      })
    }
  }

  _endingFeedback = () => {
    if(!this.state.hasBeenSkipped){
      if(this.props.isExpert){
        this._insertTrad(); //On insère cette traduction
      }else{
        Swal.fire( 'Yay...', 'Ce dispositif est maintenant intégralement traduit et sera transmis à l\'expert pour validation', 'success').then(()=>{
          // this.onSkip();
        });
      }
    } 
  }

  _scrollAndHighlight = (idx, subidx = -1, subname = "") => {
    if(subidx > -1 && subname === "content" && this.props.menu[idx].children[subidx].type == "accordion"){
      this.props.updateUIArray(idx, subidx, 'accordion', true)
    }
    Array.from(document.getElementsByClassName("translating")).forEach(x => {x.classList.remove("translating")}); //On enlève le surlignage des anciens éléments
    const elems = document.querySelectorAll('div[id="' + idx + '"]' + (subidx && subidx > -1 ? '[data-subkey="' + subidx + '"]' : '') + (subname && subname !== "" ? '[data-target="' + subname + '"]' : ''));
    if(elems.length > 0){
      const elem = elems[0];
      elem.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
      elem.classList.toggle("translating"); //On le surligne 
    }
  }

  checkTranslate = target => {
    const text = this.initial_text.innerHTML, item = 'body';
    //On vérifie si une traduction n'a pas déjà été validée
    const pos = pointeurs.findIndex(x => this.state.currIdx === x), {isExpert, traductionsFaites} = this.props;
    let oldTrad = "", listTrad = [], score= 0, userId={}, selectedTrad={};
    if(isExpert){
      listTrad = ((traductionsFaites || []).map(x => {
        let newValue = x.translatedText || {}, scoreArr= {};
        if(pos > -1){
          scoreArr = newValue.scoreHeaders[this.state.currIdx] || {};
          newValue = newValue[this.state.currIdx];
        }else{
          newValue = newValue.contenu[this.state.currIdx] ;
          if(this.state.currSubIdx > -1 && newValue && newValue.children){
            newValue = newValue.children[this.state.currSubIdx];
          }
          scoreArr = newValue["score" + this.state.currSubName] || {};
          newValue = newValue[this.state.currSubName];
        }
        return ({value: newValue, score: ((scoreArr.cosine || [{}])[0] || [{}])[0], ...x})
      }) || []).sort((a,b) => b.score - a.score);
      if(listTrad && listTrad.length > 0){
        oldTrad = listTrad[0].value; score = listTrad[0].score; userId = listTrad[0].userId;  selectedTrad=listTrad[0];
        listTrad.shift();
      }
    }else{
      if(pos > -1){
        oldTrad = this.props.traduction.translatedText[this.state.currIdx];
      }else{
        oldTrad = this.props.traduction.translatedText.contenu[this.state.currIdx];
        if(this.state.currSubIdx > -1 && oldTrad){
          oldTrad = oldTrad.children[this.state.currSubIdx][this.state.currSubName];
        }else if(oldTrad){
          oldTrad = oldTrad[this.state.currSubName];
        }
      }
    }
    this.setState({listTrad, score, userId, selectedTrad});
    if(oldTrad){
      this.props.fwdSetState({ translated:{ ...this.props.translated, body: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(oldTrad).contentBlocks)) } } )
    }else{
      this.props.translate(text,target,item, true);
    }
  }

  selectTranslation = sugg => {
    const listTrad = (((this.props.traductionsFaites || []).map(x => ({value: (x.translatedText || {})[this.state.currIdx], score: (((((x.translatedText || {}).scoreHeaders || {})[this.state.currIdx] || {}).cosine || [{}])[0] || [{}])[0], ...x})) || []).filter(x => x._id !== sugg._id) || []).sort((a,b) => b.score - a.score);
    const score = sugg.score, userId = sugg.userId, selectedTrad = sugg;
    this.setState({listTrad, score, userId, selectedTrad});
    this.props.fwdSetState({ translated:{ ...this.props.translated, body: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(sugg.value).contentBlocks)) } } );
  }

  toggleTooltip = () => this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen })); 
  toggleTooltipScore = () => this.setState(prevState => ({tooltipScoreOpen: !prevState.tooltipScoreOpen })); 
  reset = () => this.props.translate(this.initial_text.innerHTML, this.props.locale, 'body', true);
  toggleModal = (show, name) => this.setState(prevState=>({showModals:{...prevState.showModals,[name]:show}}))

  _countContents = (obj, nbChamps = 0, type = null) => {
    obj.forEach(x => {
      [...pointeurs, "title", "content"].forEach(p => {
        if(x[p] && x[p] !== "" && x[p] !== "null" && x[p] !== "undefined" && type !== "cards"){ nbChamps += 1; }
      })
      if(type === "cards" && (x.title === "Important !" || !x.title) && x.contentTitle && x.contentTitle !== "" && x.contentTitle !== "null" && x.contentTitle !== "undefined"){ nbChamps += 1; };
      if(x.contenu && x.contenu.length > 0){ nbChamps = this._countContents(x.contenu, nbChamps, x.type); }
      if(x.children && x.children.length > 0){ nbChamps = this._countContents(x.children, nbChamps, x.type); }
    })
    return nbChamps;
  }

  removeTranslation = (translation) => {
    let listTrad = this.state.listTrad.filter(x => x._id !== translation._id), score= 0, userId={}, selectedTrad={},oldTrad="";
    if(listTrad && listTrad.length > 0){
      oldTrad = listTrad[0].value; score = listTrad[0].score; userId = listTrad[0].userId;  selectedTrad=listTrad[0];
      listTrad.shift();
      this.props.fwdSetState({ translated:{ ...this.props.translated, body: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(oldTrad).contentBlocks)) } } )
    }
    this.setState({listTrad, score, userId, selectedTrad});
  }

  onValidate = async () => {
    if(!this.props.translated.body){Swal.fire( 'Oh non', 'Aucune traduction n\'a été rentrée, veuillez rééssayer', 'error'); return;}
    const pos = pointeurs.findIndex(x => this.state.currIdx === x);
    const node = pos > -1 ? this.state.currIdx : "contenu";
    let {currIdx, currSubIdx, currSubName} = this.state;
    if(pos === -1 && currIdx > -1 && currSubIdx > -1 && this.props.menu[currIdx].type === "cards" && this.props.menu[currIdx].children[currSubIdx][currSubName] === "Important !"){
      currSubName = "contentTitle";
    }
    let traduction = {...this.props.traduction};
    ["francais", "translated"].forEach(nom => {
      const initialValue = this.props[nom].body;
      const texte = nom === "francais" ? initialValue : draftToHtml(convertToRaw(initialValue.getCurrentContent()));
      const value = pos > -1 ? h2p(texte) : 
        this.props.traduction[ (nom==="francais" ? "initial" : "translated") + "Text" ].contenu.map((x, i) => (
          i === currIdx ? 
            currSubIdx > -1 ? 
              {...x, children: (x.children || new Array(this.props.menu[currIdx].children.length).fill(false)).map((y,j) => (
                j === currSubIdx ? {...y, [currSubName]: texte} : y
              )), type: this.props.menu[currIdx].type } : 
              {...x, [currSubName]: texte, type: this.props.menu[currIdx].type} :
            x
        ));
      traduction[(nom==="francais" ? "initial" : "translated") + "Text"] = {
        ...this.props.traduction[(nom==="francais" ? "initial" : "translated") + "Text"],
        [node] : value,
      }
    })
    console.log(traduction)
    const nbTraduits = this._countContents([traduction.translatedText]);
    const nbInit = (this._countContents(this.props.menu) + pointeurs.length - this.props.menu.length);
    traduction.avancement = nbTraduits / nbInit;
    traduction.title= this.props.content.titreMarque + " - " + this.props.content.titreInformatif;

    if(this.props.isExpert){
      const {selectedTrad, currIdx} = this.state;
      let newTrad = {
        _id: selectedTrad._id, 
        translatedText: {
          ...selectedTrad.translatedText,
          status:{
            ...(selectedTrad.translatedText.status || {}),
            [currIdx]: "Acceptée"
          },
        }
      }
      await API.update_tradForReview(newTrad).then(data => { console.log(data.data.data); })
    }
    this.props.fwdSetState({traduction}, () => this.props.isExpert ? false : this.props.valider(this.props.traduction));
    this.goChange(true, false);
  }

  _insertTrad = () => {
    console.log(this.props.traduction);
    let newTrad = {...this.props.traduction, articleId: this.props.itemId, type: "dispositif", locale: this.props.locale, traductions: this.props.traductionsFaites};
    API.validate_tradForReview(newTrad).then(data => {
      console.log(data.data.data)
      Swal.fire( 'Yay...', 'Ce dispositif est maintenant intégralement validé et disponible à la lecture', 'success').then(()=>{
        // this.onSkip();
      });
    })
  }

  render(){
    const langue = this.props.langue || {};
    const { francais, translated, isExpert } = this.props;
    const { currIdx, currSubIdx, currSubName, listTrad, score, userId, showModals, selectedTrad } = this.state;

    return(
      <div className="side-trad">
        {!isExpert &&
          <div className="nav-btns">
            {currIdx !== "titreInformatif" &&
              <FButton type="outline-black" name="arrow-back-outline" fill={variables.noir} onClick={()=>this.goChange(false)}>
                Paragraphe précédent
              </FButton>}
            <FButton className="margin-left-auto" type="light-action" onClick={this.goChange}>
              Paragraphe suivant
              <EVAIcon name="arrow-forward-outline" fill={variables.noir} className="ml-10" />
            </FButton>
          </div>}
        <div className="langue-data">
          <i className='flag-icon flag-icon-fr mr-12' title='fr' id='fr'></i>
          <strong>Texte français initial</strong>
          {currIdx === "abstract" && 
            <div className="float-right">
              <b>Résumé</b>
              <EVAIcon className="ml-10" name="info" fill={variables.noir} id="eva-icon-info" />
              <Tooltip placement="top" offset="0px, 8px" isOpen={this.state.tooltipOpen} target="eva-icon-info" toggle={this.toggleTooltip}>
                Ce paragraphe de résumé apparaît dans les résultats de recherche. Il n'est pas visible sur la page. 
              </Tooltip>
            </div>}
        </div>
        <div className="content-data mb-20" id="body_texte_initial"
          ref={initial_text => {this.initial_text = initial_text}}>
          {ReactHtmlParser((francais || {}).body || "")}
        </div>

        <div className="langue-data">
          <i className={'mr-12 flag-icon flag-icon-' + langue.langueCode} title={langue.langueCode} id={langue.langueCode}></i>
          <strong>Votre traduction en {(langue.langueFr || '').toLowerCase()}</strong>
        </div>
        <div className="content-data" id="body_texte_final">
          <ConditionalSpinner show={!(translated || {}).body} />
          <Editor
            toolbarClassName="toolbar-editeur"
            editorClassName="editor-editeur"
            wrapperClassName="wrapper-editeur editeur-sidebar"
            placeholder="Renseignez votre traduction ici"
            onEditorStateChange={this.props.onEditorStateChange}
            editorState={(translated || {}).body}
            toolbarHidden = {pointeurs.includes(this.state.currIdx)}
            toolbar={{
              options: ['inline','list'],
              inline: {
                inDropdown: false,
                options: ['bold', 'italic', 'underline'],
                className: "bloc-gauche-inline blc-gh",
                bold: { icon: boldBtn, className: "inline-btn btn-bold" },
                italic: { icon: italicBtn, className: "inline-btn btn-italic"  },
                underline: { icon: underBtn, className: "inline-btn btn-underline"  },
              },
              list: {
                inDropdown: false,
                options: ['unordered'],
                className: "bloc-gauche-list blc-gh",
                unordered:{icon: listBtn, className: "list-btn"}
              },
            }}
          />
        </div>
        <div className="expert-bloc">
          {score && score !== 0 && score !== "0" ? 
            <div className="score">
              Score de qualité : {' '}
              <span className="texte-vert">{Math.round((score || 0) * 100)} %</span>
              <EVAIcon className="ml-10" name="info" fill={variables.noir} id="eva-icon-score" />
              <Tooltip placement="top" offset="0px, 8px" isOpen={this.state.tooltipScoreOpen} target="eva-icon-score" toggle={this.toggleTooltipScore}>
                Ce score de qualité est généré à partir d'un algorithme de traduction, il vous conseille quant à la qualité de la traduction. Vous pouvez l'ignorer s'il vous induit en erreur.
              </Tooltip>
            </div> : <div></div>}
          {userId && userId.username &&
            <div className="trad-info">
              <img src={(userId.picture || {}).secure_url || marioProfile} className="profile-img-pin mr-10" />
              <span>{userId.username}</span>
            </div>}
        </div>
        <div className="footer-btns">
          {isExpert ? <div></div> :
            <FButton type="outline-black" name="refresh-outline" fill={variables.noir} onClick={this.reset}>
              Réinitialiser
            </FButton>}
          <div>
            {isExpert && 
              <FButton type="outline-black" name="flag-outline" onClick={this.signaler} disabled={!(this.props.translated || {}).body} fill={variables.noir} className="mr-10">
                Signaler
              </FButton>}
            <FButton type="light-action" name={(isExpert ? "close" : "skip-forward") + "-outline"} fill={variables.noir} className="mr-10" onClick={()=> isExpert ? this.toggleModal(true, 'rejected') : this.goChange()}>
              {isExpert ? "Refuser" : "Passer"}
            </FButton>
            <FButton type="validate" name="checkmark-circle-outline" onClick={this.onValidate} disabled={!(this.props.translated || {}).body}>
              Valider
            </FButton>
          </div>
        </div>
        {isExpert && listTrad.length > 0 && 
          <div className="other-propositions">
            <h5 className="title-props">Autres propositions possibles</h5>
            <ListGroup>
              {listTrad.map((sugg, key) => {
                let valeur = h2p(sugg.value || '');
                valeur = valeur.slice(0,35) + (valeur.length > 35 ? "..." : "");
                if(valeur && valeur !== ""){
                  return (
                    <ListGroupItem tag="button" action key={key} onClick={() => this.selectTranslation(sugg)}>
                      {valeur}
                      {sugg.score && sugg.score !== 0 && sugg.score !== "0" && 
                        <b className="score">{Math.round((sugg.score || 0) * 100)} %</b>}
                    </ListGroupItem>
                  )
                }
              })}
            </ListGroup>
          </div>}
        
        <RejectTradModal 
          name='rejected' 
          show={showModals.rejected} 
          toggle={()=>this.toggleModal(false, 'rejected')} 
          removeTranslation = {this.removeTranslation}
          currIdx={currIdx}
          currSubIdx={currSubIdx}
          currSubName={currSubName}
          selectedTrad={selectedTrad}
          userId={userId}/>
      </div>
    )
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

const mapStateToProps = (state) => {
  return {
    langues: state.langue.langues,
  }
}

export default  connect(mapStateToProps)(SideTrad);