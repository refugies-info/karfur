import { Input, Modal } from "reactstrap";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import FButton from "~/components/UI/FButton/FButton";
import styles from "./ReactionLectureModal.module.scss";

interface Props {
  show: boolean;
  toggle: any;
  suggestion: any;
  delete: any;
  read: any;
}

const ReactionLectureModal = (props: Props) => {
  let suggestion = props.suggestion || {};
  const getUserName = () => (suggestion.username ? suggestion.username : "Utilisateur non connecté");

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <div className={styles.close} onClick={props.toggle}>
        <EVAIcon name="close-outline" fill="#3D3D3D" size="large" />
      </div>
      <div className={styles.modal_header}>
        Réaction{" "}
        <div className={styles.send_by}>
          Envoyée par
          <span className={styles.username}>
            {getUserName().length > 20 ? getUserName().substr(0, 20) + "..." : getUserName()}
          </span>
        </div>
      </div>

      <div className={styles.modal_body}>
        <Input
          disabled
          type="textarea"
          placeholder="Aa"
          rows={5}
          value={suggestion.text}
          id="suggestion"
          className={styles.input}
        />
        <div className={styles.about}>
          A propos de la fiche
          <span className={styles.username}>{suggestion.title}</span>
        </div>
      </div>

      <div className={styles.btn_container}>
        <FButton
          type="error"
          name="trash-2-outline"
          onClick={() => {
            props.delete(suggestion);
          }}
          className="me-4"
        >
          Supprimer
        </FButton>

        <FButton
          href={"/" + suggestion.typeContenu + "/" + suggestion.dispositifId}
          type="dark"
          name="external-link-outline"
          target="_blank"
          className="me-4"
        >
          Voir la fiche
        </FButton>

        <FButton type="validate" name="checkmark" onClick={() => props.read(suggestion)}>
          J&apos;ai lu
        </FButton>
      </div>
    </Modal>
  );
};

export default ReactionLectureModal;
