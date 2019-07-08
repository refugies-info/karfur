import React, {Component} from 'react';
import { Col, Card, CardBody, CardHeader, CardFooter, ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem,Button, Modal, Input } from 'reactstrap';
import Icon from 'react-eva-icons';
import ContentEditable from 'react-contenteditable';
import Swal from 'sweetalert2';

import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';
import FSwitch from '../../../components/FigmaUI/FSwitch/FSwitch';

import './CardParagraphe.scss';
import variables from 'scss/colors.scss';

const list_papiers=[
  {name:'Titre de séjour'},
  {name:'Contrat d\'intégration républicaine (CIR)'},
]

const papiers=[...list_papiers]

const niveaux = ["A1.1", "A1", "A2", "B1", "B2", "C1", "C2"]
const frequencesPay = ["une seule fois ", "à chaque fois", "par mois", "par semaine", "par heure", "personnalisé"];

class CardParagraphe extends Component {
  state= {
    showModal:false,
    isDropdownOpen: false,
    isOptionsOpen: false,
    isModalDropdownOpen:new Array(2).fill(false),
    papiers:papiers,
    showNiveaux: false
  }

  editCard = () => this.toggleModal(true,'pieces')

  toggleModal = (show) => this.setState({showModal:show})
  toggleNiveaux = () => this.setState({showNiveaux: !this.state.showNiveaux})
  
