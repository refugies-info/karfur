import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPath, PathNames } from "routes";
import { useSelector } from "react-redux";
import { useFavorites, useLocale } from "hooks";
import { readAudio } from "lib/readAudio";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import Button from "components/UI/Button";
import ShareButtons from "components/Pages/dispositif/ShareButtons";
import SMSForm from "components/Pages/dispositif/SMSForm";
import Toast from "components/UI/Toast";
import LangueMenu from "components/Pages/dispositif/LangueMenu";
import styles from "./RightSidebar.module.scss";

const RightSidebar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif?._id || null);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);

  const router = useRouter();
  const locale = useLocale();
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
      <Button onClick={() => readAudio(dispositif.titreInformatif, "fr")} icon="play-circle" className="mb-2">
        Écouter la fiche
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
