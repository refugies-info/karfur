import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import Icon from 'react-eva-icons';
import {NavLink} from 'react-router-dom';

import './BookmarkedModal.scss'

const bookmarkedModal = (props) => {
  return(
    <Modal isOpen={props.showBookmarkModal} toggle={props.toggleBookmarkModal} className="bookmark-modal">
      <ModalHeader>
        <span>Recherche sauvegardée</span>
        <i className="bookmark-icon">
          <Icon name="bookmark" fill="#F6B93B" size="xlarge" />
        </i>
      </ModalHeader>
      <ModalBody>
        Votre recherche est désormais disponible dans votre profil dans la rubrique&nbsp;
        <NavLink to="/"><b>Mes recherches</b></NavLink>
      </ModalBody>
      <ModalFooter>
        <Button block color="secondary" onClick={props.toggleBookmarkModal} className="btn-go">
          <Icon name="arrow-forward-outline" fill="#3D3D3D" size="large" />
          Aller voir
        </Button>
        <Button block color="success" onClick={props.toggleBookmarkModal}>Ok merci</Button>
      </ModalFooter>
    </Modal>
  )
}

export default bookmarkedModal;