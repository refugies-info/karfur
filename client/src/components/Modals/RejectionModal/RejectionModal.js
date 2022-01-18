import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FButton from "../../FigmaUI/FButton/FButton";
import { rejectionFiche } from "../../../assets/figma";
// import "./RejectionModal.scss";

class RejectionModal extends Component {
  state = {
    memberAdded: false,
    makeContrib: false,
    step: 0,
  };

  handleCheckChange = () =>
    this.setState((pS) => ({ makeContrib: !pS.makeContrib }));

  addMember = () => {
    this.setState({ memberAdded: true });
  };

  validateModal = async () => {
    this.props.update_status("Rejeté structure");
    this.props.toggleModal(false, this.props.name);
  };

  render() {
    const { show, name, toggleModal } = this.props;
    return (
      <Modal
        isOpen={show}
        toggle={() => toggleModal(false, name)}
        className="modal-responsable"
      >
        <ModalHeader toggle={() => toggleModal(false, name)}>
          {"Êtes-vous sûr ?"}
        </ModalHeader>
        <ModalBody className={"first-step"}>
          <img
            src={rejectionFiche}
            className="inspection-img"
            alt="rejection-fiche"
          />
          <h5 className="texte-rouge">
            Attention : vous allez refuser cette nouvelle fiche
          </h5>
          <p>
            Refusez la fiche si elle existe déjà, si elle traite de sujets qui
            n’ont rien à voir avec votre structure ou si elle comporte des
            éléments offensants. Pas de panique, nous prenons le relais.
          </p>

          {/*userBelongs && createur && createur._id && createur.username && !((mainSponsor || {}).membres || []).some(x => x.userId === createur._id) &&
                <>
                  <br/>
                  <p>{createur.username} a crée ce dispositif et souhaite devenir membre de votre structure. Acceptez-vous ?</p>
                  <div className={"creator-wrapper mb-10" + (memberAdded ? " member-added" : "")}>
                    <div className="creator-info">
                      {createur.picture && createur.picture.secure_url &&
                        <img className="img-circle mr-10" src={createur.picture.secure_url} alt="profile"/>}
                      <b>{(createur || {}).username}</b>
                    </div>
                    {memberAdded ?
                      <div className="texte-validationHover">
                        <b>Sera ajouté en tant que membre</b>
                      </div> :
                      <FButton type="light-action" name="person-add-outline" fill={colors.noir} onClick={this.addMember}>
                        Ajouter en tant que membre
                      </FButton>}
                  </div>
                    </>*/}
        </ModalBody>
        <ModalFooter>
          <FButton type="light" onClick={() => toggleModal(false, name)}>
            Retour
          </FButton>
          <FButton
            type="error"
            name="arrow-forward-outline"
            onClick={this.validateModal}
          >
            Je refuse
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default RejectionModal;
