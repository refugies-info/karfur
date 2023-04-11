import React from "react";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import styles from "./Delete.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onValidate: () => void;
}

const Delete = (props: Props) => {
  return (
    <BaseModal show={props.show} toggle={props.toggle} title="Êtes-vous sûrs de vouloir supprimer la carte ?" small>
      <div>
        <p>
          Si vous la supprimez, tous les lieux que vous avez ajoutés seront supprimés (nom, email, téléphone,
          informations pratiques).
        </p>

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

export default Delete;
