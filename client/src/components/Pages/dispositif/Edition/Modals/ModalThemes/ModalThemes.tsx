import Button from "components/UI/Button";
import React from "react";
import BaseModal from "../BaseModal";
import styles from "./ModalThemes.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi servent les thèmes ?",
  content: (
    <>
      <p>Votre fiche sera « rangée » dans les thèmes que vous choisissez.</p>
      <p>Un usager pourra ainsi facilement trouver votre fiche lorsqu’il explorera ces thèmes.</p>
    </>
  ),
};

const ModalThemes = (props: Props) => {
  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="Choix des thèmes de votre action">
      <div>
        <div className="text-end">
          <Button icon="checkmark-circle-2" iconPlacement="end">
            Valider
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalThemes;
