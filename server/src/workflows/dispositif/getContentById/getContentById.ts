import { Picture, ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { NotFoundError } from "../../../errors";
import { Languages } from "../../../typegoose";
import { omit } from "lodash";
import { ageType, frenchLevel, justificatifType, priceDetails, publicType } from "../../../types/newInterface";

interface InfoSection {
  title: string;
  text: string;
}

interface Sponsor {
  name: string;
  logo: string;
  link: string;
}

interface SponsorDB {
  _id: any;
  nom: string;
  picture: Picture;
}

interface Poi {
  title: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  description?: string;
  email?: string;
  phone?: string;
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
  mainSponsor?: SponsorDB
  theme?: any;
  secondaryThemes?: any[];
  needs: any;
  sponsors?: (Sponsor | SponsorDB)[];
  participants: {
    _id: any;
    username: string;
    picture: Picture;
  }[];
  suggestions: any;
  merci: { created_at: Date, userId?: any }[];
  metadatas: {
    location?: string[];
    frenchLevel?: frenchLevel[];
    important?: string;
    age?: {
      type: ageType;
      ages: number[];
    };
    price?: {
      value: number;
      details?: priceDetails;
    }
    duration?: string;
    public?: publicType;
    titreSejourRequired?: boolean;
    acteNaissanceRequired?: boolean;
    justificatif?: justificatifType;
  };
  map: Poi[];
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
    merci: 1,
    translations: 1,
    metadatas: 1,
    map: 1
  }

  const dispositif = await getDispositifById(id, fields, [
    { path: "mainSponsor", select: "_id nom picture" },
    { path: "sponsors", select: "_id nom picture" },
    { path: "participants", select: "username picture" }
  ]);
  if (!dispositif) throw new NotFoundError("Dispositif not found")

  const dataLanguage = dispositif.isTranslatedIn(locale) ? locale : "fr";

  //@ts-ignore FIXME : toObject returns a full document -> wrong types
  const response: GetDispositifResponse = {
    ...(dispositif.translations[dataLanguage].content),
    ...omit(dispositif.toObject(), ["translations"]),
  };

  return { text: "success", data: response }
};
