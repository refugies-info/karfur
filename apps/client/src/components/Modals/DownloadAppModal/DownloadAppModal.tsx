import Button from "@codegouvfr/react-dsfr/Button";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useCallback } from "react";
import { isIOS } from "react-device-detect";
import { Modal } from "reactstrap";
import RatingStars from "~/assets/auth/rating-stars.svg";
import MobileAppIllu from "~/assets/mobile-app-illustration.png";
import { cls } from "~/lib/classname";
import styles from "./DownloadApp.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const STORE_LINK = isIOS ? iosStoreLink : androidStoreLink;

const DownloadAppModal = ({ show, toggle }: Props) => {
  const { t } = useTranslation();
  const goToStore = useCallback(() => window.open(STORE_LINK), []);

  return (
    <Modal isOpen={show} toggle={toggle} className={styles.modal} contentClassName={styles.content}>
      <Button
        iconId="fr-icon-close-line"
        onClick={toggle}
        priority="tertiary no outline"
        title={t("close")}
        className={styles.close}
      />
      <Image src={MobileAppIllu} width={327} alt="Réfugiés.info mobile app" className={styles.illu} />

      <p className={styles.text}>{t("MobileAppModal.description")}</p>
      <div className={styles.rating}>
        <Image src={RatingStars} width={136} height={24} alt="4,8" className="me-2" />
        4,8
      </div>

      <div className={cls(styles.buttons, "mt-14")}>
        <Button
          priority="primary"
          className="mb-2"
          iconId="fr-icon-download-line"
          iconPosition="right"
          onClick={goToStore}
        >
          {t("MobileAppModal.download")}
        </Button>
        <Button priority="tertiary no outline" onClick={toggle}>
          {t("MobileAppModal.continue")}
        </Button>
      </div>
    </Modal>
  );
};

export default DownloadAppModal;
