import { useEffect } from "react";
import Image from "next/image";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { useChangeLanguage, useLocale, useRTL } from "hooks";
import { cls } from "lib/classname";
import AuthNavbar from "components/Navigation/AuthNavbar";
import AuthIllu from "assets/auth/login-illu.svg";
import PersosIllu from "assets/auth/illu-persos.svg";
import RatingStars from "assets/auth/rating-stars.svg";
import PartnersLogos from "assets/auth/partners-logo.png";
import styles from "./Layout.module.scss";

interface Props {
  children: any;
  fullWidth?: boolean;
  loginHelp?: boolean;
}

const Layout = (props: Props) => {
  const isRTL = useRTL();

  // force french language for login
  const locale = useLocale();
  const { changeLanguage } = useChangeLanguage();
  useEffect(() => {
    if (locale !== "fr") {
      changeLanguage("fr");
    }
  }, [locale, changeLanguage]);

  return (
    <div className={styles.container} dir={isRTL ? "rtl" : "ltr"}>
      <AuthNavbar />
      {props.loginHelp && (
        <Notice
          isClosable
          title={
            <>
              Vous n'arrivez pas à vous connecter ? Consultez notre{" "}
              <a
                href="https://help.refugies.info/fr/article/je-narrive-pas-a-me-connecter-a-mon-compte-refugiesinfo-1n02al9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-underline"
              >
                article d'aide
              </a>{" "}
              ou contactez-nous{" "}
              <a
                href="https://go.crisp.chat/chat/embed/?website_id=74e04b98-ef6b-4cb0-9daf-f8a2b643e121"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-underline"
              >
                via notre livechat
              </a>
              .
            </>
          }
        />
      )}
      <div className={styles.row}>
        <main className={cls(styles.main, props.fullWidth && styles.full_width)}>{props.children}</main>

        {!props.fullWidth && (
          <div className={styles.right}>
            <Image src={AuthIllu} width={720} height={500} alt="" className={styles.illu} />

            <div className={styles.right_content}>
              <p className={styles.chapo}>
                Plus de 100 000 réfugiés et 2 000 professionnels ont adopté Réfugiés.info&nbsp;!
              </p>
              <div className={styles.rating}>
                <Image src={RatingStars} width={136} height={24} alt="4,8" />
                4,8
              </div>
              <p className={styles.small}>Application disponible sur Android et iOS</p>

              <Image src={PartnersLogos} width={480} height={80} alt="" />
            </div>
          </div>
        )}
      </div>

      {props.fullWidth && (
        <div className={styles.fixed_illu}>
          <Image src={PersosIllu} width={127} height={200} alt="" />
        </div>
      )}
    </div>
  );
};

export default Layout;
