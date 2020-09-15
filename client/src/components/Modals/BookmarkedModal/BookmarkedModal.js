import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { NavLink } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { withTranslation } from "react-i18next"

import EVAIcon from "../../UI/EVAIcon/EVAIcon";

import "./BookmarkedModal.scss";
import variables from "scss/colors.scss";
import FButton from "../../FigmaUI/FButton/FButton";

const bookmarkedModal = (props) => {
  const { show, toggle, success, t } = props;
  return (
    <Modal isOpen={show} toggle={toggle} className="bookmark-modal">
      <ModalHeader toggle={toggle}>
        <div className={"bookmark-icon" + (success ? " success" : " oups")}>
          <EVAIcon name={"bookmark"} fill={variables["blanc"]} />
        </div>
        <div>{success ? "Sauvegardé !" : "Oups."}</div>
      </ModalHeader>
      <ModalBody>
        {success ? (
          <>
            Votre recherche est désormais disponible dans votre profil dans la
            rubrique{" "}
            <NavHashLink to="/backend/user-profile#mes-favoris">
              <b>Mes favoris</b>
            </NavHashLink>
          </>
        ) : (
          <>
            <b>Connectez-vous</b> ou <b>créez un compte</b> pour retrouver
            facilement vos fiches favorites dans votre espace personnel.
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {success ? (
          <>
            <FButton
              type={success ? "validate" : "light-action"}
              name={success && "checkmark-circle-outline"}
              onClick={props.toggle}
            >
              {success ? "Merci !" : "Non merci"}
            </FButton>
            {!success && (
              <FButton
                tag={NavLink}
                to="/login"
                type="validate"
                name="checkmark-circle-outline"
              >
                Créer un compte
              </FButton>
            )}
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
