import React, {Component} from 'react';
import { Col, Card, CardBody, CardHeader, CardFooter, ButtonDropdown, Dropdown, DropdownToggle, 
  DropdownMenu, DropdownItem, ListGroup, ListGroupItem, Modal, Input, Tooltip } from 'reactstrap';
import ContentEditable from 'react-contenteditable';
import Swal from 'sweetalert2';
import { withTranslation } from 'react-i18next';

import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import FSwitch from '../../../components/FigmaUI/FSwitch/FSwitch';

import './CardParagraphe.scss';
import variables from 'scss/colors.scss';
import FButton from '../../../components/FigmaUI/FButton/FButton';

const list_papiers=[
  {name:'Titre de séjour'},
  {name:'Contrat d\'intégration républicaine (CIR)'},
];

const papiers=[...list_papiers]

const niveaux = ["A1.1", "A1", "A2", "B1", "B2", "C1", "C2"]
const frequencesPay = ["une seule fois ", "à chaque fois", "par mois", "par semaine", "par heure"];

class CardParagraphe extends Component {
  state= {
    showModal:false,
    isDropdownOpen: false,
    isOptionsOpen: false,
    isModalDropdownOpen:new Array(2).fill(false),
    papiers:papiers,
    showNiveaux: false,
    tooltipOpen: false,
  }

  editCard = () => this.toggleModal(true,'pieces')

  toggleModal = (show) => this.setState({showModal:show})
  toggleNiveaux = () => this.setState({showNiveaux: !this.state.showNiveaux});
  toggleTooltip = () => this.setState(prevState => ({tooltipOpen: !prevState.tooltipOpen })); 
  
