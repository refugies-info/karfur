import { ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { NotFoundError } from "../../../errors";
import { Languages } from "../../../typegoose";
import { omit } from "lodash";

interface InfoSection {
  title: string;
  text: string;
}

export type InfoSections = Record<string, InfoSection>;

export type GetDispositifResponse = {
  titreInformatif: string;
  titreMarque: string;
  abstract: string;
  what: string;
  why?: InfoSections;
  how: InfoSections;
  next?: InfoSections;
  typeContenu: string;
  status: string;
  // TODO: type
  mainSponsor?: any;
  theme?: any;
  secondaryThemes?: any[];
  needs: any;
  sponsors?: any;
  participants: any;
  suggestions: any;
  merci: any;
  metadatas: any;
  map: any;
};

export const getContentById = async (id: string, locale: Languages): ResponseWithData<GetDispositifResponse> => {
  logger.info("[getContentById] called", {
    locale,
    id
  });

  const fields = {
    typeContenu: 1,
    status: 1,
    mainSponsor: 1,
    theme: 1,
    secondaryThemes: 1,
    needs: 1,
    sponsors: 1,
    participants: 1,
    suggestions: 1,
    merci: 1,
    translations: 1,
    metadatas: 1,
    map: 1
  }

  const dispositif = await getDispositifById(id, fields, "mainSponsor");
  if (!dispositif) throw new NotFoundError("Dispositif not found")

  const dataLanguage = dispositif.isTranslatedIn(locale) ? locale : "fr";

  const response: GetDispositifResponse = {
    ...(dispositif.translations[dataLanguage].content),
    ...omit(dispositif.toObject(), ["translations"])
  }

  return { text: "success", data: response }
};
