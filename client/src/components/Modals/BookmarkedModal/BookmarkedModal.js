import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NavLink } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { withTranslation } from "react-i18next";

import EVAIcon from "../../UI/EVAIcon/EVAIcon";

import "./BookmarkedModal.scss";
import { colors } from "colors";
import FButton from "../../FigmaUI/FButton/FButton";

const bookmarkedModal = (props) => {
  const { show, toggle, success, t } = props;
  return (
    <Modal isOpen={show} toggle={toggle} className="bookmark-modal">
      <ModalHeader toggle={toggle}>
        <div className={"bookmark-icon" + (success ? " success" : " oups")}>
          <EVAIcon name={"bookmark"} fill={colors.blanc} />
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
            <NavHashLink to="/backend/user-favorites">
              <b>{t("Dispositif.Mes favoris", "Mes favoris")}</b>
            </NavHashLink>
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
            <NavLink
              to={{
                pathname: "/login",
              }}
            >
              <FButton type="login" name={"log-in-outline"}>
                {t("Toolbar.Connexion", "Connexion")}
              </FButton>
            </NavLink>
            <NavLink
              to={{
                pathname: "/register",
              }}
            >
              <FButton
                type="signup"
                name={"person-add-outline"}
                className="mr-10"
              >
                {t("Toolbar.Inscription", "Inscription")}
              </FButton>
            </NavLink>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default withTranslation()(bookmarkedModal);
