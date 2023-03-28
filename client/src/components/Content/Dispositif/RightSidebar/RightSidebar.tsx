import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { getPath, PathNames } from "routes";
import { useSelector } from "react-redux";
import { useFavorites, useLocale } from "hooks";
import { readAudio, stopAudio } from "lib/readAudio";
import { getAllPageReadableText } from "lib/getReadableText";
import { cls } from "lib/classname";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import Button from "components/UI/Button";
import Toast from "components/UI/Toast";
import { ShareButtons, SMSForm, LangueMenu } from "components/Pages/dispositif";
import styles from "./RightSidebar.module.scss";

const RightSidebar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();

  // favorites
  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif?._id || null);
  const [showFavoriteToast, setShowFavoriteToast] = useState<"added" | "removed" | null>(null);
  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      deleteFromFavorites();
      setShowFavoriteToast("removed");
    } else {
      addToFavorites();
      setShowFavoriteToast("added");
    }
  }, [addToFavorites, deleteFromFavorites, isFavorite]);

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
    } else {
      stopAudio();
      setIsPlayingTts(false);
    }
  }, [isPlayingTts, dispositif, locale, theme, secondaryThemes, needs]);

  // available languages
  const router = useRouter();
  const languages = useSelector(allLanguesSelector);
  const [selectedLn, setSelectedLn] = useState<string>(locale);
  useEffect(() => {
    if (selectedLn !== locale) {
      const { pathname, query } = router;
      router.push(
        {
          pathname: getPath(pathname as PathNames, selectedLn),
          query,
        },
        undefined,
        { locale: selectedLn },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLn]);

  const language = useMemo(() => languages.find((ln) => ln.i18nCode === selectedLn), [languages, selectedLn]);
  const disabledOptions = useMemo(
    () => languages.map((ln) => ln.i18nCode).filter((ln) => !(dispositif?.availableLanguages || []).includes(ln)),
    [dispositif, languages],
  );
  return (
    <div className={styles.container}>
      <Button
        onClick={toggleReading}
        icon={isPlayingTts ? "stop-circle" : "play-circle"}
        className={cls(styles.btn, isPlayingTts && styles.playing)}
      >
        {isPlayingTts ? "Arrêter" : "Écouter la fiche"}
      </Button>
      <Button secondary onClick={toggleFavorite} icon={isFavorite ? "star" : "star-outline"} className={styles.btn}>
        {isFavorite ? "Ajouté aux favoris" : "Ajouter aux favoris"}
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
          {showFavoriteToast === "added" ? "Fiche ajoutée aux favoris !" : "Fiche retirée des favoris !"}
        </Toast>
      )}

      <SMSForm />
      <ShareButtons />
    </div>
  );
};

export default RightSidebar;
