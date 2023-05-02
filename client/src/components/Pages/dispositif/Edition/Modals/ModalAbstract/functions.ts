import { DeepPartialSkipArrayKey } from "react-hook-form";
import { ContentType, CreateDispositifRequest, DispositifStatus, GetDispositifsResponse } from "api-types";

export const getDefaultDispositif = (formValues: DeepPartialSkipArrayKey<CreateDispositifRequest>): GetDispositifsResponse => {
  return {
    _id: "",
    titreInformatif: formValues.titreInformatif || "Titre informatif",
    titreMarque: formValues.titreMarque || "Structure",
    typeContenu: ContentType.DISPOSITIF,
    status: DispositifStatus.ACTIVE,
    theme: formValues.theme || undefined,
    secondaryThemes: formValues.secondaryThemes,
    metadatas: {
      location: formValues.metadatas?.location || ["Lieu"],
      price: !!formValues.metadatas?.price ? {
        values: formValues.metadatas?.price.values || [0],
        details: formValues.metadatas?.price.details || undefined,
      } : null,
    },
    nbMots: 0,
    nbVues: 0,
    nbVuesMobile: 0,
    availableLanguages: [],
    needs: [],
  }
}

