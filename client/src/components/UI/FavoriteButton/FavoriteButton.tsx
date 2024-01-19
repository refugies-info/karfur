import React from "react";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import useFavorites from "hooks/useFavorites";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./FavoriteButton.module.scss";
import { Id } from "@refugies-info/api-types";

interface Props {
  contentId: Id;
  className?: string;
}

export const FavoriteButton = (props: Props) => {
  const { t } = useTranslation();
  const { isFavorite, addToFavorites } = useFavorites(props.contentId);

  const onClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToFavorites();
  };

  /* TODO: modal favorite? */
  return (
    <Button
      className={cls(styles.btn, isFavorite && styles.active, props.className)}
      onClick={onClick}
      title={t("Dispositif.addToFavorites")}
    >
      <EVAIcon name="star-outline" fill="dark" className={styles.icon_outline} size={20} />
      <EVAIcon name="star" fill={isFavorite ? "white" : "dark"} className={styles.icon_fill} size={20} />
    </Button>
  );
};
