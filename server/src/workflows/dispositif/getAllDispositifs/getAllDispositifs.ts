import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getDispositifsFromDB } from "../../../modules/dispositif/dispositif.repository";
import {
  adaptDispositifMainSponsorAndCreatorId,
  countDispositifMercis
} from "../../../modules/dispositif/dispositif.adapter";

export interface GetAllDispositifsResponse {

}

export const getAllDispositifs = async (): ResponseWithData<GetAllDispositifsResponse[]> => {
  logger.info("[getAllDispositifs] called");

  const neededFields = {
    titreInformatif: 1,
    titreMarque: 1,
    updatedAt: 1,
    status: 1,
    typeContenu: 1,
    created_at: 1,
    publishedAt: 1,
    publishedAtAuthor: 1,
    adminComments: 1,
    adminProgressionStatus: 1,
    adminPercentageProgressionStatus: 1,
    lastAdminUpdate: 1,
    draftReminderMailSentDate: 1,
    draftSecondReminderMailSentDate: 1,
    lastReminderMailSentToUpdateContentDate: 1,
    lastModificationDate: 1,
    lastModificationAuthor: 1,
    needs: 1,
    theme: 1,
    secondaryThemes: 1,
    merci: 1,
    nbVues: 1,
    themesSelectedByAuthor: 1,
    webOnly: 1
  };

  // const dispositifs = await getDispositifsFromDB(neededFields);

  // const adaptedDispositifs = adaptDispositifMainSponsorAndCreatorId(dispositifs);
  // FIXME const dispositifsResult = countDispositifMercis(adaptedDispositifs);

  // const array: string[] = [];

  // array.forEach.call(dispositifsResult, (dispositif: DispositifMainInfo) => {
  //   turnToLocalizedTitles(dispositif, "fr");
  // });

  return {
    text: "success",
    data: []
  }
};
