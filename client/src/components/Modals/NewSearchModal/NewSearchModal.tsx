import React from "react";
import { useTranslation } from "next-i18next";
import { ModalBody, ModalFooter } from "reactstrap";
import { cls } from "lib/classname";
import FButton from "components/UI/FButton/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Modal from "../Modal";
import styles from "./NewSearchModal.module.scss";

interface Props {
  show: boolean;
  toggle: any;
}

const NewSearchModal = (props: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.show}
      toggle={props.toggle}
      className={styles.modal}
      modalHeader={<p className={cls(styles.title, "h2")}>La recherche a évolué&nbsp;!</p>}
    >
      <ModalBody>
        <p className={styles.text}>On vous explique tout dans cette courte vidéo.</p>

        <div className={styles.video}>
          <iframe
            src="https://www.youtube.com/embed/l_lAnr_v7Co?controls=0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        <FButton type="outline-black" name="log-out-outline" onClick={props.toggle} className={styles.quit}>
          Quitter
        </FButton>
        <FButton type="validate" onClick={props.toggle}>
          {t("Recherche.notDeployedOkLink", "J’ai compris")}
          <EVAIcon name="arrow-forward-outline" fill="white" size={20} className="ms-2" />
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export default NewSearchModal;
