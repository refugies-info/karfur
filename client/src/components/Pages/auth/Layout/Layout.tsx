import Image from "next/image";
import { useChangeLanguage, useLocale, useRTL } from "hooks";
import AuthNavbar from "components/Navigation/AuthNavbar";
import AuthIllu from "assets/auth/login-illu.svg";
import PersosIllu from "assets/auth/illu-persos.svg";
import RatingStars from "assets/auth/rating-stars.svg";
import PartnersLogos from "assets/auth/partners-logo.png";
import styles from "./Layout.module.scss";
import { useEffect } from "react";
import { cls } from "lib/classname";

interface Props {
  children: any;
  fullWidth?: boolean;
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
      <div className={styles.row}>
        <main className={cls(styles.main, props.fullWidth && styles.full_width)}>{props.children}</main>

        {!props.fullWidth && (
          <div className={styles.right}>
            <Image src={AuthIllu} width={720} height={500} alt="" className={styles.illu} />

            <div className={styles.right_content}>
              <p className={styles.chapo}>
                Plus de 100 000 réfugiés et 2 000 professionnels ont adopté Réfugiés.info !
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
