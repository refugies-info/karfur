import {
  ContentType,
  CreateDispositifRequest,
  DispositifStatus,
  GetDispositifsResponse,
} from "@refugies-info/api-types";
import { DeepPartialSkipArrayKey } from "react-hook-form";

export const getDefaultDispositif = (
  formValues: DeepPartialSkipArrayKey<CreateDispositifRequest>,
  sponsor: GetDispositifsResponse["sponsor"],
): GetDispositifsResponse => {
  return {
    _id: "",
    titreInformatif: formValues.titreInformatif || "Titre informatif",
    titreMarque: formValues.titreMarque || "Structure",
    typeContenu: ContentType.DISPOSITIF,
    status: DispositifStatus.ACTIVE,
    theme: formValues.theme || undefined,
    secondaryThemes: formValues.secondaryThemes,
    sponsor,
    metadatas: {
      location: formValues.metadatas?.location || null,
      price: !!formValues.metadatas?.price
        ? {
            values: formValues.metadatas?.price.values || [0],
            details: formValues.metadatas?.price.details || undefined,
          }
        : null,
      commitment: !!formValues.metadatas?.commitment
        ? {
            amountDetails: formValues.metadatas.commitment.amountDetails || "exactly",
            hours: formValues.metadatas.commitment.hours || [0],
            timeUnit: formValues.metadatas.commitment.timeUnit || "hours",
          }
        : null,
    },
    nbMots: 0,
    nbVues: 0,
    nbVuesMobile: 0,
    availableLanguages: [],
    needs: [],
    hasDraftVersion: false,
    themeSortIndex: 0,
  };
};
