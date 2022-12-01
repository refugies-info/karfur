import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { Container } from "reactstrap";
import styles from "./SecondaryNavbar.module.scss";

interface Props {}

const SecondaryNavbar = (props: Props) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <Container className={styles.inner}>
        <div>
          <Link href="#why">
            <a className={styles.btn}>{t("Publish.navbarItem1")}</a>
          </Link>
          <Link href="#required">
            <a className={styles.btn}>{t("Publish.navbarItem2")}</a>
          </Link>
          <Link href="#steps">
            <a className={styles.btn}>{t("Publish.navbarItem3")}</a>
          </Link>
          <Link href="#faq">
            <a className={styles.btn}>{t("Publish.navbarItem4")}</a>
          </Link>
        </div>
        <Link href="#register">
          <a className={styles.btn}>{t("Publish.navbarItem5")}</a>
        </Link>
      </Container>
    </div>
  );
};

export default SecondaryNavbar;
