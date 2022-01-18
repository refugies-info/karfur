import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FButton from "../../FigmaUI/FButton/FButton";
import { responsableFiche } from "../../../assets/figma";
// import "./ResponsableModal.scss";

class ResponsableModal extends Component {
  validateModal = async () => {
    this.props.update_status("Accepté structure");
    this.props.editDispositif();
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
          {"Super !"}
        </ModalHeader>
        <ModalBody className={"first-step"}>
          {
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
            </>
          }
        </ModalBody>
        <ModalFooter>
          {
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
                D'accord
              </FButton>
            </div>
          }
        </ModalFooter>
      </Modal>
    );
  }
}

export default ResponsableModal;
