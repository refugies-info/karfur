import React from "react";
import { useTranslation } from "next-i18next";
import { Button } from "reactstrap";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./SeeMoreButton.module.scss";

interface Props {
  onClick: () => void;
  visible: boolean;
}

const SeeMoreButton = (props: Props) => {
  const { t } = useTranslation();
  return (
    <div className={cls(styles.container, props.visible && styles.visible)}>
      <Button onClick={props.onClick} className={styles.btn}>
        {!props.visible ? t("Recherche.seeMore", "Voir plus") : t("Recherche.seeLess", "Voir moins")}
        <EVAIcon
          name={!props.visible ? "arrow-downward-outline" : "arrow-upward-outline"}
          fill="white"
          size={24}
          className="ml-2"
        />
      </Button>
    </div>
  );
};

export default SeeMoreButton;
