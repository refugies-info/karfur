import React from "react";
import { useSelector } from "react-redux";
import { ContentType } from "api-types";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import ShareButtons from "components/Pages/dispositif/ShareButtons";
import SMSForm from "components/Pages/dispositif/SMSForm";
import { useFavorites } from "hooks";
import { readAudio } from "lib/readAudio";

const RightSidebar = () => {
  const dispositif = useSelector(selectedDispositifSelector);
  const { isFavorite, addToFavorites, deleteFromFavorites } = useFavorites(dispositif._id);

  return (
    <div>
      <Button onClick={() => readAudio(dispositif.titreInformatif, "fr")} icon="play-circle" className="mb-2">
        Écouter la fiche
      </Button>
      <Button
        secondary
        onClick={isFavorite ? deleteFromFavorites : addToFavorites}
        icon={isFavorite ? "star" : "star-outline"}
        className="mb-2"
      >
        {isFavorite ? "Ajouté aux favoris" : "Ajouter aux favoris"}
      </Button>

      <ShareButtons />
      <SMSForm />
    </div>
  );
};

export default RightSidebar;
