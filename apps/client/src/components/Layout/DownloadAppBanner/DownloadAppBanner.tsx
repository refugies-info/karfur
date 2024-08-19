import { useEffect, useState } from "react";
import { isIOS, isMobileOnly } from "react-device-detect";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Image from "next/image";
import Button from "@codegouvfr/react-dsfr/Button";
import { androidStoreLink, iosStoreLink } from "data/storeLinks";
import styles from "./DownloadAppBanner.module.scss";

const STORE_LINK = isIOS ? iosStoreLink : androidStoreLink;

const DownloadAppBanner = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const routeChanged = () => {
      setShow((router.pathname === "/dispositif/[id]" || router.pathname === "/demarche/[id]") && isMobileOnly);
    };

    router.events.on("routeChangeComplete", routeChanged);
    routeChanged();

    return () => {
      router.events.off("routeChangeComplete", routeChanged);
    };
  }, [router]);

  if (!show) return null;
  return (
    <div className={styles.container}>
      <div className="d-flex align-items-center">
        <Image src="/images/logo-navbar-ri.svg" width="40" height="40" alt="" />
        <div className="ms-2">
          <div className={styles.brand}>Réfugiés.info</div>
          <div>{t("Dispositif.freeApp")}</div>
        </div>
      </div>

      <div className="d-flex align-items-center">
        <Button
          size="small"
          className="me-1"
          linkProps={{
            href: STORE_LINK,
            target: "_blank",
          }}
        >
          {t("Dispositif.downloadAppButton")}
        </Button>
        <Button
          priority="tertiary no outline"
          iconId="fr-icon-close-line"
          title={t("close")}
          className="p-2"
          onClick={() => setShow(false)}
        />
      </div>
    </div>
  );
};

export default DownloadAppBanner;
