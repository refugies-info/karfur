import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FButton from "../../UI/FButton/FButton";
import { responsableFiche } from "../../../assets/figma";
import styles from "./ResponsableModal.module.scss";
import Image from "next/legacy/image";

interface Props {
  show: boolean;
  toggleModal: any;
  name: string;
  update_status: any;
  editDispositif: any;
}

const ResponsableModal = (props: Props) => {
  const validateModal = async () => {
    props.update_status("Accepté structure");
    props.editDispositif();
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
        toggle={() => props.toggleModal(false, props.name)}
        className={styles.modal_header}
      >
        {"Super !"}
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        <Image
          src={responsableFiche}
          className={styles.img}
          alt="responsable-fiche"
        />
        <h5>
          Vous êtes responsable d’une nouvelle fiche
        </h5>
        <p>
          Nous comptons sur vous pour maintenir ce contenu à jour et
          répondre aux suggestions des contributeurs.
        </p>
      </ModalBody>
      <ModalFooter>
        <div className={styles.footer_inner}>
          <p>Dernière étape : correction et validation</p>
          <FButton
            type="validate"
            name="arrow-forward-outline"
            onClick={validateModal}
          >
            D&apos;accord
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ResponsableModal;
