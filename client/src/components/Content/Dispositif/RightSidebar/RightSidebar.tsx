import { useEffect, useState, useCallback, useMemo } from "react";
import { DispositifStatus } from "@refugies-info/api-types";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useFavorites, useLocale, useAuth, useContentLocale, useChangeLanguage, useEvent, useUser } from "hooks";
import { useDispositifTts } from "hooks/dispositif";
import { cls } from "lib/classname";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import Button from "components/UI/Button";
import Toast from "components/UI/Toast";
import BookmarkedModal from "components/Modals/BookmarkedModal";
import { ShareButtons, SMSForm, LangueMenu, StructureReceiveDispositif } from "components/Pages/dispositif";
import styles from "./RightSidebar.module.scss";

const RightSidebar = () => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();
  const { contentLocale } = useContentLocale();
  const { isAuth } = useAuth();
  const { Event } = useEvent();

  // favorites
  const [showNoAuthModal, setShowNoAuthModal] = useState(false);
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
  }, [addToFavorites, deleteFromFavorites, isFavorite, isAuth, noAuthModalToggle, Event]);

  // tts
  const { isPlayingTts, isLoadingTts, toggleReading } = useDispositifTts();

  // available languages
  const languages = useSelector(allLanguesSelector);
  const [selectedLn, setSelectedLn] = useState<string>(contentLocale);

  const { changeLanguage } = useChangeLanguage();
  useEffect(() => {
    // selected language changes -> change site locale
    if (selectedLn !== locale && dispositif?.availableLanguages.includes(selectedLn)) {
      changeLanguage(selectedLn, "replace");
      Event("CHANGE_LANGUAGE", selectedLn, "Dispo View");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLn]);

  useEffect(() => {
    // locale changes -> change selected language
    if (selectedLn !== locale && dispositif?.availableLanguages.includes(locale)) {
      setSelectedLn(locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const language = useMemo(() => languages.find((ln) => ln.i18nCode === selectedLn), [languages, selectedLn]);
  const disabledOptions = useMemo(
    () => languages.map((ln) => ln.i18nCode).filter((ln) => !(dispositif?.availableLanguages || []).includes(ln)),
    [dispositif, languages],
  );

  // dispositif is waiting for structure approval
  const { user } = useUser();
  const needsApproval = useMemo(() => {
    const userStructureId = user.user?.structures?.[0];
    return (
      !!userStructureId && // user has structure
      dispositif?.mainSponsor?._id.toString() === userStructureId && // dispo is for user structure
      dispositif?.status === DispositifStatus.WAITING_STRUCTURE // and waiting for validation
    );
  }, [dispositif, user]);

  return (
    <div className={styles.container}>
      {!needsApproval ? (
        <>
          <Button
            onClick={toggleReading}
            evaIcon={isPlayingTts ? "stop-circle" : "play-circle"}
            isLoading={isLoadingTts}
            className={cls(styles.btn, isPlayingTts && styles.playing)}
          >
            {isPlayingTts ? t("Dispositif.stop") : t("Dispositif.listen")}
          </Button>
          <Button
            priority="secondary"
            onClick={toggleFavorite}
            evaIcon={isFavorite ? "star" : "star-outline"}
            className={styles.btn}
          >
            {isFavorite ? t("Dispositif.addedToFavorites") : t("Dispositif.addToFavorites")}
          </Button>
          <LangueMenu
            label={`En ${language?.langueLoc?.toLowerCase() || "français"}`}
            selectedLn={selectedLn}
            setSelectedLn={setSelectedLn}
            className={styles.read}
            disabledOptions={disabledOptions}
            withFlag
          />
          {showFavoriteToast && (
            <Toast close={() => setShowFavoriteToast(null)}>
              {showFavoriteToast === "added"
                ? t("Dispositif.messageAddedToFavorites")
                : t("Dispositif.messageRemovedFromFavorites")}
            </Toast>
          )}

          <SMSForm disabledOptions={disabledOptions} />
          <ShareButtons />

          {!isAuth && (
            <BookmarkedModal show={showNoAuthModal} toggle={noAuthModalToggle} dispositifId={dispositif?._id} />
          )}
        </>
      ) : (
        <StructureReceiveDispositif />
      )}
    </div>
  );
};

export default RightSidebar;
