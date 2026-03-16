import type { Dispositif, DispositifId, UserId } from "@refugies-info/mongo";
import _, { get } from "lodash";
import moment from "moment";
import logger from "~/logger";
import {
  getDispositifCreator,
  getDispositifTranslated,
} from "~/modules/dispositif/dispositif.business";
import { departmentRegionCorrespondency, type RegionData } from "./data";

export const filterDispositifsForDraftReminders = (
  dispositifs: Dispositif[],
  nbDaysBeforeReminder: number,
  reminderDateProp: "draftReminderMailSentDate" | "draftSecondReminderMailSentDate",
) =>
  dispositifs.filter((dispositif) => {
    if (get(dispositif, reminderDateProp)) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has already received reminder`,
      );
      return false;
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24));

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} days ago`,
      );
      return false;
    }

    if (!getDispositifCreator(dispositif)?.email) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id}, creator has no email related`,
      );
      return false;
    }

    return true;
  });

export const filterDispositifsForUpdateReminders = (
  dispositifs: Dispositif[],
  nbDaysBeforeReminder: number,
  // ... (unchanged)
) =>
  dispositifs.filter((dispositif) => {
    // ... (unchanged logic mostly)
    if (dispositif.lastReminderMailSentToUpdateContentDate) {
      const nbDaysLastReminderFromNow = Math.round(
        moment(moment()).diff(dispositif.lastReminderMailSentToUpdateContentDate) /
          (1000 * 60 * 60 * 24),
      );
      if (nbDaysLastReminderFromNow < nbDaysBeforeReminder) {
        logger.info(
          `[sendReminderMailToUpdateContents] dispositif with id ${dispositif._id} has already received reminder ${nbDaysLastReminderFromNow} days ago`,
        );
        return false;
      }
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24));

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendReminderMailToUpdateContents] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} days ago`,
      );
      return false;
    }

    return true;
  });

export interface FormattedDispositif {
  creatorId: UserId;
  firstName: string | undefined;
  email: string;
  dispositifs: { _id: DispositifId; titreInformatif: string }[];
}
export const formatDispositifsByCreator = (dispositifs: Dispositif[]) => {
  logger.error("TO REFACTOR");
  const formattedArray: FormattedDispositif[] = [];

  dispositifs.forEach((dispositif) => {
    const creator = getDispositifCreator(dispositif);
    const checkedCreatorId = (dispositif.creatorId as any)._id || dispositif.creatorId; // Handle potential unpopulated or populated difference

    const elementIndex = formattedArray.findIndex(
      (obj) => obj.creatorId.toString() === checkedCreatorId.toString(),
    );

    const isCreatorIdInArray = elementIndex !== -1;

    if (!isCreatorIdInArray && creator?.email) {
      formattedArray.push({
        creatorId: checkedCreatorId,
        firstName: creator.firstName,
        email: creator.email,
        dispositifs: [
          {
            _id: dispositif._id,
            titreInformatif: getDispositifTranslated(
              dispositif,
              "content.titreInformatif",
            ) as unknown as string,
          },
        ],
      });
      return;
    }

    if (isCreatorIdInArray) {
      // Check to be safe
      const updatedObject = {
        ...formattedArray[elementIndex],
        dispositifs: [
          ...formattedArray[elementIndex].dispositifs,
          {
            _id: dispositif._id,
            titreInformatif: getDispositifTranslated(
              dispositif,
              "content.titreInformatif",
            ) as unknown as string,
          },
        ],
      };

      formattedArray[elementIndex] = updatedObject;
    }
  });
  return formattedArray;
};

interface Result {
  _id: DispositifId;
  department: string | null;
  region: string | null;
}

const getRegionName = (regionData: RegionData, department: string) => {
  if (department === "All") return "France";
  return regionData.region || null;
};

export const adaptDispositifDepartement = (dispositifs: Dispositif[]): Result[] => {
  const result: Result[] = [];

  for (const dispositif of dispositifs) {
    const location = dispositif.metadatas.location;
    const departments =
      location && Array.isArray(location) && location.length > 0 ? location : null;
    if (!departments) {
      result.push({
        _id: dispositif._id,
        department: null,
        region: null,
      });
    } else {
      for (const department of departments) {
        const regionData = departmentRegionCorrespondency.find(
          (data) => data.department === department,
        );
        if (regionData) {
          const region = getRegionName(regionData, department);
          result.push({
            _id: dispositif._id,
            department,
            region,
          });
        }
      }
    }
  }

  return result;
};

export const getRegionFigures = (dispositifs: Result[]) => {
  const groupedDataByRegion = _.groupBy(dispositifs, "region");
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");

  const regionArray = Object.keys(_.groupBy(departmentRegionCorrespondency, "region"));
  const regionArrayFull = regionArray.concat([null, "France"]);
  return regionArrayFull.map((region) => {
    const regionsData = departmentRegionCorrespondency.filter((data) => data.region === region);
    let nbDepartmentsWithDispo = 0;
    regionsData.map((data) => {
      if (Object.keys(groupedDataByDepartment).includes(data.department)) {
        nbDepartmentsWithDispo++;
      }
      return;
    });
    return {
      region,
      nbDispositifs: groupedDataByRegion[region] ? groupedDataByRegion[region].length : 0,
      nbDepartments: regionsData.length,
      nbDepartmentsWithDispo,
    };
  });
};

export const getDepartementsFigures = (dispositifs: Result[]) => {
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");
  const departementArray = Object.keys(_.groupBy(departmentRegionCorrespondency, "department"));
  return departementArray.map((dep) => {
    const dataRegion = departmentRegionCorrespondency.find((data) => data.department === dep);

    return {
      departement: dep,
      nbDispositifs: groupedDataByDepartment[dep] ? groupedDataByDepartment[dep].length : 0,
      region: dataRegion?.region || "Pas de région",
    };
  });
};
