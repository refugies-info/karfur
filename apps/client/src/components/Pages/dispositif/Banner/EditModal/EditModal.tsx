import React from "react";
import Image from "next/image";
import Button from "components/UI/Button";
import BaseModal from "components/UI/BaseModal";
import TutorielImage from "assets/dispositif/tutoriel-image.svg";
import styles from "./EditModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onValidate: () => void;
}

const EditModal = (props: Props) => {
  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      title="Vous allez faire des modifications sur une fiche publiée"
      small
    >
      <div>
        <p>
          Vous êtes sur le point de faire des modifications sur votre fiche. Une fois terminée, pensez bien à valider
          votre fiche pour que celles-ci soient prises en compte puis traduites en 7 langues.
        </p>
        <div className="text-center mb-8">
          <Image src={TutorielImage} width={176} height={120} alt="" />
        </div>
        <div className="text-end">
          <Button onClick={props.onValidate} evaIcon="checkmark-circle-2" iconPosition="right">
            C'est noté
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditModal;
