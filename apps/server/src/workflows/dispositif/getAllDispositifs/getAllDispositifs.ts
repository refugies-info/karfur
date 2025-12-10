import { DispositifStatus, type GetAllDispositifsResponse } from "@refugies-info/api-types";
import pick from "lodash/pick";
import logger from "~/logger";
import {
  getDispositifsFromDB,
  getDraftDispositifById,
} from "~/modules/dispositif/dispositif.repository";
import type { ResponseWithData } from "~/types/interface";

const getStatus = async (
  d: Awaited<ReturnType<typeof getDispositifsFromDB>>[number],
): Promise<DispositifStatus> => {
  // if the draft version is in UPDATE_TO_VALIDATE, return this status for the dispositif
  if (d.hasDraftVersion) {
    const draftDispositif = await getDraftDispositifById(d._id, { status: 1 });
    if (draftDispositif.status === DispositifStatus.UPDATE_TO_VALIDATE)
      return DispositifStatus.UPDATE_TO_VALIDATE;
  }

  return d.status;
};

export const getAllDispositifs = async (): ResponseWithData<GetAllDispositifsResponse[]> => {
  logger.info("[getAllDispositifs] called");

  const dispositifs: any[] = await Promise.all(
    (await getDispositifsFromDB()).map(async (d) => {
      const status = await getStatus(d);
      return {
        _id: d._id,
        nbMercis: d.merci?.length || 0,
        hasDraftVersion: !!d.hasDraftVersion,
        status,
        ...pick(d.translations.fr.content, ["titreInformatif", "titreMarque"]),
        ...pick(d, [
          "updatedAt",
          "typeContenu",
          "creatorId",
          "created_at",
          "publishedAt",
          "publishedAtAuthor",
          "adminComments",
          "adminProgressionStatus",
          "lastAdminUpdate",
          "draftReminderMailSentDate",
          "draftSecondReminderMailSentDate",
          "lastReminderMailSentToUpdateContentDate",
          "lastModificationDate",
          "deletionDate",
          "lastModificationAuthor",
          "needs",
          "theme",
          "secondaryThemes",
          "nbVues",
          "nbMots",
          "mainSponsor",
          "themesSelectedByAuthor",
          "webOnly",
          "origin",
        ]),
      };
    }),
  );

  return {
    text: "success",
    data: dispositifs,
  };
};
