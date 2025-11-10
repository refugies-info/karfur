import Button from "@codegouvfr/react-dsfr/Button";
import { Bookmark } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import BookmarkedModal from "~/components/Modals/BookmarkedModal";
import Toast from "~/components/UI/Toast";
import { useAuth, useFavorites } from "~/hooks";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";

import { Tooltip } from "@codegouvfr/react-dsfr/Tooltip";

export default function SaveBookmark() {
  const dispositif = useSelector(selectedDispositifSelector);
  const { t } = useTranslation();

  const { isAuth } = useAuth();

  // favorites
  const [showNoAuthModal, setShowNoAuthModal] = useState(false);
  const bookmarkButtonRef = useRef<HTMLButtonElement>(null);
  const noAuthModalToggle = useCallback(() => setShowNoAuthModal((o) => !o), []);

  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif?._id || null);
  const [showFavoriteToast, setShowFavoriteToast] = useState<"added" | "removed" | null>(null);
  const toggleFavorite = useCallback(() => {
    if (!isAuth) {
      noAuthModalToggle();
      return;
    }
    if (isFavorite) {
      deleteFromFavorites();
      setShowFavoriteToast("removed");
    } else {
      addToFavorites();
      setShowFavoriteToast("added");
      Event("FAVORITES", "add", "Dispo View");
    }
  }, [addToFavorites, deleteFromFavorites, isFavorite, isAuth, noAuthModalToggle]);

  return (
    <div>
      <Tooltip kind="hover" title={isFavorite ? t("UserFavorites.tooltip_remove") : t("UserFavorites.tooltip_add")}>
        <Button
          ref={bookmarkButtonRef}
          priority="tertiary no outline"
          onClick={toggleFavorite}
          size="small"
          id="add-favorite"
          title={isFavorite ? t("Dispositif.addedToFavorites") : t("Dispositif.addToFavorites")}
        >
          <Bookmark variant={isFavorite ? "fill" : "add"} className=""></Bookmark>
        </Button>
      </Tooltip>

      <Toast open={!!showFavoriteToast} closeCallback={() => setShowFavoriteToast(null)}>
        {showFavoriteToast === "added"
          ? t("Dispositif.messageAddedToFavorites")
          : t("Dispositif.messageRemovedFromFavorites")}
      </Toast>
      {!isAuth && (
        <BookmarkedModal
          open={showNoAuthModal}
          onOpenChange={setShowNoAuthModal}
          dispositifId={dispositif?._id}
          triggerRef={bookmarkButtonRef}
        />
      )}
    </div>
  );
}
