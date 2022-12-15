import React from "react";
import Image from "next/legacy/image";
import { useTranslation } from "next-i18next";

import mobile_app_mockups from "assets/homepage/mobile-app-mockups.png";
import app_qr_code from "assets/homepage/app-qr-code.png";
import styles from "./MobileAppSection.module.scss";
import { cls } from "lib/classname";

import { colors } from "colors";
import FInput from "components/UI/FInput/FInput";
import FButton from "components/UI/FButton";
import { useRouter } from "next/router";
import { assetsOnServer } from "assets/assetsOnServer";
import { AvailableLanguageI18nCode } from "types/interface";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";

const MobileAppSection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const locale: AvailableLanguageI18nCode = (router.locale || "fr") as AvailableLanguageI18nCode;

  const appStoreBadge = assetsOnServer.storeBadges.appStore[locale] || assetsOnServer.storeBadges.appStore.en;
  const playStoreBadge = assetsOnServer.storeBadges.playStore[locale] || assetsOnServer.storeBadges.playStore.en;

  const copyLink = () => {
    navigator.clipboard.writeText(
      "https://refugies.info/download-app?utm_source=page-accueil&utm_medium=bouton-partage-app&utm_campaign=nouveau-page"
    );
  };

  return (
    <section id="application" className={styles.smartphone}>
      <div className={styles.container}>
        <div className={cls(styles.row, "row align-items-center")}>
          <div className={cls(styles.mockup, "col")}>
            <h2 className={cls(styles.mobile_title, "text-white")}>
              {t("Homepage.mobile_app_title", "Application mobile disponible !")}
            </h2>
            <Image src={mobile_app_mockups} alt="Mobile app mockups" width={600} height={450} objectFit="contain" />
          </div>
          <div className={cls(styles.content, "col")}>
            <div className={cls(styles.title, "text-white")}>
              <h2 className="text-white">{t("Homepage.mobile_app_title", "Application mobile disponible !")}</h2>
              <p className={cls("h5", styles.subtitle)}>{t("Homepage.mobile_app_subtitle_1")}</p>
              <p className={cls("h5", styles.subtitle)}>{t("Homepage.mobile_app_subtitle_2")}</p>
              <p className={cls("h5", styles.subtitle)}>{t("Homepage.mobile_app_subtitle_3")}</p>
            </div>

            <div className={styles.card}>
              <div className={styles.store}>
                <div className={styles.store_badges}>
                  <a href={iosStoreLink} rel="noopener noreferrer" target="_blank">
                    <Image src={appStoreBadge} alt="Get it on App Store" width={190} height={60} />
                  </a>
                  <a href={androidStoreLink} rel="noopener noreferrer" target="_blank">
                    <Image src={playStoreBadge} alt="Get it on Play Store" width={190} height={57} />
                  </a>
                </div>
                <div className={styles.store_qr}>
                  <h5 className={styles.store_title}>{t("Homepage.mobile_app_qrcode")}</h5>
                  <div className={styles.store_qr}>
                    <div className={styles.store_qr_img}>
                      <Image src={app_qr_code} alt="Scan the QR code" width={115} height={115} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.form_link}>
                <div className={styles.input_wrapper}>
                  <FInput
                    id="mobile-app-download-link"
                    value="https://refugies.info/download-app"
                    newSize
                    prepend
                    prependName="link-outline"
                    prependFill={colors.gray70}
                    inputClassName={styles.input}
                    autoFocus={false}
                  />
                </div>
                <FButton type="login" className={cls("ml-2", styles.copy_btn)} name="copy-outline" onClick={copyLink}>
                  {t("Homepage.mobile_app_copy_link")}
                </FButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