  toggleDropdown = (e) => {
    if(this.state.isDropdownOpen && e.currentTarget.id){
      this.props.changeTitle(this.props.keyValue, this.props.subkey, 'title', e.target.innerText);
      this.props.changeTitle(this.props.keyValue, this.props.subkey, 'titleIcon', e.currentTarget.dataset.titleicon);
    }
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen })
  };

  toggleModalDropdown = (idx) => this.setState({ isModalDropdownOpen: this.state.isModalDropdownOpen.map((x,i) => i===idx ? !x : x) })

  setPapier = (idx, y) => this.setState({ papiers: this.state.papiers.map((x,i) => i===idx ? list_papiers[y] : x) })
  addPiece = () => this.setState({ papiers: [...this.state.papiers,{name:'Titre de séjour'}], isModalDropdownOpen:[...this.state.isModalDropdownOpen, false] })
  removePiece = idx => this.setState({ papiers: [...this.state.papiers].filter( (_,key) => key !== idx) })

  toggleOptions = (e) => {
    if(this.state.isOptionsOpen && e.currentTarget.id){
      this.props.changeTitle(this.props.keyValue, this.props.subkey, 'contentTitle', e.target.innerText)
    }
    this.setState({ isOptionsOpen: !this.state.isOptionsOpen })
  };

  footerClicked = () => {
    if(this.props.subitem.footer==='Pièces demandées'){
      this.editCard(this.props.keyValue, this.props.subkey)
    }else{Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore activée', 'error')}
  }

  render(){
    let {subitem, subkey, filtres} = this.props;
    let {showNiveaux} = this.state;

    const jsUcfirst = (string, title) => {
      if(title === 'Public visé' && string && string.length > 1){
        return string.charAt(0).toUpperCase() + string.slice(1)
      }else{ return string }
    }

    let cardTitles=[
      {title:'Public visé',titleIcon:'papiers', options: filtres.audience},
      {title:'Âge requis',titleIcon:'calendar', options: filtres.audienceAge}, //["0-18","18-25","25-56","56-120"]
      {title:'Durée',titleIcon:'horloge'},
      {title:'Niveau de français',titleIcon:'frBubble', options: filtres.niveauFrancais},
      {title:'Combien ça coûte ?',titleIcon:'money'},
      {title:'Important !',titleIcon:'warning'},
    ]
    
    let contentTitle = (subitem) => {
      let cardTitle = cardTitles.find(x=>x.title==subitem.title);
      if(cardTitle && cardTitle.options && cardTitle.options.length > 0 && !this.props.disableEdit){
        if(!cardTitle.options.some(x => x===subitem.contentTitle)){ subitem.contentTitle = cardTitle.options[0]; subitem.contentBody = 'A modifier'; }
        return(
          <ButtonDropdown isOpen={this.state.isOptionsOpen} toggle={this.toggleOptions} className="content-title">
            <DropdownToggle caret>
              {subitem.title === "Âge requis" ? 
                <span>{subitem.contentTitle.split("**").map((x, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{x}</span>
                    {i < arr.length - 1 && 
                      <Input 
                        type="number" 
                        className="age-input"
                        value={((arr[0] === "De " && i===0) || arr[0] === "Plus de ") ? subitem.bottomValue : subitem.topValue} 
                        onClick={e => e.stopPropagation()}
                        onChange={e => this.props.changeAge(e, this.props.keyValue, this.props.subkey, i===0 || arr[0] === "Plus de")} />}
                  </React.Fragment>
                ))}</span>
                :
                <span>{jsUcfirst(subitem.contentTitle, cardTitle.title)}</span> }
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
            <FSwitch precontent="Gratuit" content="Payant" checked={!subitem.free} onClick={() => this.props.toggleFree(this.props.keyValue, this.props.subkey)} />
            {!subitem.free && 
              <span className="price-details">
                <Input 
                  type="number" 
                  className="age-input"
                  value={subitem.price} 
                  onChange={e => this.props.changePrice(e, this.props.keyValue, this.props.subkey)} />
                <span>€ </span>
                <ButtonDropdown isOpen={this.state.isOptionsOpen} toggle={this.toggleOptions} className="content-title price-frequency">
                  <DropdownToggle caret>
                    <span>{subitem.contentTitle}</span>
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
        return(
          <ContentEditable
            id={this.props.keyValue}
            className="color-darkColor card-input"
            data-subkey={subkey}
            data-target='contentTitle'
            html={subitem.contentTitle}  // innerHTML of the editable div
            disabled={this.props.disableEdit}       // use true to disable editing
            onChange={this.props.handleMenuChange} // handle innerHTML change
          />
        )
      }
    }

    let cardHeaderContent = (subitem) => {
      if(this.props.disableEdit){
        return(
          <>
            {subitem.typeIcon === "eva" ?
              <EVAIcon name={subitem.titleIcon} fill="#FFFFFF" /> :
              <SVGIcon name={subitem.titleIcon} fill="#FFFFFF" width="20" height="20" /> }
            <span className="header-content">{subitem.title}</span>
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

    let cardFooterContent = subitem => {
      if(subitem.footerType==="text"){ return(
        <ContentEditable
          id={this.props.keyValue}
          className="footer-input"
          data-subkey={subkey}
          data-target='footer'
          html={subitem.footer}  // innerHTML of the editable div
          disabled={this.props.disableEdit}       // use true to disable editing
          onChange={this.props.handleMenuChange} // handle innerHTML change
        />
      )}else{ return (
        <Button color="light" outline onClick={this.footerClicked}>
          <Icon name="plus-circle-outline" />
          <span className="footer-content">{subitem.footer}</span>
        </Button>
      )}
    }

    return(
      <>
        <Col lg="4" className="card-col" onMouseEnter={()=>this.props.updateUIArray(this.props.keyValue, this.props.subkey, 'isHover')}>
          <Card className={subitem.title==='Important !' ? 'make-it-red':'regular'}>
            <CardHeader className="backgroundColor-darkColor">
              {cardHeaderContent(subitem)}
            </CardHeader>
            <CardBody>
              <h4>{contentTitle(subitem)}</h4>
              {subitem.title==='Niveau de français' && 
                (showNiveaux ? 
                  <div className="niveaux-wrapper">
                    {niveaux.map((nv, key) => (
                      <button 
                        key={key} 
                        className={(subitem.niveaux || []).some(x => x===nv) ? "active": ""} 
                        onClick={()=> this.props.toggleNiveau(nv, this.props.keyValue, this.props.subkey)}>
                        {nv}
                      </button>
                    ))}
                  </div>
                  :
                  <u className="cursor-pointer" onClick={this.toggleNiveaux}>Préciser</u>)}
              {/* <span>
                <ContentEditable
                  id={this.props.keyValue}
                  data-subkey={subkey}
                  data-target='contentBody'
                  html={subitem.contentBody}  // innerHTML of the editable div
                  disabled={this.props.disableEdit}       // use true to disable editing
                  onChange={this.props.handleMenuChange} // handle innerHTML change
                />
              </span> */}
            </CardBody>
            <CardFooter>
              {cardFooterContent(subitem)}
            </CardFooter>

            {!this.props.disableEdit && 
              <div className="card-icons">
                <div onClick={()=>this.props.deleteCard(this.props.keyValue,subkey)}>
                  <EVAIcon size="xlarge" name="minus-circle" fill={variables.noirCD} className="delete-icon"/>
                </div>
              </div>}
          </Card>
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
                  {!this.props.disableEdit && <EVAIcon name="minus-circle-outline" onClick={()=>this.removePiece(idx)} className="btn-moins" />}
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
    <Col lg="4" className="card-col">
      <Card className="add-card" onClick={() => props.addItem(props.keyValue, 'card')}>
        <CardHeader>
          Ajouter une carte
        </CardHeader>
        <CardBody>
          <span className="add-sign">+</span>
        </CardBody>
      </Card>
    </Col>
  )
}

export {PlusCard}

export default CardParagraphe;