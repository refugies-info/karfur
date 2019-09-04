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

import './SideTrad.scss';
import variables from 'scss/colors.scss';

const pointeurs = [ "titreInformatif", "titreMarque", "abstract"];

class SideTrad extends Component {
  state= {
    currIdx: "titreInformatif",
    currSubIdx: -1,
    currSubName: "content",
    hasBeenSkipped: false,
    tooltipOpen: false,
    listTrad: []
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.content.titreInformatif !== this.props.content.titreInformatif){
      this._initializeComponent(nextProps);
    }
  }

  _initializeComponent = async props => {
    if(props.content && props.content.titreInformatif !== "Titre informatif" && props.fwdSetState && props.translate){
      props.fwdSetState(() => ({francais: {body: props.content.titreInformatif} }), ()=> this.checkTranslate(this.initial_text.innerHTML, props.locale, 'body'));
      this._scrollAndHighlight("titreInformatif");
    }
    window.scrollTo(0, 0);
  }

  goChange = (isNext=true, fromFn=true) => {
    if(isNext && fromFn){this.setState({hasBeenSkipped: true})}
    if(this.state.currIdx > this.props.menu.length - 1){return;}
    const oldP = pointeurs.findIndex(x => this.state.currIdx === x);
    if( (oldP > (- 1 + (isNext ? 0 : 1)) && oldP < pointeurs.length - (isNext ? 1 : 0))
        || (!isNext && this.state.currIdx === 0 && this.state.currSubIdx === -1 && this.state.currSubName === "content") ){
      this.props.fwdSetState(() => ({francais: {body: this.props.content[ pointeurs[oldP + (isNext ? 1 : this.state.currIdx === 0 ? pointeurs.length : -1)] ]} }), ()=> this.checkTranslate(this.initial_text.innerHTML, this.props.locale, 'body'))
      this.setState({currIdx: pointeurs[oldP + (isNext ? 1 : this.state.currIdx === 0 ? pointeurs.length : -1)]}, () => {
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
        if(idx > this.props.menu.length - 1){
          if(!this.state.hasBeenSkipped){
            Swal.fire( 'Yay...', 'Ce dispositif est maintenant intégralement traduit et sera transmis à l\'expert pour validation', 'success').then(()=>{
              // this.onSkip();
            });} 
          return;
        }else if(subidx > -1 && this.props.menu[idx].type === "cards"){
          if(this.props.menu[idx].children[subidx][subname] === "Important !"){
            subname = "contentTitle";
            value = this.props.menu[idx].children[subidx].contentTitle;
          }
        }else{
          value = subidx > -1 ? this.props.menu[idx].children[subidx][subname] : this.props.menu[idx].content;
        }
        if(!value || value === "" || value === "undefined" || value === "null"){this.goChange(isNext, false); return;}
        this._scrollAndHighlight(idx, subidx, subname);
        this.props.fwdSetState(() => ({francais: {body: value } }), ()=> this.checkTranslate(this.initial_text.innerHTML, this.props.locale, 'body'));
      })
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

  checkTranslate = (text,target,item) => {
    //On vérifie si une traduction n'a pas déjà été validée
    const pos = pointeurs.findIndex(x => this.state.currIdx === x), {isExpert, traductionsFaites} = this.props;
    let oldTrad = "", listTrad = [];
    if(pos > -1){
      if(isExpert){
        listTrad = ((traductionsFaites || []).map(x => ({value: (x.translatedText || {})[this.state.currIdx], score: (((((x.translatedText || {}).scoreHeaders || {})[this.state.currIdx] || {}).cosine || [{}])[0] || [{}])[0], _id: x._id, articleId: x.articleId})) || []).sort((a,b) => b.score - a.score);
        if(listTrad && listTrad.length > 0){
          oldTrad = listTrad[0].value;
          listTrad.shift();
        }
      }else{
        oldTrad = this.props.traduction.translatedText[this.state.currIdx];
      }
    }else{
      oldTrad = this.props.traduction.translatedText.contenu[this.state.currIdx];
      if(this.state.currSubIdx > -1 && oldTrad){
        oldTrad = oldTrad.children[this.state.currSubIdx][this.state.currSubName];
      }else if(oldTrad){
        oldTrad = oldTrad[this.state.currSubName];
      }
    }
    this.setState({listTrad})
    if(oldTrad){
      this.props.fwdSetState({ translated:{ ...this.props.translated, body: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(oldTrad).contentBlocks)) } } )
    }else{
      this.props.translate(text,target,item, true);
    }
  }

  selectTranslation = sugg => {
    this.props.fwdSetState({ translated:{ ...this.props.translated, body: EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(sugg.value).contentBlocks)) } } )
  }

  toggleTooltip = () => this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen })); 
  reset = () => this.props.translate(this.initial_text.innerHTML, this.props.locale, 'body', true);

  onValidate = () => {
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
    this.props.fwdSetState({traduction}, () => this.props.valider(this.props.traduction));
    this.goChange(true, false);
  }

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

  render(){
    const langue = this.props.langue || {};
    const { francais, translated } = this.props;
    const { currIdx, listTrad } = this.state;

    // console.log(traductionsFaites, this.state.currIdx)
    // let listTrad = (traductionsFaites || []).map(x => (x.translatedText[this.state.currIdx]));
    // console.log(listTrad)
    return(
      <div className="side-trad">
        <div className="nav-btns">
          {currIdx !== "titreInformatif" &&
            <FButton type="outline-black" name="arrow-back-outline" fill={variables.noir} onClick={()=>this.goChange(false)}>
              Paragraphe précédent
            </FButton>}
          <FButton className="margin-left-auto" type="light-action" onClick={this.goChange}>
            Paragraphe suivant
            <EVAIcon name="arrow-forward-outline" fill={variables.noir} className="ml-10" />
          </FButton>
        </div>
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
        <div className="content-data" id="body_texte_initial"
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
          {/* <ContentEditable
            key="target-editor-body"
            className="body"
            placeholder="Renseignez votre traduction ici"
            html={(translated || {}).body || ""} // innerHTML of the editable div
            disabled={isExpert}       // use true to disable editing
            onChange={this.props.handleChange} 
          /> */}
        </div>
        <div className="footer-btns">
          <FButton type="outline-black" name="refresh-outline" fill={variables.noir} onClick={this.reset}>
            Réinitialiser
          </FButton>
          <div>
            <FButton type="light-action" name="skip-forward-outline" fill={variables.noir} className="mr-10" onClick={this.goChange}>
              Passer
            </FButton>
            <FButton type="validate" name="checkmark-circle-outline" onClick={this.onValidate} disabled={!(this.props.translated || {}).body}>
              Valider
            </FButton>
          </div>
        </div>
        <div className="other-propositions">
          <h5 className="title-props">Autres propositions possibles</h5>
          <ListGroup>
            {listTrad.map((sugg, key) => (
              <ListGroupItem tag="button" action key={key} onClick={() => this.selectTranslation(sugg)}>
                {sugg.value}
                <b className="score">{Math.round((sugg.score || 0) * 100)} %</b>
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>
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