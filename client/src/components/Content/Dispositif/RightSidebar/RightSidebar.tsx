import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import ShareButtons from "components/Pages/dispositif/ShareButtons";
import SMSForm from "components/Pages/dispositif/SMSForm";
import { useFavorites } from "hooks";
import { readAudio } from "lib/readAudio";
import Toast from "components/UI/Toast";

const RightSidebar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif._id);
  const [showFavoriteToast, setShowFavoriteToast] = useState(false);

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
    </div>
  );
};

export default RightSidebar;
