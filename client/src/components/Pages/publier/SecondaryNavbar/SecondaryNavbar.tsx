import React from "react";
import { Container } from "reactstrap";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { cls } from "lib/classname";
import { View } from "pages/publier";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./SecondaryNavbar.module.scss";

interface Props {
  activeView: View | null;
  isSticky: boolean;
}

const SecondaryNavbar = (props: Props) => {
  const { t } = useTranslation();

  const isActive = (view: View) => props.activeView === view;

  return (
    <div className={cls(styles.container, props.isSticky && styles.shadow)}>
      <Container className={styles.inner}>
        <div>
          <Link href="#why">
            <a className={cls(styles.btn, styles.green, isActive("why") && styles.active)}>
              {t("Publish.navbarItem1")}
            </a>
          </Link>
          <Link href="#required">
            <a className={cls(styles.btn, styles.purple, isActive("required") && styles.active)}>
              {t("Publish.navbarItem2")}
            </a>
          </Link>
          <Link href="#steps">
            <a className={cls(styles.btn, styles.orange, isActive("steps") && styles.active)}>
              {t("Publish.navbarItem3")}
            </a>
          </Link>
          <Link href="#faq">
            <a className={cls(styles.btn, styles.red, isActive("faq") && styles.active)}>{t("Publish.navbarItem4")}</a>
          </Link>
        </div>
        <Link href="#register">
          <a className={cls(styles.btn, styles.blue, isActive("register") && styles.active)}>
            <EVAIcon name="plus-circle-outline" size={20} />
            {t("Publish.navbarItem5")}
          </a>
        </Link>
      </Container>
    </div>
  );
};

export default SecondaryNavbar;
