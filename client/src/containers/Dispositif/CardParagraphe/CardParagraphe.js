import React, {Component} from 'react';
import { Col, Card, CardBody, CardHeader, CardFooter, ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem,Button, Modal } from 'reactstrap';
import Icon from 'react-eva-icons';
import ContentEditable from 'react-contenteditable';
import Swal from 'sweetalert2';

import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';
import EVAIcon from '../../../components/UI/EVAIcon/EVAIcon';

import './CardParagraphe.scss';

const list_papiers=[
  {name:'Titre de séjour'},
  {name:'Contrat d\'intégration républicaine (CIR)'},
]

const papiers=[...list_papiers]

class CardParagraphe extends Component {
  state= {
    showModal:false,
    isDropdownOpen: false,
    isOptionsOpen: false,
    isModalDropdownOpen:new Array(2).fill(false),
    papiers:papiers
  }

  editCard = () => this.toggleModal(true,'pieces')

  toggleModal = (show) => this.setState({showModal:show})

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

    const jsUcfirst = (string, title) => {
      if(title === 'Public visé' && string && string.length > 1){
        return string.charAt(0).toUpperCase() + string.slice(1)
      }else{ return string }
    }

    let cardTitles=[
      {title:'Public visé',titleIcon:'papiers', options: filtres.audience},
      {title:'Tranche d\'âge',titleIcon:'calendar', options: filtres.audienceAge}, //["0-18","18-25","25-56","56-120"]
      {title:'Durée',titleIcon:'horloge'},
      {title:'Niveau de français',titleIcon:'frBubble', options: filtres.niveauFrancais},
      {title:'Important !',titleIcon:'warning'},
    ]
    
    let contentTitle = (subitem) => {
      let cardTitle = cardTitles.find(x=>x.title==subitem.title);
      if(cardTitle && cardTitle.options && cardTitle.options.length > 0 && !this.props.disableEdit){
        if(!cardTitle.options.some(x => x===subitem.contentTitle)){ subitem.contentTitle = cardTitle.options[0]; subitem.contentBody = 'A modifier'; }
        return(
          <ButtonDropdown isOpen={this.state.isOptionsOpen} toggle={this.toggleOptions} className="content-title">
            <DropdownToggle caret>
              <span>{jsUcfirst(subitem.contentTitle, cardTitle.title)}</span>
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
      }else{
        return(
          <ContentEditable
            id={this.props.keyValue}
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
            <SVGIcon name={subitem.titleIcon} fill="white" width="20" height="20" /> 
            <span className="header-content">{subitem.title}</span>
          </>
        )
      }else{
        return(
          <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown}>
            <DropdownToggle caret={!this.props.disableEdit} className="header-value">
              <SVGIcon name={subitem.titleIcon} fill="white" width="20" height="20" /> 
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
    return(
      <>
        <Col lg="4" className="card-col" onMouseEnter={()=>this.props.updateUIArray(this.props.keyValue, this.props.subkey, 'isHover')}>
          <Card className={subitem.title==='Important !' ? 'make-it-red':'regular'}>
            <CardHeader>
              {cardHeaderContent(subitem)}
            </CardHeader>
            <CardBody className="text-center">
              <h6>
                {contentTitle(subitem)} 
              </h6>
              <span>
                <ContentEditable
                  id={this.props.keyValue}
                  data-subkey={subkey}
                  data-target='contentBody'
                  html={subitem.contentBody}  // innerHTML of the editable div
                  disabled={this.props.disableEdit}       // use true to disable editing
                  onChange={this.props.handleMenuChange} // handle innerHTML change
                />
              </span>
            </CardBody>
            <CardFooter>
              <Button onClick={this.footerClicked}>
                <span className="footer-content">{subitem.footer}</span>
              </Button>
            </CardFooter>

            {!this.props.disableEdit && 
              <div className="card-icons">
                <div onClick={()=>this.props.deleteCard(this.props.keyValue,subkey)}>
                  <Icon name="minus-circle-outline" fill="#0D1C2E" className="delete-icon"/>
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
        <CardBody>
          <span className="add-sign">+</span>
        </CardBody>
        <CardFooter>
          <span className="footer-content">Ajouter un item</span>
        </CardFooter>
      </Card>
    </Col>
  )
}

export {PlusCard}

export default CardParagraphe;