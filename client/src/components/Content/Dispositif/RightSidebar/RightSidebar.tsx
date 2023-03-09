import React, { useEffect, useState, useCallback } from "react";
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
import ShareButtons from "components/Pages/dispositif/ShareButtons";
import SMSForm from "components/Pages/dispositif/SMSForm";
import Toast from "components/UI/Toast";
import LangueMenu from "components/Pages/dispositif/LangueMenu";
import styles from "./RightSidebar.module.scss";

const RightSidebar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const locale = useLocale();
  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif?._id || null);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);

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

  const language = languages.find((ln) => ln.i18nCode === selectedLn);
  const disabledOptions = languages
    .map((ln) => ln.i18nCode)
    .filter((ln) => !(dispositif?.availableLanguages || []).includes(ln));
  return (
    <div>
      <Button
        onClick={toggleReading}
        icon={isPlayingTts ? "stop-circle" : "play-circle"}
        className={cls("mb-2", isPlayingTts && styles.playing)}
      >
        {isPlayingTts ? "Arrêter" : "Écouter la fiche"}
      </Button>
      <Button
        secondary
        onClick={
          isFavorite
            ? deleteFromFavorites
            : () => {
                addToFavorites();
                setShowFavoriteToast(true);
              }
        }
        icon={isFavorite ? "star" : "star-outline"}
        className="mb-2"
      >
        {isFavorite ? "Ajouté aux favoris" : "Ajouter aux favoris"}
      </Button>
      {showFavoriteToast && <Toast close={() => setShowFavoriteToast(false)}>Fiche ajoutée aux favoris !</Toast>}

      <ShareButtons />
      <SMSForm />

      <LangueMenu
        label={`Lire en ${language?.langueLoc?.toLowerCase() || "français"}`}
        selectedLn={selectedLn}
        setSelectedLn={setSelectedLn}
        className={styles.read}
        disabledOptions={disabledOptions}
      />
    </div>
  );
};

export default RightSidebar;
