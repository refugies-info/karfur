import React, {Component} from 'react';
import { Row, Col, Input, Modal, ModalBody, ModalFooter, InputGroup, Tooltip, FormGroup, Label } from 'reactstrap';
import Icon from 'react-eva-icons';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';

import API from "utils/API.js";
import EVAIcon from '../../../UI/EVAIcon/EVAIcon';
import FButton from '../../../FigmaUI/FButton/FButton';
import { SearchBar } from '../../../../containers/UI/SearchBar/SearchBar';
import {sentIllu} from '../../../../assets/figma/index';
import CreationContent from "../CreationContent/CreationContent"
import {update_user} from "../../../../Store/actions/index";

import './Sponsors.scss';
import variables from 'scss/colors.scss';

class Sponsors extends Component {
  state = {
    showModals: [{name: "responsabilite", show : false}, {name: "etVous", show: false}, {name: "creation", show: false}, {name: "envoye", show: false}],
    checked: false,
    authorBelongs: false,
    tooltipOpen: false,
    selected:{},
    mesStructures:[],

    structure:{
      nom:'',
      acronyme:'',
      link: '',
      contact: '',
      mail_contact:'',
      phone_contact:'',
      authorBelongs:false,
    },
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.user && nextProps.structures && nextProps.structures.length > 0){
      const mesStructures = (nextProps.structures.filter(x => (x.membres || []).some(y => y.userId === nextProps.user._id)) || []).map(x => ({...x, checked:false}));
      this.setState({mesStructures})
    }
  }

  toggleModal = name => this.setState(pS=>({showModals:pS.showModals.map(x => ({...x, show: x.name===name ? !x.show : false}))}) );
  toggleTooltip = () => this.setState(pS => ({ tooltipOpen: !pS.tooltipOpen }));

  handleFileInputChange = event => {
    this.setState({sponsorLoading:true})
    const formData = new FormData()
    formData.append(0, event.target.files[0])

    API.set_image(formData).then(data_res => {
      let imgData=data_res.data.data;
      this.setState({imgData: {src: imgData.secure_url, public_id: imgData.public_id}, sponsorLoading:false})
    })
  }

  handleChange = ev => this.setState({ structure: { ...this.state.structure, [ev.currentTarget.id]: ev.target.value }});
  handleUserChange = e => this.props.update_user({...this.props.user, [e.target.id]: e.target.value});

  handleCheckChange = () => this.setState(pS => ({ checked: !pS.checked, mesStructures: pS.mesStructures.map( x => ({...x, checked: false})) }));
  handleBelongsChange = () => this.setState(pS => ({ structure: {...pS.structure, authorBelongs: !pS.structure.authorBelongs } }));
  handleBelongsSChange = () => this.setState(pS => ({ authorBelongs: !pS.authorBelongs } ));
  handleStructChange = id => this.setState(pS => ({ mesStructures: pS.mesStructures.map( x => ({...x, checked: x._id === id ? !x.checked : false})), checked: false }));

  selectItem = suggestion => {
    this.setState({selected : suggestion});
    this.toggleModal(suggestion.createNew ? "creation" : "etVous");
  }

  createStructure = () => {
    if(!this.state.structure.nom || !this.state.structure.contact || (!this.state.structure.mail_contact && !this.state.structure.phone_contact)){Swal.fire( 'Oh non!', 'Certaines informations sont manquantes', 'error'); return;}
    let structure={}, fields = ["nom", "acronyme", "link", "contact", "mail_contact", "phone_contact", "authorBelongs"];
    fields.forEach(x => this.state.structure[x] !== "" ? structure[x] = this.state.structure[x] : false);
    API.create_structure(structure).then((data) => {
      console.log(data);
      this.props.addSponsor(structure)
      this.toggleModal("envoye")
    })
  }

  validerRespo = () => {
    if(this.state.checked){
      let user={...this.props.user}
      let userInfo = {_id: user._id, email: user.email, phone: user.phone}
      this.props.addSponsor( {type: "Not found", user: {...userInfo, username: user.username} }, false)
      this.toggleModal();
      API.set_user_info(userInfo);
    }else if(this.state.mesStructures.some(x => x.checked)){
      this.props.addSponsor(this.state.mesStructures.find(x => x.checked))
      this.toggleModal();
    }
  }

  addSponsor = () => {
    this.props.addSponsor({...this.state.selected, userBelongs: this.state.authorBelongs})
    this.toggleModal("envoye");
  }

  upcoming = () => Swal.fire( 'Oh non!', 'Cette fonctionnalité n\'est pas encore disponible', 'error')

  render(){
    let {disableEdit, t, sponsors, deleteSponsor, user, structures} = this.props
    let {showModals, selected, authorBelongs, checked, mesStructures} =  this.state;
    
    const modal = {name: "responsabilite"};
    return (
      <div className="sponsor-footer">
        <h5 className="color-darkColor">{t("Dispositif.Structures")}</h5>
        <Row className="sponsor-images">
          {sponsors && sponsors.map((sponsor, key) => {
            return (
              <Col key={key} className="sponsor-col">
                <div className="image-wrapper">
                  <a href={((sponsor.link || "").includes("http") ? "" : "http://") + sponsor.link} target="_blank" rel="noopener noreferrer">
                    {sponsor.picture && sponsor.picture.secure_url ?
                      <img className="sponsor-img" src={sponsor.picture.secure_url} alt={sponsor.alt} /> : 
                      <span className="default-logo">{sponsor.type === "Not found" ? "A déterminer par la suite" : sponsor.acronyme ? (sponsor.acronyme + " - " + sponsor.nom) : sponsor.alt}</span>}
                  </a>
                  {!disableEdit && 
                    <div className="delete-icon" onClick={()=>deleteSponsor(key)}>
                      <Icon name="minus-circle" fill={variables.darkColor} size="xlarge"/>
                    </div>}
                </div>
              </Col>
            )}
          )}
          
          {!disableEdit && 
            <Col>
              <div className="add-sponsor" onClick={()=>this.toggleModal("responsabilite")}>
                <EVAIcon className="add-sign backgroundColor-darkColor" name="plus-outline" />
                <span className="add-text color-darkColor">Ajouter une structure</span>
              </div>
            </Col>}
        </Row>
        
        <CustomModal 
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal= {modal}
          keyValue= {0}
          title="Responsabilité du dispositif"
          lowerLeftBtn={<FButton type="outline-black" name="info-outline" fill={variables.noir}>En savoir plus</FButton>}
          lowerRightBtn={<FButton type="dark" name="paper-plane-outline" fill={variables.noir} disabled={(!checked || (!user.email && !user.phone)) && !mesStructures.some(x => x.checked)} onClick={this.validerRespo}>Valider</FButton>} 
        >
          <p>Pour assurer la mise à jour des informations, nous devons relier ce dispositif à sa structure d’origine. Merci de la renseigner ci-dessous :</p>
          
          {mesStructures.length > 0 &&
            mesStructures.map((struct, key) => (
              <FormGroup check className="ma-structure mb-10" key={struct._id}>
                <Label check>
                  <Input type="checkbox" checked={struct.checked} onChange={()=> this.handleStructChange(struct._id)} />{' '}
                  <b>Ma structure : </b>{struct.nom}
                </Label>
              </FormGroup>
            ))}

          <SearchBar 
            isArray
            structures
            loupe
            className="search-bar inner-addon right-addon"
            placeholder = "Rechercher ou créer une structure"
            array={[...structures.filter(x => x.status === 'Actif'), {createNew: true}]}
            selectItem={this.selectItem} />

          <FormGroup check className="case-cochee mt-10">
            <Label check>
              <Input type="checkbox" checked={checked} onChange={this.handleCheckChange} />{' '}
              Je ne sais pas quelle est la structure responsable
            </Label>
          </FormGroup>
          {this.state.checked && 
            <>
              <div className="warning-bloc bg-attention mt-10">
                <EVAIcon name="alert-triangle-outline" fill={variables.noir} className="info-icon" />
                <b>Structure inconnue</b>
                <p>Pas d’inquiétude, nous allons essayer de trouver ensemble la structure d’origine de ce dispositif. Merci de nous donner au moins un moyen de contact pour que nous échangions ensemble sur l’origine de ce dispositif.</p>
              </div>
              <div className="form-field">
                <InputGroup>
                  <EVAIcon className="input-icon" name="at-outline" fill={variables.noir}/>
                  <Input id="email" placeholder="Entrez votre email pour que nous puissions vous contacter" value={user.email || ""} onChange={this.handleUserChange} name="user" />
                </InputGroup>
                <InputGroup>
                  <EVAIcon className="input-icon" name="phone-outline" fill={variables.noir}/>
                  <Input id="phone" placeholder="Ou votre numéro de téléphone pour un contact plus rapide" value={user.phone || ""} onChange={this.handleUserChange} name="user" />
                </InputGroup>
              </div>
            </>}
        </CustomModal>
        
        <CustomModal 
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal= {{name: "etVous"}}
          keyValue= {1}
          title="Et vous ?"
          lowerLeftBtn={<FButton type="outline-black" name="info-outline" fill={variables.noir}>En savoir plus</FButton>}
          lowerRightBtn={<FButton type="dark" name="paper-plane-outline" fill={variables.noir} onClick={this.addSponsor}>Valider</FButton>} 
        >
          <p>
            <span>Faites-vous partie de cette structure</span>
            <EVAIcon className="float-right" id="alt-tooltip" name="info" fill={variables.noir} />
            <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="alt-tooltip" toggle={this.toggleTooltip}>
              Si oui, nous enverrons une demande d’ajout à un responsable de la structure. Si non, la propriété de la page lui sera transférée pour qu’il puisse vérifier les informations.
            </Tooltip>
          </p>
      
          <div className='selection-wrapper bg-validation mb-10'>
            {selected.picture && selected.picture.secure_url && 
              <img src={selected.picture.secure_url} className="selection-logo mr-10" alt="logo de structure" />}
            <span>{selected.acronyme} - {selected.nom}</span>
          </div>

          <FormGroup check className="author-choice mb-10">
            <Label check>
              <Input type="checkbox" checked={this.state.authorBelongs} onChange={this.handleBelongsSChange} />{' '}
              <b>Oui et je veux contribuer en tant que membre</b>
            </Label>
          </FormGroup>
          <FormGroup check className="author-choice">
            <Label check>
              <Input type="checkbox" checked={!this.state.authorBelongs} onChange={this.handleBelongsSChange} />{' '}
              <b>Non et j’accepte que la structure reprenne le droit d’édition</b>
            </Label>
          </FormGroup>
        </CustomModal>

        <CustomModal 
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal= {{name: "creation"}}
          keyValue= {2}
          title="Créer une structure"
          lowerLeftBtn={<FButton type="outline-black" name="search-outline" fill={variables.noir} onClick={() => this.toggleModal("responsabilite")}>Rechercher une structure</FButton>}
          lowerRightBtn={<FButton type="validate" name="plus-circle-outline" onClick={this.createStructure}>Ajouter</FButton>} 
        >
          <CreationContent
            handleChange={this.handleChange} 
            handleBelongsChange={this.handleBelongsChange}
            {...this.state.structure} />
          <div className="warning-bloc bg-attention">
            <EVAIcon name="info-outline" fill={variables.noir} className="info-icon" />
            Notre équipe va vous contacter d’ici 7 jours pour confirmer la création. Vous allez recevoir un e-mail de confirmation.&nbsp;
            <b>Bienvenue !</b>
          </div>
        </CustomModal>

        <CustomModal 
          showModals={showModals}
          toggleModal={this.toggleModal}
          modal= {{name: "envoye"}}
          keyValue= {3}
          title="C’est envoyé !"
          lowerLeftBtn={<FButton type="outline-black" name="info-outline" fill={variables.noir} onClick={this.upcoming}>En savoir plus</FButton>}
          lowerRightBtn={<FButton type="validate" name="checkmark-circle-outline" onClick={()=>this.toggleModal("envoye")}>Ok !</FButton>} 
        >
          <div className="envoye-content">
            <img src={sentIllu} className="illu" alt="illustration" />
            {selected.nom? 
              (authorBelongs ? 
                (<>
                  <h5 className="mb-10">Votre demande est soumise aux reponsables de :</h5>
                  <div className='selection-wrapper mb-10'>
                    {selected.picture && selected.picture.secure_url && 
                      <img src={selected.picture.secure_url} className="selection-logo mr-10" alt="logo de structure" />}
                    <span>{selected.acronyme} - {selected.nom}</span>
                  </div>
                  <div className="contenu">
                    Vous devriez être ajouté en tant que membre sous 7 jours.
                    <br/>N’hésitez pas à les joindre directement si vous les connaissez.
                    <br/><b>Merci infiniment pour votre contribution !</b>
                  </div>
                </>) :
                (<>
                  <h5 className="mb-10">Votre contenu va être transféré à la structure :</h5>
                  <div className='selection-wrapper mb-10'>
                    {selected.picture && selected.picture.secure_url && 
                      <img src={selected.picture.secure_url} className="selection-logo mr-10" alt="logo de structure" />}
                    <span>{selected.acronyme} - {selected.nom}</span>
                  </div>
                  <div className="contenu">
                    Les responsables de la structure vont prendre le relais. 
                    <br/>N’hésitez pas à les joindre directement si vous les connaissez.
                    <br/><b>Merci infiniment pour votre contribution !</b>
                  </div>
                </>) ) :
              (<>
                <h5 className="mb-10">Votre structure est en cours de création</h5>
                <div className="contenu mb-10"><b>L’équipe Agi’r va prendre contact avec vous sous 7 jours pour vérifier vos informations.</b></div>
                <div className="contenu"><b>Merci de rejoindre l’aventure !</b></div>
              </>)}
            
          </div>
        </CustomModal>
      </div>
    )
  }
}

const CustomModal = props => (
  <Modal isOpen={props.showModals[props.keyValue].show} toggle={()=>props.toggleModal(props.modal.name)} className='modal-structure' key={props.keyValue}>
    <ModalBody>
      <h3>{props.title}</h3>
      {props.children}
    </ModalBody>
    <ModalFooter>
      {props.lowerLeftBtn}
      {props.lowerRightBtn}
    </ModalFooter>
  </Modal>
)


const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    hasStructure: state.user.hasStructure,
    structures: state.structure.structures,
  }
}

const mapDispatchToProps = {update_user}

export default connect(mapStateToProps, mapDispatchToProps)(Sponsors);