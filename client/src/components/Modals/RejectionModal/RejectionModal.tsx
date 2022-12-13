import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FButton from "components/UI/FButton/FButton";
import { rejectionFiche } from "assets/figma";
import styles from "./RejectionModal.module.scss";
import Image from "next/legacy/image";

interface Props {
  show: boolean
  name: string
  toggleModal: any
  update_status: any
}

const RejectionModal = (props: Props) => {
  const validateModal = async () => {
    props.update_status("Rejeté structure");
    props.toggleModal(false, props.name);
  };

    return (
      <Modal
        isOpen={props.show}
        toggle={() => props.toggleModal(false, props.name)}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <ModalHeader
          className={styles.modal_header}
          toggle={() => props.toggleModal(false, props.name)}
        >
          {"Êtes-vous sûr ?"}
        </ModalHeader>
        <ModalBody className={styles.modal_body}>
          <Image
            src={rejectionFiche}
            className={styles.img}
            alt="rejection-fiche"
          />
          <h5 className={styles.red_text}>
            Attention : vous allez refuser cette nouvelle fiche
          </h5>
          <p>
            Refusez la fiche si elle existe déjà, si elle traite de sujets qui
            n’ont rien à voir avec votre structure ou si elle comporte des
            éléments offensants. Pas de panique, nous prenons le relais.
          </p>
        </ModalBody>
        <ModalFooter className={styles.modal_footer}>
          <FButton type="white" onClick={() => props.toggleModal(false, props.name)}>
            Retour
          </FButton>
          <FButton
            type="error"
            name="arrow-forward-outline"
            onClick={validateModal}
          >
            Je refuse
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }

export default RejectionModal;
