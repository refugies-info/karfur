import logger from "../../../logger";
import { Res, IDispositif, Picture } from "../../../types/interface";
import { getDispositifsFromDB } from "../../../modules/dispositif/dispositif.repository";
import { adaptDispositifMainSponsorAndCreatorId } from "../../../modules/dispositif/dispositif.adapter";
import { turnToLocalizedTitles } from "../../../controllers/dispositif/functions";
import { ObjectId } from "mongoose";

interface SponsorMainInfo {
  _id: ObjectId;
  nom: string;
  status: string;
  picture: Picture;
}

interface CreatorMainInfo {
  username: string;
  picture: Picture;
  _id: ObjectId;
  email: string;
}
export interface DispositifMainInfo {
  titreInformatif: string | Record<string, string>;
  titreMarque?: string | Record<string, string>;
  updatedAt: number;
  status: string;
  typeContenu: string;
  created_at: number;
  publishedAt?: number;
  adminComments?: string;
  adminProgressionStatus?: string;
  adminPercentageProgressionStatus?: string;
  lastAdminUpdate?: number;
  draftReminderMailSentDate?: number;
  lastModificationDate?: number;
  mainSponsor?: SponsorMainInfo;
  creatorId: CreatorMainInfo;
}

export const getAllDispositifs = async (req: {}, res: Res) => {
  try {
    logger.info("[getAllDispositifs] called");

    const neededFields = {
      titreInformatif: 1,
      titreMarque: 1,
      updatedAt: 1,
      status: 1,
      typeContenu: 1,
      created_at: 1,
      publishedAt: 1,
      adminComments: 1,
      adminProgressionStatus: 1,
      adminPercentageProgressionStatus: 1,
      lastAdminUpdate: 1,
      draftReminderMailSentDate: 1,
      lastReminderMailSentToUpdateContentDate: 1,
      lastModificationDate: 1,
      needs: 1,
      tags: 1,
    };

    const dispositifs = await getDispositifsFromDB(neededFields);

    // @ts-ignore
    const adaptedDispositifs: DispositifMainInfo[] =
      adaptDispositifMainSponsorAndCreatorId(dispositifs);

    const array: string[] = [];

    array.forEach.call(adaptedDispositifs, (dispositif: IDispositif) => {
      turnToLocalizedTitles(dispositif, "fr");
    });

    res.status(200).json({
      text: "Succès",
      data: adaptedDispositifs,
    });
  } catch (error) {
    logger.error("[getAllDispositifs] error while getting dispositifs", {
      error,
    });
    switch (error) {
      case 500:
        res.status(500).json({
          text: "Erreur interne",
        });
        break;
      case 404:
        res.status(404).json({
          text: "Pas de résultat",
        });
        break;
      default:
        res.status(500).json({
          text: "Erreur interne",
        });
    }
  }
};
