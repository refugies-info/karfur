import TutorielImage from "~/assets/dispositif/tutoriel-image.svg";
import BaseModal from "~/components/UI/BaseModal";
import Button from "~/components/UI/Button";
import Image from "~/components/UI/Image";
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
          Vous êtes sur le point de faire des modifications sur votre fiche. Une fois terminée,
          pensez à bien <strong>valider votre fiche</strong> pour que vos modifications soient
          envoyées pour relecture à notre équipe éditoriale puis traduites en 7 langues.
        </p>
        <p className={styles.info}>
          <i className="ri-information-fill" />
          Pensez bien à faire toutes vos modifications avant de les envoyer pour traduction. Sinon,
          les traducteurs travaillent deux fois de suite sur votre fiche.
        </p>
        <div className="mb-8 flex justify-center">
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
