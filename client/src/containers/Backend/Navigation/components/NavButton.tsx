import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { SelectedPage } from "../Navigation.component";
import traductionIcon from "assets/icon_traduction.svg";
import traductionIconBlanc from "assets/icon_traduction_blanc.svg";
import styles from "./NavButton.module.scss";

interface NavButtonProps {
  title: string;
  iconName: string;
  isSelected: boolean;
  type: SelectedPage;
  onClick: () => void;
  nbNewNotifications: number;
}
const getColor = (type: SelectedPage) => {
  if (type === "admin") return "blue";
  if (type === "logout") return "red";

  return "black";
};

export const NavButton = (props: NavButtonProps) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { t } = useTranslation();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

  const getTitle = (
    type: SelectedPage,
    title: string,
    nbNewNotifications: number,
    isReductedSize: boolean
  ) => {
    if (type === "admin" && !isReductedSize) return title;
    if (type === "notifications")
      if (isReductedSize) {
        return " (" + nbNewNotifications + ")";
      } else {
        return (
          t("Toolbar." + props.title, props.title) +
          " (" +
          nbNewNotifications +
          ")"
        );
      }
    if (isReductedSize) {
      return null;
    }
    return t("Toolbar." + props.title, props.title);
  };

  let isReductedSize =
    ((props.type === "notifications" || props.type === "favoris") &&
      windowWidth < 1300) ||
    ((props.type === "admin" || props.type === "profil") && windowWidth < 1200);
  return (
    <button
      className={`${styles.btn} ${styles[getColor(props.type)]} ${
        props.isSelected && styles.active
      }`}
      onClick={props.onClick}
    >
      {props.type !== "traductions" && (
        <span className={styles.icon}>
          <span className={styles.regular}>
            <EVAIcon
              name={props.iconName + "-outline"}
              className={isReductedSize ? "" : "mr-10"}
            />
          </span>
          <span className={styles.hovered}>
            <EVAIcon
              name={props.iconName}
              className={isReductedSize ? "" : "mr-10"}
            />
          </span>
        </span>
      )}
      {props.type === "traductions" && (
        <span className={styles.icon + " " + styles.icon_traduction}>
          <span className={styles.regular}>
            <Image src={traductionIcon} alt="a" width={22} height={22} />
          </span>
          <span className={styles.hovered}>
            <Image src={traductionIconBlanc} alt="a" width={22} height={22} />
          </span>
        </span>
      )}
      {getTitle(
        props.type,
        props.title,
        props.nbNewNotifications,
        isReductedSize
      )}
    </button>
  );
};
