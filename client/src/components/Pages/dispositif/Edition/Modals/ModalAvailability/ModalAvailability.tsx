import Button from "components/UI/Button";
import React from "react";
import BaseModal from "../BaseModal";
import styles from "./ModalAvailability.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Si c’est variable selon le profil : il faut cocher la case “cette question ne me concerne pas”",
};

const ModalAvailability = (props: Props) => {
  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      help={help}
      title="Quelle est la durée d’engagement total demandée ?"
    >
      <div>
        <div className="text-end">
          <Button icon="arrow-right" iconPlacement="end">
            Étape suivante
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalAvailability;
