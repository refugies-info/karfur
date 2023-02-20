import pick from "lodash/pick";
import { GetDispositifResponse, Id, UpdateDispositifRequest } from "api-types";
import { logger } from "logger";
import API from "utils/API";

export const getDefaultValue = (dispositif: GetDispositifResponse): UpdateDispositifRequest => {
  const defaultValues: UpdateDispositifRequest = {
    ...pick(dispositif, ["titreInformatif", "titreMarque", "abstract", "what", "why", "how", "next", "metadatas"]),
    mainSponsor: dispositif.mainSponsor?._id.toString(),
    theme: dispositif.theme?.toString(),
    secondaryThemes: dispositif.secondaryThemes?.map((t) => t.toString())
  };

  return defaultValues;
}

export const submitForm = (id: Id, data: UpdateDispositifRequest) => {
  logger.info("[save dispositif]", data);
  return API.updateDispositif(id, data);
}
