import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/FigmaUI/FButton/FButton";
import { colors } from "colors";
import styles from "./BookmarkedModal.module.scss";

interface Props {
  show: boolean
  toggle: () => void
  success: boolean
}

const BookmarkedModal = (props: Props) => {
  const { t } = useTranslation();
  const { show, toggle, success } = props;

  return (
    <Modal
      isOpen={show}
      toggle={toggle}
      className={styles.bookmark_modal}
      contentClassName={styles.modal_content}
    >
      <ModalHeader
        toggle={toggle}
        className={styles.modal_header}
      >
        <div
          className={`${styles.bookmark_icon} ${
            success ? styles.success : styles.oups
          }`}
        >
          <EVAIcon name="star" fill={colors.blanc} />
        </div>
        <div>
          {success
            ? t("Dispositif.Sauvegardé", "Sauvegardé !")
            : t("Dispositif.Oups", "Oups !")}
        </div>
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        {success ? (
          <>
            {t(
              "Dispositif.favoriSaved",
              "Votre recherche est désormais disponible dans votre profil dans la rubrique"
            )}{" "}
            <Link href="/backend">
              <a>{t("Dispositif.Mes favoris", "Mes favoris")}</a>
            </Link>
          </>
        ) : (
          <>
            <b>{t("Dispositif.Connectez-vous", "Connectez-vous")} </b>
            {t("ou", "ou")}{" "}
            <b>{t("Dispositif.créez un compte", "créez un compte")}</b>{" "}
            {t(
              "Dispositif.favoriExplanation",
              "pour retrouver facilement vos fiches favorites dans votre espace personnel."
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        {success ? (
          <>
            <FButton
              type={"validate"}
              name={"checkmark-circle-outline"}
              onClick={props.toggle}
            >
              {t("Dispositif.Merci", "Merci !")}
            </FButton>
          </>
        ) : (
          <>
            <Link href="/login" passHref>
              <FButton type="login" name="log-in-outline" tag="a">
                {t("Toolbar.Connexion", "Connexion")}
              </FButton>
            </Link>
            <Link href="/register" passHref>
              <FButton
                type="signup"
                name="person-add-outline"
                className="mr-10"
                tag="a"
              >
                {t("Toolbar.Inscription", "Inscription")}
              </FButton>
            </Link>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default BookmarkedModal;
