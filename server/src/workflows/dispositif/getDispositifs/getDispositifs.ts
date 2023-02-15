import logger from "../../../logger";
import { getDispositifArray } from "../../../modules/dispositif/dispositif.repository";
import { map } from "lodash/fp";
import omit from "lodash/omit";
import pick from "lodash/pick";
import { Languages } from "../../../typegoose";
import { GetDispositifsRequest } from "../../../controllers/dispositifController";
import { Id, Metadatas, Picture, ResponseWithData } from "../../../types/interface";

export interface GetDispositifsResponse {
  _id: Id;
  titreInformatif?: string;
  titreMarque?: string;
  abstract?: string;
  typeContenu: string;
  status: string;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  metadatas: Metadatas;
  created_at?: Date;
  publishedAt?: Date;
  lastModificationDate?: Date;
  nbMots: number;
  nbVues: number;
  mainSponsor?: {
    nom: string;
    picture: Picture
  }
}

export const getDispositifs = async (query: GetDispositifsRequest): ResponseWithData<GetDispositifsResponse[]> => {
  logger.info("[getDispositifs] called");
  const { type, locale, limit, sort } = query;

  const selectedLocale = (locale || "fr") as Languages;
  const dbQuery: any = { status: "Actif" };
  if (type) dbQuery.typeContenu = type;

  return getDispositifArray(dbQuery, {
    lastModificationDate: 1,
    mainSponsor: 1,
    needs: 1
  }, "mainSponsor", limit, sort)
    .then(map((dispositif) => {
      //@ts-ignore FIXME : type populate mainSponsor
      const resDisp: GetDispositifsResponse = {
        _id: dispositif._id,
        ...pick(dispositif.translations[selectedLocale].content, ["titreInformatif", "titreMarque", "abstract", "mainSponsor.nom", "mainSponsor.picture"]),
        metadatas: { ...dispositif.metadatas, ...dispositif.translations[selectedLocale].metadatas },
        ...omit(dispositif, ["translations"]),
      }
      return resDisp
    }))
    .then((result) => ({
      text: "success",
      data: result
    }))
};

