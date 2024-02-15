import React, { useState } from "react";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import { Id } from "@refugies-info/api-types";
import { cls } from "lib/classname";
import { useFavorites, useAuth } from "hooks";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import BookmarkedModal from "components/Modals/BookmarkedModal";
import styles from "./FavoriteButton.module.scss";

interface Props {
  contentId: Id;
  className?: string;
}

export const FavoriteButton = (props: Props) => {
  const { t } = useTranslation();
  const { isFavorite, addToFavorites } = useFavorites(props.contentId);
  const { isAuth } = useAuth();
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

  const onClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuth) {
      addToFavorites();
    } else {
      setShowFavoriteModal(true);
    }
  };

  return (
    <>
      <Button
        className={cls(styles.btn, isFavorite && styles.active, props.className)}
        onClick={onClick}
        title={t("Dispositif.addToFavorites")}
      >
        <EVAIcon name="star-outline" fill="dark" className={styles.icon_outline} size={20} />
        <EVAIcon name="star" fill={isFavorite ? "white" : "dark"} className={styles.icon_fill} size={20} />
      </Button>

      {showFavoriteModal && (
        <BookmarkedModal show={true} toggle={() => setShowFavoriteModal((o) => !o)} dispositifId={props.contentId} />
      )}
    </>
  );
};
