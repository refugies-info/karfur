import logger from "../../../logger";
import { ResponseWithData } from "../../../types/interface";
import { getDispositifsFromDB } from "../../../modules/dispositif/dispositif.repository";
import pick from "lodash/pick";
import { GetAllDispositifsResponse } from "@refugies-info/api-types";

export const getAllDispositifs = async (): ResponseWithData<GetAllDispositifsResponse[]> => {
  logger.info("[getAllDispositifs] called");

  const dispositifs: GetAllDispositifsResponse[] = (await getDispositifsFromDB()).map((d) => ({
    _id: d._id,
    nbMercis: d.merci.length,
    hasDraftVersion: !!d.hasDraftVersion,
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
    ]),
  }));

  return {
    text: "success",
    data: dispositifs,
  };
};
