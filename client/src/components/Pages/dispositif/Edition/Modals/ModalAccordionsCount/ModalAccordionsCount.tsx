import React from "react";
import Image from "next/image";
import BaseModal from "components/UI/BaseModal";
import Button from "components/UI/Button";
import TutorielImage from "assets/dispositif/tutoriel-image.svg";
import styles from "./ModalAccordionsCount.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalAccordionsCount = (props: Props) => {
  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      title="Vous devez ajouter des arguments pour décrire votre action"
      small
    >
      <div className={styles.content}>
        <p>
          Pour permettre à votre public de mieux comprendre les atouts de votre action, vous devez désormais ajouter 3
          arguments minimum dans la section "Pourquoi c'est intéressant".
        </p>
        <div className="text-center mb-8">
          <Image src={TutorielImage} width={176} height={120} alt="" />
        </div>

        <div className="text-end">
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              props.toggle();
            }}
            evaIcon="checkmark-circle-2"
            iconPosition="right"
          >
            C'est noté !
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalAccordionsCount;
