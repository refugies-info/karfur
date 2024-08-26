import iconMap from "@/assets/recherche/icon-map.svg";
import NotDeployed from "@/assets/recherche/not_deployed_image.png";
import { GoToDesktopModal, ReceiveInvitationMailModal } from "@/components/Modals";
import EVAIcon from "@/components/UI/EVAIcon/EVAIcon";
import FButton from "@/components/UI/FButton";
import useWindowSize from "@/hooks/useWindowSize";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useCallback, useState } from "react";
import { Button } from "reactstrap";
import { getPath } from "routes";
import styles from "./NotDeployedBanner.module.scss";

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
          <span className="ms-1">
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
            <Link legacyBehavior href={getPath("/publier", router.locale)} prefetch={false}>
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
          <EVAIcon name="close-outline" fill="dark" className="ms-2" />
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
