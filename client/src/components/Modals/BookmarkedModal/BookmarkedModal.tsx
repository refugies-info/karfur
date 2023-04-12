import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import FButton from "components/UI/FButton/FButton";
import { colors } from "colors";
import styles from "./BookmarkedModal.module.scss";
import { getPath } from "routes";

interface Props {
  show: boolean;
  toggle: () => void;
}

const BookmarkedModal = (props: Props) => {
  const { t } = useTranslation();
  const { show, toggle } = props;
  const router = useRouter();

  return (
    <Modal isOpen={show} toggle={toggle} className={styles.bookmark_modal} contentClassName={styles.modal_content}>
      <ModalHeader toggle={toggle} className={styles.modal_header}>
        <div className={`${styles.bookmark_icon} ${styles.oups}`}>
          <EVAIcon name="star" fill={colors.gray10} />
        </div>
        <div>{t("Dispositif.Oups", "Oups !")}</div>
      </ModalHeader>
      <ModalBody className={styles.modal_body}>
        {
          <>
            <b>{t("Dispositif.Connectez-vous", "Connectez-vous")} </b>
            {t("ou", "ou")} <b>{t("Dispositif.créez un compte", "créez un compte")}</b>{" "}
            {t(
              "Dispositif.favoriExplanation",
              "pour retrouver facilement vos fiches favorites dans votre espace personnel.",
            )}
          </>
        }
      </ModalBody>
      <ModalFooter className={styles.modal_footer}>
        {
          <>
            <Link legacyBehavior href={getPath("/login", router.locale)} passHref prefetch={false}>
              <FButton type="login" name="log-in-outline" tag="a">
                {t("Toolbar.Connexion", "Connexion")}
              </FButton>
            </Link>
            <Link legacyBehavior href={getPath("/register", router.locale)} passHref prefetch={false}>
              <FButton type="signup" name="person-add-outline" className="me-2" tag="a">
                {t("Toolbar.Inscription", "Inscription")}
              </FButton>
            </Link>
          </>
        }
      </ModalFooter>
    </Modal>
  );
};

export default BookmarkedModal;
