import { DispositifPopulatedDoc } from "../../schema/schemaDispositif";
import logger = require("../../logger");
import moment from "moment";
import { ObjectId } from "mongoose";

export const filterDispositifsForDraftReminders = (
  dispositifs: DispositifPopulatedDoc[],
  nbDaysBeforeReminder: number
) =>
  dispositifs.filter((dispositif) => {
    if (dispositif.draftReminderMailSentDate) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has already received reminder `
      );
      return false;
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(
      moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24)
    );

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} ago`
      );
      return false;
    }

    if (!dispositif.creatorId.email) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id}, creator has no email related`
      );
      return false;
    }

    return true;
  });

interface Dispositif {
  _id: ObjectId;
  titreInformatif: string;
  creatorId: { _id: ObjectId; username: string; email?: string };
}

interface FormattedDispositif {
  creatorId: ObjectId;
  username: string;
  email: string;
  dispositifs: { _id: ObjectId; titreInformatif: string }[];
}
export const formatDispositifsByCreator = (dispositifs: Dispositif[]) => {
  const formattedArray: FormattedDispositif[] = [];

  dispositifs.forEach((dispositif) => {
    const elementIndex = formattedArray.findIndex(
      (obj) => obj.creatorId.toString() === dispositif.creatorId._id.toString()
    );

    const isCreatorIdInArray = elementIndex !== -1;

    if (!isCreatorIdInArray) {
      formattedArray.push({
        creatorId: dispositif.creatorId._id,
        username: dispositif.creatorId.username,
        email: dispositif.creatorId.email,
        dispositifs: [
          { _id: dispositif._id, titreInformatif: dispositif.titreInformatif },
        ],
      });
      return;
    }

    const updatedObject = {
      ...formattedArray[elementIndex],
      dispositifs: [
        ...formattedArray[elementIndex].dispositifs,
        { _id: dispositif._id, titreInformatif: dispositif.titreInformatif },
      ],
    };

    formattedArray[elementIndex] = updatedObject;
  });
  return formattedArray;
};
