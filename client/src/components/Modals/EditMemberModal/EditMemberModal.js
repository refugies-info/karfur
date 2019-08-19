import React, {Component} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';

import FButton from '../../FigmaUI/FButton/FButton';
import {roles} from './data';
import EVAIcon from '../../UI/EVAIcon/EVAIcon';
import API from '../../../utils/API'

import './EditMemberModal.scss';
import variables from 'scss/colors.scss';

class EditMemberModal extends Component {
  state={
    roles: roles, 
    selection: true
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.selected && nextProps.selected.structRole){
      this.setState({roles: roles.map(x => ({...x, checked: nextProps.selected.structRole === x.role}))})
    }
  }

  handleRoleClick = key => this.setState(pS => ({roles: pS.roles.map((x, i) => ({...x, checked: i === key}))}))

  onValidate = () => {
    const selectedRole = (this.state.roles.find(x => x.checked) || {}).role;
    const userRoles = (((this.props.structure.membres || []).find(x => x.userId === this.props.user._id) || {}).roles || []);
    if(!selectedRole || !this.props.selected || !this.props.structure || !this.props.structure._id){Swal.fire( 'Oh non!', 'Certaines informations sont manquantes', 'error'); return;}
    
    if(selectedRole === "delete" && this.state.selection){
      this.setState(pS => ({selection: !pS.selection}))
    }else{
      if(this.props.selected.structRole === "administrateur" && (this.props.structure.membres.filter(x => x.roles.includes("administrateur")) || []).length < 2 ){Swal.fire( 'Oh non!', 'Il doit toujours y avoir un responsable de structure ', 'error'); return;} //Si on change le rôle de l'administrateur il faut s'assurer qu'il en reste toujours un
      if( (this.props.selected.structRole === "administrateur" || selectedRole === "administrateur") && !userRoles.includes("administrateur") ){Swal.fire( 'Oh non!', 'Seul un responsable peut donner ou retirer les droits administrateurs', 'error'); return;} //On touche pas aux droits admins sans être admin
      if( selectedRole === "contributeur" && !userRoles.includes("administrateur") && !userRoles.includes("contributeur") ){Swal.fire( 'Oh non!', 'Seul un rédacteur peut donner ou retirer les droits d\'édition', 'error'); return;} //On touche pas aux droits admins sans être admin
      
      let structure={};
      if(selectedRole === "delete"){
        if( !userRoles.includes("administrateur") ){Swal.fire( 'Oh non!', 'Seul un administrateur peut supprimer un membre', 'error'); return;} //On supprime pas un membre sans être admin
        structure={
          _id: this.props.structure._id,
          '$pull': { membres : {'userId': this.props.selected._id } },
        };
      }else if(["membre", "contributeur", "administrateur"].includes(selectedRole)){
        structure={
          _id: this.props.structure._id,
          membreId: this.props.selected._id,
          '$set':  {'membres.$.roles': [selectedRole]},
        };
      }
      API.create_structure(structure).then((data) => {
        console.log(data);
        Swal.fire( 'Yay...', 'La mise à jour a bien été effectuée, merci', 'success');
        this.props.initializeStructure();
        this.props.toggle();
      })
    } 
  }

  render(){
    const {show, toggle, selected} = this.props;
    const {selection} = this.state;
    return(
      <Modal isOpen={show} toggle={toggle} className="edit-member-modal">
        <ModalHeader toggle={toggle}>
          {selection ? "Droits d’édition" : "Confirmation"}
        </ModalHeader>
        <ModalBody>
          {selection ? 
            <>
              <div className="sub-header mb-10">
                <span>Modifiez les droits d’édition de :</span>
                <div className="user-card">
                  {selected.picture && selected.picture.secure_url &&
                    <img className="user-img mr-10" src={selected.picture.secure_url} alt={selected.alt} />}
                  {selected.username}
                </div>
              </div>
              <ListGroup>
                {this.state.roles.map( (role, key) => (
                  <ListGroupItem action key={key} className={"mb-10" + (role.role==="delete" ? " delete-item" : "")} onClick={() => this.handleRoleClick(key)}>
                    <Row>
                      <Col lg={role.role==="delete" ? "11" : "4"}><b>{role.titre}</b></Col>
                      {role.contenu && <Col lg="7">{role.contenu}</Col>}
                      <Col lg="1"><EVAIcon name={"radio-button-" + (role.checked ? "on" : "off")} fill={variables.noir} /></Col>
                    </Row>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </> :
            <div className="confirmation-block">
              Êtes-vous sûr de vouloir enlever {selected.username} de votre structure ?
            </div>}
        </ModalBody>
        <ModalFooter>
          <FButton type="light" onClick={toggle}>
            Plus tard
          </FButton>
          <FButton type="validate" name="checkmark-circle-outline" onClick={this.onValidate}>
            {selection ? "D'accord" : "Oui"}
          </FButton>
        </ModalFooter>
      </Modal>
    )
  }
}

export default EditMemberModal;