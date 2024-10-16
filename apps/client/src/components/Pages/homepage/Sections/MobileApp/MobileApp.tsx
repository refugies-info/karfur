import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Col, Container, Row } from "reactstrap";
import { assetsOnServer } from "~/assets/assetsOnServer";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { useWindowSize } from "~/hooks";
import { cls } from "~/lib/classname";
import commonStyles from "~/scss/components/staticPages.module.scss";
import { AvailableLanguageI18nCode } from "~/types/interface";
import styles from "./MobileApp.module.scss";
import MobileAppIllu from "./MobileAppIllu";
import MobileAppSmsForm from "./MobileAppSmsForm";

const MobileApp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isTablet } = useWindowSize();
  const locale: AvailableLanguageI18nCode = (router.locale || "fr") as AvailableLanguageI18nCode;

  const appStoreBadge = assetsOnServer.storeBadges.appStore[locale] || assetsOnServer.storeBadges.appStore.en;
  const playStoreBadge = assetsOnServer.storeBadges.playStore[locale] || assetsOnServer.storeBadges.playStore.en;

  const storeLinks = useMemo(
    () => (
      <>
        <a className={styles.links} href={iosStoreLink} rel="noopener noreferrer" target="_blank">
          <Image src={appStoreBadge} alt="Get it on App Store" width={160} height={50} />
        </a>
        <a className={styles.links} href={androidStoreLink} rel="noopener noreferrer" target="_blank">
          <Image src={playStoreBadge} alt="Get it on Play Store" width={160} height={50} />
        </a>
      </>
    ),
    [appStoreBadge, playStoreBadge],
  );

  const review = useMemo(() => {
    return (
      <div className={styles.reviews}>
        <div>
          <EVAIcon name="star" fill="#FCBF35" size={20} />
          <EVAIcon name="star" fill="#FCBF35" size={20} />
          <EVAIcon name="star" fill="#FCBF35" size={20} />
          <EVAIcon name="star" fill="#FCBF35" size={20} />
          <EVAIcon name="star" fill="#FCBF35" size={20} />
        </div>
        <p className="mb-0">{t("Homepage.mobileAppReviews")}</p>
      </div>
    );
  }, [t]);

  return (
    <div id="application" className={cls(commonStyles.section, commonStyles.bg_blue)}>
      <Container className={cls(commonStyles.container)}>
        <Row className="align-items-center">
          <Col sm="12" lg={{ size: "6", order: 2 }}>
            <MobileAppIllu />
            <div className={styles.store}>
              {!isTablet && storeLinks}
              {review}
            </div>
          </Col>

          <Col sm="12" lg={{ size: "6", order: 1 }}>
            <h2 className={cls(commonStyles.title2, "text-white mb-0")}>{t("Homepage.mobileAppTitle")}</h2>
            <p className={cls(commonStyles.subtitle)}>{t("Homepage.mobileAppSubtitle")}</p>

            <MobileAppSmsForm />

            <div className={styles.store}>{isTablet && storeLinks}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MobileApp;
