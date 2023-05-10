import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useFavorites, useLocale, useAuth, useContentLocale, useChangeLanguage, useEvent } from "hooks";
import { readAudio, stopAudio } from "lib/readAudio";
import { getAllPageReadableText } from "lib/getReadableText";
import { cls } from "lib/classname";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import Button from "components/UI/Button";
import Toast from "components/UI/Toast";
import BookmarkedModal from "components/Modals/BookmarkedModal";
import { ShareButtons, SMSForm, LangueMenu } from "components/Pages/dispositif";
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
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const toggleReading = useCallback(() => {
    if (!isPlayingTts) {
      const readableText = getAllPageReadableText(dispositif, theme, secondaryThemes, needs);
      readAudio(readableText, locale, () => setIsPlayingTts(false));
      setIsPlayingTts(true);
      Event("VOICEOVER", "click sidebar button", "Dispo View");
    } else {
      stopAudio();
      setIsPlayingTts(false);
    }
  }, [isPlayingTts, dispositif, locale, theme, secondaryThemes, needs, Event]);

  // available languages
  const router = useRouter();
  const dispatch = useDispatch();
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
  return (
    <div className={styles.container}>
      <Button
        onClick={toggleReading}
        evaIcon={isPlayingTts ? "stop-circle" : "play-circle"}
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

      {!isAuth && <BookmarkedModal show={showNoAuthModal} toggle={noAuthModalToggle} />}
    </div>
  );
};

export default RightSidebar;
