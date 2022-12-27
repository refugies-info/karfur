import React, { memo, useCallback, useState } from "react";
import { Button } from "reactstrap";
import Image from "next/legacy/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import useWindowSize from "hooks/useWindowSize";
import FButton from "components/UI/FButton";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { GoToDesktopModal, ReceiveInvitationMailModal } from "components/Modals";
import NotDeployed from "assets/recherche/not_deployed_image.png";
import iconMap from "assets/recherche/icon-map.svg";
import styles from "./NotDeployedBanner.module.scss";
import { getPath } from "routes";
import { useRouter } from "next/router";

interface Props {
  departments: string[];
  hideBanner: () => void;
}

const NotDeployedBanner = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isMobile } = useWindowSize();
  const [showGoToDesktopModal, setShowGoToDesktopModal] = useState(false);
  const [showInvitationEmailModal, setShowInvitationEmailModal] = useState(false);

  const toggleGoToDesktopModal = useCallback(() => {
    setShowGoToDesktopModal((s) => !s);
  }, []);
  const toggleShowInvitationEmailModal = useCallback(() => {
    setShowInvitationEmailModal((s) => !s);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image src={NotDeployed} width={146} height={71} alt="" />
      </div>
      <div>
        <p className={styles.title}>
          <span className={styles.map_icon}>
            <Image src={iconMap} width={16} height={16} alt="" />
          </span>
          <span className="ml-1">
            {props.departments.join(", ")}
            {t("Recherche.notDeployedTitle")}
          </span>
          <Button className={styles.mobile_btn} onClick={props.hideBanner}>
            <EVAIcon name="close-outline" fill="dark" size={32} />
          </Button>
        </p>
        <p className="mb-0">
          {t("Recherche.notDeployedText")}
          {!isMobile ? (
            <Link legacyBehavior href={getPath("/publier", router.locale)}>
              <a className={styles.link}>{t("Recherche.notDeployedWriteLink", "Rédiger une fiche")}</a>
            </Link>
          ) : (
            <button className={styles.link} onClick={toggleGoToDesktopModal}>
              {t("Recherche.notDeployedWriteLink", "Rédiger une fiche")}
            </button>
          )}
        </p>
      </div>
      <div className={styles.actions}>
        <FButton type="white" className={styles.btn} onClick={props.hideBanner}>
          {t("Recherche.notDeployedOkLink", "J'ai compris")}
          <EVAIcon name="close-outline" fill="dark" className="ml-2" />
        </FButton>
      </div>

      {isMobile && (
        <>
          <GoToDesktopModal
            toggle={toggleGoToDesktopModal}
            show={showGoToDesktopModal}
            toggleShowInvitationEmailModal={toggleShowInvitationEmailModal}
          />
          <ReceiveInvitationMailModal
            toggle={toggleShowInvitationEmailModal}
            show={showInvitationEmailModal}
            togglePreviousModal={toggleGoToDesktopModal}
          />
        </>
      )}
    </div>
  );
};

export default memo(NotDeployedBanner);
