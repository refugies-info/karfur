import { DeepPartialSkipArrayKey } from "react-hook-form";
import { ContentType, CreateDispositifRequest, DispositifStatus, GetDispositifsResponse } from "api-types";

export const getDefaultDispositif = (formValues: DeepPartialSkipArrayKey<CreateDispositifRequest>): GetDispositifsResponse => {
  return {
    _id: "",
    titreInformatif: formValues.titreInformatif || "Titre de la fiche",
    titreMarque: formValues.titreMarque || "Structure",
    typeContenu: ContentType.DISPOSITIF,
    status: DispositifStatus.ACTIVE,
    theme: formValues.theme || undefined,
    secondaryThemes: formValues.secondaryThemes,
    metadatas: {
      location: formValues.metadatas?.location || ["Lieu"],
      //@ts-ignore
      price: formValues.metadatas?.price, // FIXME
    },
    nbMots: 0,
    nbVues: 0,
    availableLanguages: [],
    needs: [],
  }
}

