import pick from "lodash/pick";
import { v4 as uuidv4 } from "uuid";
import { ContentType, CreateDispositifRequest, GetDispositifResponse, Id, InfoSections, UpdateDispositifRequest } from "@refugies-info/api-types";
import { logger } from "logger";
import API from "utils/API";

/**
 * Get max accordions count depending on the content type and the section
 */
export const getMaxAccordions = (contentType: ContentType, sectionKey: string) => {
  return contentType === ContentType.DISPOSITIF && sectionKey === "why" ? 3 : 1;
}

const generateAccordions = (contentType: ContentType, sectionKey: string) => {
  const newContent: InfoSections = {};
  for (let i = 0; i < getMaxAccordions(contentType, sectionKey); i++) {
    const key = uuidv4();
    newContent[key] = { title: "", text: "" };
  }
  return newContent;
}

/**
 * Fill initial form values for dispo create
 */
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

  if (contentType === ContentType.DEMARCHE) {
    defaultValues.metadatas = { location: "france" };
  }

  return defaultValues;
}

export const hasMissingAccordions = (dispositif: GetDispositifResponse | null, sectionKey: "why" | "how" | "next"): boolean => {
  if (!dispositif) return false;
  const section = dispositif[sectionKey] || {};
  return (getMaxAccordions(dispositif.typeContenu, sectionKey) - Object.keys(section).length) > 0;
}

const addMissingAccordions = (section: InfoSections, contentType: ContentType, sectionKey: string): InfoSections => {
  const newContent: InfoSections = { ...section };
  const missingAccordions = getMaxAccordions(contentType, sectionKey) - Object.keys(section).length;
  for (let i = 0; i < missingAccordions; i++) {
    const key = uuidv4();
    newContent[key] = { title: "", text: "" };
  }
  return newContent;
}

/**
 * Get initial form values for dispo edit
 */
export const getDefaultValue = (dispositif: GetDispositifResponse | null): UpdateDispositifRequest => {
  if (!dispositif) return {};
  const defaultValues: UpdateDispositifRequest = {
    ...pick(dispositif, ["titreInformatif", "titreMarque", "abstract", "what", "why", "how", "next", "metadatas", "map"]),
    mainSponsor: dispositif.mainSponsor?._id.toString(),
    theme: dispositif.theme?.toString(),
    secondaryThemes: dispositif.secondaryThemes?.map((t) => t.toString())
  };

  if (defaultValues.why) defaultValues.why = addMissingAccordions(defaultValues.why, dispositif?.typeContenu || ContentType.DISPOSITIF, "why");
  if (defaultValues.how) defaultValues.how = addMissingAccordions(defaultValues.how, dispositif?.typeContenu || ContentType.DISPOSITIF, "how");
  if (defaultValues.next) defaultValues.next = addMissingAccordions(defaultValues.next, dispositif?.typeContenu || ContentType.DISPOSITIF, "next");

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
