import logger from "../../../logger";
import { Id, Picture, ResponseWithData } from "../../../types/interface";
import { getDispositifsFromDB } from "../../../modules/dispositif/dispositif.repository";
import pick from "lodash/pick";

type Author = {
  _id: Id;
  username: string;
}
type Creator = {
  _id: Id;
  username: string;
  picture: Picture;
  email: string;
}
type Sponsor = {
  _id: Id;
  nom: string;
  picture: Picture;
  status: string;
}
export interface GetAllDispositifsResponse {
  _id: Id;
  titreInformatif: string;
  titreMarque: string;
  typeContenu: string;
  status: string;
  theme?: Id;
  secondaryThemes?: Id[];
  needs: Id[];
  created_at?: Date;
  publishedAt?: Date;
  publishedAtAuthor: Author;
  updatedAt?: Date;
  lastModificationDate?: Date;
  lastAdminUpdate?: Date;
  nbMots: number;
  nbVues: number;
  nbMercis: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
  draftReminderMailSentDate?: Date;
  draftSecondReminderMailSentDate?: Date;
  lastReminderMailSentToUpdateContentDate?: Date;
  lastModificationAuthor: Author;
  mainSponsor: Sponsor;
  themesSelectedByAuthor: boolean
  webOnly: boolean;
  creatorId: Creator;
}

export const getAllDispositifs = async (): ResponseWithData<GetAllDispositifsResponse[]> => {
  logger.info("[getAllDispositifs] called");

  const dispositifs: GetAllDispositifsResponse[] = (await getDispositifsFromDB()).map(d => ({
    _id: d._id,
    nbMercis: d.merci.length,
    ...pick(d.translations.fr.content, ["titreInformatif", "titreMarque"]),
    ...pick(d, [
      "updatedAt",
      "status",
      "typeContenu",
      "creatorId",
      "created_at",
      "publishedAt",
      "publishedAtAuthor",
      "adminComments",
      "adminProgressionStatus",
      "adminPercentageProgressionStatus",
      "lastAdminUpdate",
      "draftReminderMailSentDate",
      "draftSecondReminderMailSentDate",
      "lastReminderMailSentToUpdateContentDate",
      "lastModificationDate",
      "lastModificationAuthor",
      "needs",
      "theme",
      "secondaryThemes",
      "nbVues",
      "nbMots",
      "mainSponsor",
      "themesSelectedByAuthor",
      "webOnly",
    ])
  }));

  return {
    text: "success",
    data: dispositifs
  }
};
