import pick from "lodash/pick";
import { v4 as uuidv4 } from "uuid";
import { ContentType, CreateDispositifRequest, GetDispositifResponse, Id, InfoSections, UpdateDispositifRequest } from "api-types";
import { logger } from "logger";
import API from "utils/API";

export const getMaxAccordions = (contentType: ContentType, sectionKey: string) => {
  const isLastSection = (contentType === ContentType.DISPOSITIF && sectionKey === "how") ||
    (contentType === ContentType.DEMARCHE && sectionKey === "next");
  return isLastSection ? 1 : 3;
}

const generateAccordions = (contentType: ContentType, sectionKey: string) => {
  const newContent: InfoSections = {};
  for (let i = 0; i < getMaxAccordions(contentType, sectionKey); i++) {
    const key = uuidv4();
    newContent[key] = { title: "", text: "" };
  }
  return newContent;
}

export const getInitialValue = (contentType: ContentType): CreateDispositifRequest => {
  const defaultValues: CreateDispositifRequest = {
    typeContenu: contentType,
    ...(contentType === ContentType.DISPOSITIF ? {
      why: generateAccordions(contentType, "why"),
      how: generateAccordions(contentType, "how"),
    } : {
      how: generateAccordions(contentType, "how"),
      next: generateAccordions(contentType, "next"),
    })
  };

  return defaultValues;
}


export const getDefaultValue = (dispositif: GetDispositifResponse | null): UpdateDispositifRequest => {
  if (!dispositif) return {};
  const defaultValues: UpdateDispositifRequest = {
    ...pick(dispositif, ["titreInformatif", "titreMarque", "abstract", "what", "why", "how", "next", "metadatas", "map"]),
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
