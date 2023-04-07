import React from "react";
import Image from "next/image";
import { DispositifStatus } from "api-types";
import Button from "components/UI/Button";
import { BaseModal } from "components/Pages/dispositif";
import TutorielImage from "assets/dispositif/tutoriel-image.svg";
import styles from "./EditModal.module.scss";

interface Props {
  show: boolean;
  status: DispositifStatus | null;
  toggle: () => void;
  onValidate: () => void;
}

const EditModal = (props: Props) => {
  const isPublished = props.status === DispositifStatus.ACTIVE;

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      title={
        isPublished ? "Vous allez faire des modifications sur une fiche publiée" : "Vous allez faire des modifications"
      }
      small
    >
      <div>
        <p>
          {isPublished
            ? "Vous êtes sur le point de faire des modifications sur votre fiche. Une fois terminée, pensez bien à valider votre fiche pour que celles-ci soient prises en compte puis traduites en 8 langues."
            : "Vous êtes sur le point de faire des modifications sur votre fiche. Une fois terminée, pensez bien à valider votre fiche pour qu’elle soit à nouveau envoyée à notre équipe éditoriale pour relecture."}
        </p>
        <div className="text-center mb-8">
          <Image src={TutorielImage} width={176} height={120} alt="" />
        </div>
        <div className="text-end">
          <Button onClick={props.onValidate} icon="checkmark-circle-2" iconPlacement="end">
            C'est noté
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default EditModal;
