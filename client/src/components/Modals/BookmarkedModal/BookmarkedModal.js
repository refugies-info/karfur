import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useTranslation } from "react-i18next";
import Link from "next/link";

import EVAIcon from "../../UI/EVAIcon/EVAIcon";

import { colors } from "colors";
import FButton from "../../FigmaUI/FButton/FButton";
import styles from "./BookmarkedModal.module.scss";

const BookmarkedModal = (props) => {
  const { t } = useTranslation();
  const { show, toggle, success } = props;
  return (
    <Modal isOpen={show} toggle={toggle} className={styles.bookmark_modal}>
      <ModalHeader toggle={toggle}>
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
      <ModalBody>
        {success ? (
          <>
            {t(
              "Dispositif.favoriSaved",
              "Votre recherche est désormais disponible dans votre profil dans la rubrique"
            )}{" "}
            <Link href="/backend/user-favorites">
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
      <ModalFooter>
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
            <Link
              to={{
                pathname: "/login",
              }}
            >
              <FButton type="login" name={"log-in-outline"} tag="a">
                {t("Toolbar.Connexion", "Connexion")}
              </FButton>
            </Link>
            <Link href={{ pathname: "/register" }}>
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
