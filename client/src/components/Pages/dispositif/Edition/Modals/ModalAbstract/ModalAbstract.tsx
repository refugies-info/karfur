import Button from "components/UI/Button";
import React from "react";
import BaseModal from "../BaseModal";
import styles from "./ModalAbstract.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette phrase ?",
  content: "Cette phrase sera visible uniquement sur la tuile des résultats de recherche.",
};

const ModalAbstract = (props: Props) => {
  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Ajoutez un résumé">
      <div>
        <div className="text-end">
          <Button icon="checkmark-circle-2" iconPlacement="end" onClick={props.toggle}>
            Valider
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalAbstract;
