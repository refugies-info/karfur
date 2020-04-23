import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Swal from "sweetalert2";
import _ from "lodash";

import FButton from "../../FigmaUI/FButton/FButton";
import API from "../../../utils/API";
import { inspection, responsableFiche } from "../../../assets/figma";

import "./ResponsableModal.scss";
import variables from "scss/colors.scss";

class ResponsableModal extends Component {
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
    console.log(this.state);
    if (this.state.step === 0) {
      if (this.state.memberAdded) {
        if (
          !this.props.createur ||
          !this.props.createur._id ||
          !this.props.mainSponsor ||
          !this.props.mainSponsor._id
        ) {
          Swal.fire({
            title: "Oh non!",
            text: "Certaines informations sont manquantes",
            type: "error",
            timer: 1500,
          });
          return;
        }
        let structure = {
          _id: this.props.mainSponsor._id,
          $addToSet: {
            membres: {
              userId: this.props.createur._id,
              roles: [this.state.makeContrib ? "contributeur" : "membre"],
            },
          },
        };
        await API.create_structure(structure);
      }
      this.props.update_status("Accepté structure");
      this.setState({ step: 1 });
    } else {
      this.props.editDispositif();
      this.props.toggleModal(false, this.props.name);
    }
  };

  render() {
    const {
      show,
      name,
      toggleModal,
      createur,
      mainSponsor,
      sponsors,
    } = this.props;
    const { memberAdded, step } = this.state;
    const userBelongs = _.get(sponsors, "0.userBelongs");
    return (
      <Modal
        isOpen={show}
        toggle={() => toggleModal(false, name)}
        className="modal-responsable"
      >
        <ModalHeader toggle={() => toggleModal(false, name)}>
          {step === 0 ? "Super !" : "Mieux vaut deux fois qu’une"}
        </ModalHeader>
        <ModalBody className={step === 0 ? "first-step" : "second-step"}>
          {step === 0 ? (
            <>
              <img
                src={responsableFiche}
                className="responsable-img"
                alt="responsable-fiche"
              />
              <h5 className="texte-vert">
                Vous êtes responsable d’une nouvelle fiche
              </h5>
              <p>
                Nous comptons sur vous pour maintenir ce contenu à jour et
                répondre aux suggestions des contributeurs.
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
                      <FButton type="light-action" name="person-add-outline" fill={variables.noir} onClick={this.addMember}>
                        Ajouter en tant que membre
                      </FButton>}
                  </div>
                    </>*/}
              {memberAdded && (
                <div className="contributeur-wrapper">
                  Souhaitez-vous que <b>{(createur || {}).username}</b> devienne
                  un contributeur ?
                  <div>
                    <FormGroup check className="contrib-choice mr-10 mt-12">
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={this.state.makeContrib}
                          onChange={this.handleCheckChange}
                        />{" "}
                        <b>Oui</b>
                      </Label>
                    </FormGroup>
                    <FormGroup check className="contrib-choice mt-12">
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={!this.state.makeContrib}
                          onChange={this.handleCheckChange}
                        />{" "}
                        <b>Non</b>
                      </Label>
                    </FormGroup>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <img
                src={inspection}
                className="inspection-img"
                alt="inspection"
              />
              <h5 className="text-center">
                Merci de prendre un temps pour relire ce contenu avant de nous
                l’envoyer pour validation
              </h5>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {step === 0 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  color: "gray",
                  alignSelf: "center",
                  marginBottom: 0,
                  marginRight: 10,
                }}
              >
                Dernière étape : correction et validation
              </p>
              <FButton
                type="validate"
                name="arrow-forward-outline"
                onClick={this.validateModal}
              >
                Suivant
              </FButton>
            </div>
          ) : (
            <>
              <FButton type="light" onClick={() => toggleModal(false, name)}>
                Plus tard
              </FButton>
              <FButton
                type="validate"
                name="checkmark-outline"
                onClick={this.validateModal}
              >
                D'accord
              </FButton>
            </>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}

export default ResponsableModal;
