import React, {Component} from 'react';
import { Col, Card, CardBody, CardHeader, CardFooter, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ListGroup, ListGroupItem } from 'reactstrap';
import Icon from 'react-eva-icons';
import ContentEditable from 'react-contenteditable';

import Modal from '../../../components/Modals/Modal'
import SVGIcon from '../../../components/UI/SVGIcon/SVGIcon';

import './CardParagraphe.scss';

const cardTitles=[
  {title:'Audience',titleIcon:'papiers', options:['associations','travailleurs sociaux','institutions d\'état','réfugiés','citoyens']},
  {title:'Tranche d\'âge',titleIcon:'calendar', options: ["0 à 18 ans","18 à 25 ans","25 à 56 ans","56 à 120 ans"]}, //["0-18","18-25","25-56","56-120"]
  {title:'Durée',titleIcon:'horloge'},
  {title:'Niveau de français',titleIcon:'frBubble', options: ["Débutant (A1)","Débutant + (A2)","Intermédiaire (B1)","Intermédiaire + (B2)","Avancé (C1)","Avancé + (C2)"]},
  {title:'Important !',titleIcon:'warning'},
]

class CardParagraphe extends Component {
  state= {
    showModal:false,
    isDropdownOpen: false,
    isOptionsOpen: false,
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

  toggleOptions = (e) => {
    if(this.state.isOptionsOpen && e.currentTarget.id){
      this.props.changeTitle(this.props.keyValue, this.props.subkey, 'contentTitle', e.target.innerText)
    }
    this.setState({ isOptionsOpen: !this.state.isOptionsOpen })
  };

  render(){
    let subitem=this.props.subitem;
    let subkey=this.props.subkey;

    let contentTitle = (subitem) => {
      let cardTitle = cardTitles.find(x=>x.title==subitem.title);
      if(cardTitle && cardTitle.options){
        return(
          <ButtonDropdown isOpen={this.state.isOptionsOpen} toggle={this.toggleOptions} className="content-title">
            <DropdownToggle caret>
              {subitem.contentTitle}
            </DropdownToggle>
            <DropdownMenu>
              {cardTitle.options.map((option, key) => {
                return (
                  <DropdownItem key={key} id={key}>
                    {option}
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
    return(
      <>
        <Col lg="4" className="card-col" onMouseEnter={()=>this.props.updateUIArray(this.props.keyValue, this.props.subkey, 'isHover')}>
          <Card className={subitem.title==='Important !' ? 'make-it-red':'regular'}>
            <CardHeader>
              <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle caret className="header-value">
                  <SVGIcon name={subitem.titleIcon} /> 
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
            </CardHeader>
            <CardBody>
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
              <Icon name={subitem.footerIcon}/>
              <span className="footer-content">{subitem.footer}</span>
            </CardFooter>

            <div className="card-icons">
              <div onClick={()=>this.editCard(this.props.keyValue,subkey)}>
                <Icon name="edit-outline" fill="#0D1C2E" className="edit-icon"/>
              </div>
              <div onClick={()=>this.props.deleteCard(this.props.keyValue,subkey)}>
                <Icon name="minus-circle-outline" fill="#0D1C2E" className="delete-icon"/>
              </div>
            </div>
          </Card>
        </Col>

        <Modal show={this.state.showModal} modalClosed={()=>this.toggleModal(false)} classe='modal-pieces'>
          <h1>Pièces demandées</h1>
          <p className="subtitle">Texte introductif personnalisé par l’utilisateur pour expliquer pourquoi il a besoin de telle ou telle pièce</p>
          <ListGroup flush>
            <ListGroupItem action>
              <h6>Titre pièce 1</h6>
              <u>Comment obtenir cette pièce ?</u>
              <Icon name="chevron-right" fill="#FFFFFF" size="xlarge" />
            </ListGroupItem>
            <ListGroupItem action>
              <h6>Titre pièce 2</h6>
              <u>Comment obtenir cette pièce ?</u>
              <Icon name="chevron-right" fill="#FFFFFF" size="xlarge" />
            </ListGroupItem>
            <ListGroupItem action>
              <h6>Titre pièce 3</h6>
              <u>Comment obtenir cette pièce ?</u>
              <Icon name="chevron-right" fill="#FFFFFF" size="xlarge" />
            </ListGroupItem>
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
          <Icon name="plus-circle-outline"/>
          <span className="footer-content">Ajouter un item</span>
        </CardFooter>
      </Card>
    </Col>
  )
}

export {PlusCard}

export default CardParagraphe;