import React from "react";
import {
  Modal,
  ModalBody,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { FButtonMobile } from "../../FigmaUI/FButtonMobile/FButtonMobile";
import { colors } from "../../../colors";
import illuMobileApp from "../../../assets/illu_mobile_app.png";
import { isIOS } from "react-device-detect";
import {
  iosStoreLink,
  androidStoreLink
} from "../../../assets/storeLinks";
import styles from "./MobileAppModal.module.scss";

interface Props {
  show: boolean
  toggle: any
}

const LanguageModal = (props: Props) => {
  const { t } = useTranslation();
  const storeLink = isIOS ? iosStoreLink : androidStoreLink;

  if (props.show) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <ModalBody className={styles.modal_body}>
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
            <div className={styles.close_btn}>
              <FButtonMobile
                name="close-outline"
                fill={colors.noir}
                color={colors.blancSimple}
                onClick={props.toggle}
                isDisabled={false}
                title="MobileAppModal.Rester sur le navigateur"
                defaultTitle="Rester sur le navigateur"
              />
            </div>
            <FButtonMobile
              name="external-link-outline"
              fill={colors.blancSimple}
              color={colors.validationDefault}
              onClick={() => window.open(storeLink)}
              isDisabled={false}
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

export default LanguageModal;