  toggleDropdown = (e) => {
    if(this.state.isDropdownOpen && e.currentTarget.id){
      this.props.changeTitle(this.props.keyValue, this.props.subkey, 'title', e.target.innerText);
    }
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen })
  };

  toggleModalDropdown = (idx) => this.setState({ isModalDropdownOpen: this.state.isModalDropdownOpen.map((x,i) => i===idx ? !x : x) })

  setPapier = (idx, y) => this.setState({ papiers: this.state.papiers.map((x,i) => i===idx ? list_papiers[y] : x) })
  addPiece = () => this.setState({ papiers: [...this.state.papiers,{name:'Titre de séjour'}], isModalDropdownOpen:[...this.state.isModalDropdownOpen, false] })
  removePiece = idx => this.setState({ papiers: [...this.state.papiers].filter( (_,key) => key !== idx) })
  emptyPlaceholder = e => {
    if(!this.props.disableEdit && (this.props.subitem || {}).isFakeContent){
      this.props.handleMenuChange({currentTarget: e.currentTarget, target:{value: ""}}); 
    }
  }

  toggleOptions = (e) => {
    if(this.state.isOptionsOpen && e.currentTarget.id){
      this.props.changeTitle(this.props.keyValue, this.props.subkey, 'contentTitle', e.target.innerText)
    }
    this.setState({ isOptionsOpen: !this.state.isOptionsOpen })
  };
  
  footerClicked = () => {
    if(this.props.subitem.footerHref){
      window.open( this.props.subitem.footerHref, "_blank" )
    }else{Swal.fire( {title: 'Oh non!', text: 'Cette fonctionnalité n\'est pas encore activée', type: 'error', timer: 1500 })}
  }

  render(){
    const {subitem, subkey, filtres, disableEdit, t} = this.props;
    const {showNiveaux} = this.state;

    const jsUcfirst = (string, title) => {
      if(title === 'Public visé' && string && string.length > 1){
        return string.charAt(0).toUpperCase() + string.slice(1)
      }else{ return string }
    }
    
    const cardTitles=[
      {title:'Public visé',titleIcon:'papiers', options: filtres.audience},
      {title:'Âge requis',titleIcon:'calendar', options: filtres.audienceAge}, //["0-18","18-25","25-56","56-120"]
      {title:'Durée',titleIcon:'clock-outline'},
      {title:'Niveau de français',titleIcon:'frBubble', options: filtres.niveauFrancais},
      {title:'Combien ça coûte ?',titleIcon:'pricetags-outline'},
      {title:'Justificatif demandé',titleIcon:'papiers', options: filtres.justificatifs},
      {title:'Important !',titleIcon:'warning'},
    ]
    
    const contentTitle = (subitem) => {
      let cardTitle = cardTitles.find(x=>x.title===subitem.title);
      if(cardTitle && cardTitle.options && cardTitle.options.length > 0 && !disableEdit){
        if(!cardTitle.options.some(x => x.toUpperCase()===subitem.contentTitle.toUpperCase())){ subitem.contentTitle = cardTitle.options[0]; subitem.contentBody = 'A modifier'; }
        return(
          <ButtonDropdown isOpen={this.state.isOptionsOpen} toggle={this.toggleOptions} className="content-title">
            <DropdownToggle caret={!disableEdit}>
              {subitem.title === "Âge requis" ? 
                <span>{subitem.contentTitle.split("**").map((x, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{x}</span>
                    {i < arr.length - 1 && 
                      <Input 
                        type="number" 
                        className="color-darkColor age-input"
                        value={((arr[0] === "De " && i===0) || arr[0] === "Plus de ") ? subitem.bottomValue : subitem.topValue} 
                        onClick={e => e.stopPropagation()}
                        onMouseUp={() => (this.props.subitem || {}).isFakeContent && this.props.changeAge({target:{value:""}}, this.props.keyValue, this.props.subkey, i===0 || arr[0] === "Plus de")}
                        onChange={e => this.props.changeAge(e, this.props.keyValue, this.props.subkey, (arr[0] === "De " && i===0) || arr[0] === "Plus de")} />}
                  </React.Fragment>
                ))}</span>
                :
                <span>{subitem.contentTitle && jsUcfirst( t("Dispositif." + subitem.contentTitle, subitem.contentTitle), cardTitle.title)}</span> }
            </DropdownToggle>
            <DropdownMenu>
              {cardTitle.options.map((option, key) => {
                return (
                  <DropdownItem key={key} id={key}>
                    {jsUcfirst(option, cardTitle.title)}
                  </DropdownItem>
                )}
              )}
            </DropdownMenu>
          </ButtonDropdown>
        )
      }else if(subitem.title === "Combien ça coûte ?"){
        return(
          <>
            {disableEdit ? 
              <div className="card-custom-title">{subitem.free ? t("Dispositif.Gratuit", "Gratuit") : t("Dispositif.Payant", "Payant") }</div> :
              <FSwitch className="card-custom-title" precontent="Gratuit" content="Payant" checked={!subitem.free} onClick={() => this.props.toggleFree(this.props.keyValue, this.props.subkey)} />}
            {!subitem.free && 
              <span className="color-darkColor price-details">
                {disableEdit ?
                  <span>{subitem.price}</span> :
                  <Input 
                    type="number" 
                    className="color-darkColor age-input"
                    disabled={disableEdit}
                    value={subitem.price} 
                    onMouseUp={() => (this.props.subitem || {}).isFakeContent && this.props.changePrice({target:{value:""}}, this.props.keyValue, this.props.subkey)}
                    onChange={e => this.props.changePrice(e, this.props.keyValue, this.props.subkey)} /> }
                <span>€ </span>
                <ButtonDropdown isOpen={!disableEdit && this.state.isOptionsOpen} toggle={this.toggleOptions} className="content-title price-frequency">
                  <DropdownToggle caret={!disableEdit}>
                    <span>{subitem.contentTitle && t("Dispositif." + subitem.contentTitle, subitem.contentTitle)}</span>
                  </DropdownToggle>
                  <DropdownMenu>
                    {frequencesPay.map((f, key) => (
                      <DropdownItem key={key} id={key}>
                        {f}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </span>}
          </> 
        )
      }else{
        let texte;
        if(subitem.title==='Âge requis'){
          texte = (subitem.contentTitle === 'De ** à ** ans') ? t("Dispositif.De", "De") + ' ' + subitem.bottomValue + ' ' + t("Dispositif.à", "à") + ' ' + subitem.topValue  + ' ' + t("Dispositif.ans", "ans") :
            (subitem.contentTitle === 'Moins de ** ans') ? t("Dispositif.Moins de", "Moins de") + ' ' + subitem.topValue + ' ' + t("Dispositif.ans", "ans") :
            t("Dispositif.Plus de", "Plus de") + ' ' + subitem.bottomValue + ' ' + t("Dispositif.ans", "ans");
        }else if(subitem.title === 'Combien ça coûte ?'){
          texte = subitem.free ? t("Dispositif.gratuit", "gratuit") : (subitem.price + " € " + t("Dispositif." + subitem.contentTitle,  subitem.contentTitle));
        }else if(cardTitle && cardTitle.options){
          texte = subitem.contentTitle && t("Dispositif." + subitem.contentTitle, subitem.contentTitle);
        }else{
          texte = subitem.contentTitle;
        }
        return(
          <ContentEditable
            id={this.props.keyValue}
            className="card-input"
            data-subkey={subkey}
            data-target='contentTitle'
            html={texte}  // innerHTML of the editable div
            disabled={this.props.disableEdit}       // use true to disable editing
            onChange={this.props.handleMenuChange} // handle innerHTML change
            onMouseUp={this.emptyPlaceholder}
          />
        )
      }
    }

    const cardHeaderContent = (subitem) => {
      if(this.props.disableEdit){
        return(
          <>
            {subitem.typeIcon === "eva" ?
              <EVAIcon name={subitem.titleIcon} fill="#FFFFFF" /> :
              <SVGIcon name={subitem.titleIcon} fill="#FFFFFF" width="20" height="20" /> }
            <span className="header-content">{subitem.title && t("Dispositif." + subitem.title, subitem.title)}</span>
          </>
        )
      }else{
        return(
          <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret={!this.props.disableEdit} className="header-value">
              {subitem.typeIcon === "eva" ?
                <EVAIcon name={subitem.titleIcon} fill="#FFFFFF" /> :
                <SVGIcon name={subitem.titleIcon} fill="#FFFFFF" width="20" height="20" /> }
              <span className="header-content">{subitem.title}</span>
            </DropdownToggle>
            <DropdownMenu>
              {cardTitles.map((cardTitle, key) => {
                return (
                  <DropdownItem key={key} id={key} data-titleicon={cardTitle.titleIcon}>
                    <SVGIcon name={cardTitle.titleIcon} /> 
                    <span className="header-content">{cardTitle.title}</span>
                  </DropdownItem>
                )}
              )}
            </DropdownMenu>
          </ButtonDropdown>
        )
      }
    }

    const cardFooterContent = subitem => {
      if(subitem.footerType==="text"){
        if(subitem.footer !== "Ajouter un message complémentaire") {
          return(
            <ContentEditable
              id={this.props.keyValue}
              className="footer-input"
              data-subkey={subkey}
              data-target='footer'
              html={subitem.footer}  // innerHTML of the editable div
              disabled={this.props.disableEdit}       // use true to disable editing
              onChange={this.props.handleMenuChange} // handle innerHTML change
            />
          )
        }else{return false}
      }else if(this.props.subitem.footerHref && disableEdit){ return (
        <FButton type="light-action" name={subitem.footerIcon} onClick={this.footerClicked}>
          {subitem.footer && t("Dispositif." + subitem.footer, subitem.footer)}
        </FButton>
      )}else{return false}
    }

    return(
      <>
        <Col className="card-col" onMouseEnter={()=>this.props.updateUIArray(this.props.keyValue, this.props.subkey, 'isHover')}>
          <Card 
            className={(subitem.title==='Important !' ? 'make-it-red':'regular') + " " + subitem.title.replace(/ /g,"-").replace("-?", "").replace("-!", "")} 
            id={"info-card-" + this.props.keyValue + "-" + subkey}
            //style={subitem.title && {backgroundImage: `url(${bgImage(subitem.title)})`}}
          >
            <CardHeader className="backgroundColor-darkColor">
              {cardHeaderContent(subitem)}
            </CardHeader>
            <CardBody>
              <span className="color-darkColor card-custom-title">{contentTitle(subitem)}</span>
              {subitem.title==='Niveau de français' && 
                (showNiveaux || (subitem.niveaux || []).length > 0 ? 
                  <div className="niveaux-wrapper">
                    {niveaux.map((nv, key) => (
                      <button 
                        key={key} 
                        className={(subitem.niveaux || []).some(x => x===nv) ? "active": ""} 
                        disabled={this.props.disableEdit}
                        onClick={()=> this.props.toggleNiveau(nv, this.props.keyValue, this.props.subkey)}>
                        {nv}
                      </button>
                    ))}
                  </div>
                  :
                  !this.props.disableEdit && <u className="cursor-pointer" onClick={this.toggleNiveaux}>Préciser</u>)}
            </CardBody>
            <CardFooter>
              {cardFooterContent(subitem)}
            </CardFooter>

            {!this.props.disableEdit && 
              <div className="card-icons">
                <div onClick={()=>this.props.deleteCard(this.props.keyValue,subkey)}>
                  <EVAIcon size="xlarge" name="close-circle" fill={variables.noirCD} className="delete-icon"/>
                </div>
              </div>}
          </Card>
          
          {/* temporairement désactivés à la demande d'hugo mais je sens que ça va revenir */}
          <Tooltip className="card-tooltip backgroundColor-darkColor" isOpen={false && (subitem.tooltipHeader || subitem.tooltipContent) && !this.props.disableEdit && this.props.withHelp && this.state.tooltipOpen} target={"info-card-" + this.props.keyValue + "-" + subkey} toggle={this.toggleTooltip}>
            <div className="tooltip-header"><b>{subitem.tooltipHeader}</b></div>
            <div className="tooltip-content">{subitem.tooltipContent}</div>
            <div className="tooltip-footer"><u>{subitem.tooltipFooter}</u></div>
          </Tooltip>
        </Col>

        <Modal isOpen={this.state.showModal} toggle={()=>this.toggleModal(false)} className='modal-pieces'>
          <h1>Pièces demandées</h1>
          <p className="subtitle">
            Voici les pièces requises pour participer au dispositif {this.props.content.titreMarque}
          </p>
          <ListGroup flush>
            {this.state.papiers.map((element, idx) => 
              <ListGroupItem action key={idx}>
                <Dropdown isOpen={!this.props.disableEdit && this.state.isModalDropdownOpen[idx]} toggle={()=>this.toggleModalDropdown(idx)}>
                  {!this.props.disableEdit && <EVAIcon name="close-circle" onClick={()=>this.removePiece(idx)} className="btn-moins" />}
                  <DropdownToggle caret={!this.props.disableEdit} className="papiers-toggle-btn">
                    <h6>{element.name}</h6>
                    <u>Comment obtenir cette pièce ?</u>
                  </DropdownToggle>
                  <DropdownMenu>
                    {list_papiers.map((papier,y) => <DropdownItem key={y} onClick={()=>this.setPapier(idx, y)}>{papier.name}</DropdownItem>)}
                  </DropdownMenu>
                </Dropdown>
              </ListGroupItem>
            )}
            {!this.props.disableEdit && 
              <ListGroupItem action onClick={this.addPiece}>
                <h6>Ajouter une pièce supplémentaire</h6>
              </ListGroupItem>}
          </ListGroup>
        </Modal>
      </> 
    )
  }
}

const PlusCard = (props) => {
  return(
    <Col xl="4" lg="6" md="6" sm="12" xs="12" className="card-col">
      <Card className="add-card" onClick={() => props.addItem(props.keyValue, 'card')}>
        <CardHeader className="backgroundColor-darkColor">
          Ajouter un item
        </CardHeader>
        <CardBody>
          <span className="add-sign">+</span>
        </CardBody>
      </Card>
    </Col>
  )
}

function bgImage(cardName) {
  try{
    const imageUrl = require("../../../assets/figma/InfoCard/infocard_" + cardName.replace(/ /g,"-").replace("-?", "").replace("-!", "") + ".svg") //illustration_
    return imageUrl
  }catch(e){console.log(e)}
  return false;
}

export {PlusCard}

export default withTranslation()(CardParagraphe);