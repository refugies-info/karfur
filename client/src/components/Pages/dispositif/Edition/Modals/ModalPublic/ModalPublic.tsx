import Button from "components/UI/Button";
import React from "react";
import BaseModal from "../BaseModal";
import styles from "./ModalPublic.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez-les seulement si ce sont vraiment des critères exluant le cas échéant.",
};

const ModalPublic = (props: Props) => {
  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="À quel public s'adresse votre action ?">
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

export default ModalPublic;
