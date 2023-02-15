import { Id, Metadatas, Picture, ResponseWithData } from "../../../types/interface";
import logger from "../../../logger";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { NotFoundError } from "../../../errors";
import { Languages } from "../../../typegoose";
import pick from "lodash/pick";

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
  _id: Id;
  nom: string;
  picture: Picture;
}

interface User {
  _id: Id;
  username: string;
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
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  sponsors?: (Sponsor | SponsorDB)[];
  participants: User[];
  merci: { created_at: Date, userId?: Id }[];
  metadatas: Metadatas;
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

  const dispositif = await (await getDispositifById(id, fields)).populate<{
    mainSponsor: SponsorDB,
    sponsors: (SponsorDB | Sponsor)[],
    participants: User[]
  }>([
    { path: "mainSponsor", select: "_id nom picture" },
    { path: "sponsors", select: "_id nom picture" },
    { path: "participants", select: "_id username picture" }
  ]);
  if (!dispositif) throw new NotFoundError("Dispositif not found")
  const dataLanguage = dispositif.isTranslatedIn(locale) ? locale : "fr";

  const dispositifObject = dispositif.toObject();
  const response: GetDispositifResponse = {
    ...dispositifObject.translations[dataLanguage].content,
    metadatas: { ...dispositifObject.metadatas, ...dispositifObject.translations[dataLanguage].metadatas },
    ...pick(dispositif, ["typeContenu", "status", "mainSponsor", "theme", "secondaryThemes", "needs", "sponsors", "participants", "merci", "map"])
  };

  return { text: "success", data: response }
};
