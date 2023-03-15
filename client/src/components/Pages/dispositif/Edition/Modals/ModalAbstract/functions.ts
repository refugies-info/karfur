import { DeepPartialSkipArrayKey } from "react-hook-form";
import { ContentType, DispositifStatus, GetDispositifResponse, GetDispositifsResponse, Id } from "api-types";

export const getDefaultDispositif = (formValues: DeepPartialSkipArrayKey<GetDispositifResponse>, theme: Id): GetDispositifsResponse => {
  return {
    _id: "",
    titreInformatif: formValues.titreInformatif || "Titre de la fiche",
    titreMarque: formValues.titreMarque || "Nom de l'action",
    typeContenu: ContentType.DISPOSITIF,
    status: DispositifStatus.ACTIVE,
    theme: formValues.theme || theme,
    secondaryThemes: formValues.secondaryThemes,
    metadatas: {
      location: formValues.metadatas?.location || "france",
      //@ts-ignore
      price: formValues.metadatas?.price, // FIXME
    },
    nbMots: 0,
    nbVues: 0,
    availableLanguages: [],
    needs: [],
  }
}

