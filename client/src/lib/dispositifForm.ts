import pick from "lodash/pick";
import { CreateDispositifRequest, GetDispositifResponse, Id, UpdateDispositifRequest } from "api-types";
import { logger } from "logger";
import API from "utils/API";

export const getDefaultValue = (dispositif: GetDispositifResponse | null): UpdateDispositifRequest => {
  if (!dispositif) return {};
  const defaultValues: UpdateDispositifRequest = {
    ...pick(dispositif, ["titreInformatif", "titreMarque", "abstract", "what", "why", "how", "next", "metadatas"]),
    mainSponsor: dispositif.mainSponsor?._id.toString(),
    theme: dispositif.theme?.toString(),
    secondaryThemes: dispositif.secondaryThemes?.map((t) => t.toString())
  };

  return defaultValues;
}

export const submitUpdateForm = (id: Id, data: UpdateDispositifRequest) => {
  logger.info("[update dispositif]", data);
  return API.updateDispositif(id, data);
}

export const submitCreateForm = (data: CreateDispositifRequest) => {
  logger.info("[create dispositif]", data);
  return API.createDispositif(data);
}
