import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';

import EVAIcon from '../../UI/EVAIcon/EVAIcon';

import './BookmarkedModal.scss'
import variables from 'scss/colors.scss';
import FButton from '../../FigmaUI/FButton/FButton';

const bookmarkedModal = (props) => {
  const {show, toggle, success} = props;
  return(
    <Modal isOpen={show} toggle={toggle} className="bookmark-modal">
      <ModalHeader toggle={toggle}>
        <div className="bookmark-icon">
          <EVAIcon name={"bookmark" + (success ? "" : "-outline")} fill={variables[success ? "validationHover" : "noir"]} />
        </div>
        <div>{(success ? "Sauvegardé" : "Oups") + " !"}</div>
      </ModalHeader>
      <ModalBody>
        {success ? 
          <>Votre recherche est désormais disponible dans votre profil dans la rubrique{' '}
          <NavHashLink to="/backend/user-profile#mes-favoris"><b>Mes favoris</b></NavHashLink></> :
          <><b>Créez un compte en 10 secondes</b> pour garder en mémoire les pages importantes pour vous.</>}
      </ModalBody>
      <ModalFooter>
        <FButton type={success ? "validate" : "light-action"} name={success && "checkmark-circle-outline"} onClick={props.toggle}>
          {success ? "Merci !" : "Non merci"}
        </FButton>
        {!success &&
          <FButton tag={NavLink} to="/login" type="validate" name="checkmark-circle-outline">
            Créer un compte
          </FButton>}
      </ModalFooter>
    </Modal>
  )
}

export default bookmarkedModal;