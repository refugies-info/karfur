import React from "react";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import styles from "./DeleteContentModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onValidate: () => void;
}

const DeleteContentModal = (props: Props) => {
  return (
    <BaseModal show={props.show} toggle={props.toggle} title="Êtes-vous sûrs de vouloir supprimer cet élément ?" small>
      <div>
        <p>Si vous le supprimez, le contenu sera perdu.</p>

        <div className="text-end">
          <Button secondary onClick={props.toggle} icon="close-outline" iconPlacement="end" className="me-2">
            Annuler
          </Button>
          <Button onClick={props.onValidate} icon="trash-2-outline" iconPlacement="end">
            Supprimer
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default DeleteContentModal;