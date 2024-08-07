import React, { useCallback, useState } from "react";
import { Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import { Id } from "@refugies-info/api-types";
import { cls } from "lib/classname";
import { useFavorites, useAuth } from "hooks";
import BookmarkedModal from "components/Modals/BookmarkedModal";
import Toast from "../Toast";
import styles from "./FavoriteButton.module.scss";

interface Props {
  contentId: Id;
  className?: string;
}

export const FavoriteButton = (props: Props) => {
  const { t } = useTranslation();
  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(props.contentId);
  const { isAuth } = useAuth();
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showFavoriteToast, setShowFavoriteToast] = useState<"added" | "removed" | null>(null);

  const onClick = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isAuth) {
        setShowFavoriteModal(true);
        return;
      }
      if (isFavorite) {
        deleteFromFavorites();
        setShowFavoriteToast("removed");
      } else {
        addToFavorites();
        setShowFavoriteToast("added");
      }
    },
    [isFavorite, isAuth, deleteFromFavorites, addToFavorites],
  );

  return (
    <>
      <Button
        className={cls(styles.btn, isFavorite && styles.active, props.className)}
        onClick={onClick}
        title={isFavorite ? t("Dispositif.removeFromFavorites") : t("Dispositif.addToFavorites")}
      >
        <i className={isFavorite ? "fr-icon-star-fill" : "fr-icon-star-line"} />
      </Button>

      {showFavoriteModal && (
        <BookmarkedModal show={true} toggle={() => setShowFavoriteModal((o) => !o)} dispositifId={props.contentId} />
      )}
      {showFavoriteToast && (
        <Toast close={() => setShowFavoriteToast(null)}>
          {showFavoriteToast === "added"
            ? t("Dispositif.messageAddedToFavorites")
            : t("Dispositif.messageRemovedFromFavorites")}
        </Toast>
      )}
    </>
  );
};
