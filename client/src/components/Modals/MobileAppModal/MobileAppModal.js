import React from "react";
import {
  Modal,
  ModalBody,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import "./MobileAppModal.scss";
import { FButtonMobile } from "../../FigmaUI/FButtonMobile/FButtonMobile";
import { colors } from "../../../colors";
import illuMobileApp from "../../../assets/illu_mobile_app.png";
import { isIOS } from "react-device-detect";


const languageModal = (props) => {
  const { t } = props;
  const storeLink = isIOS ?
    "https://apps.apple.com/app/id1595597429" :
    "https://play.google.com/store/apps/details?id=com.refugiesinfo.app";


  if (props.show) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="mobile-app-modal"
      >
        <ModalBody>
          <section>
            <a href={storeLink}>
              <img
                src={illuMobileApp}
                width={268}
                height={232}
              />
            </a>
            <h1>{t("MobileAppModal.Application mobile disponible", "Application mobile disponible !")}</h1>
            <p>{t("MobileAppModal.Gratuite et plus facile à utiliser", "Gratuite et plus facile à utiliser :")}</p>
            <div className="close-button">
              <FButtonMobile
                name="close-outline"
                fill={colors.noir}
                color={colors.blancSimple}
                onClick={props.toggle}
                t={t}
                title="MobileAppModal.Rester sur le navigateur"
                defaultTitle="Rester sur le navigateur"
              />
            </div>
            <FButtonMobile
              name="external-link-outline"
              fill={colors.blancSimple}
              color={colors.validationDefault}
              onClick={() => window.open(storeLink)}
              t={t}
              title="MobileAppModal.Télécharger l'application"
              defaultTitle="Télécharger l'application"
            />
          </section>
        </ModalBody>
      </Modal>
    );
  }
  return false;
};

export default withTranslation()(languageModal);
