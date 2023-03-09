import _, { get } from "lodash";
import moment from "moment";
import logger from "../../logger";
import { departmentRegionCorrespondency, RegionData } from "./data";
import { isTitreInformatifObject } from "../../types/typeguards";
import { Dispositif, DispositifId, UserId } from "../../typegoose";
import { RefactorTodoError } from "../../errors";

export const filterDispositifsForDraftReminders = (
  dispositifs: Dispositif[],
  nbDaysBeforeReminder: number,
  reminderDateProp: "draftReminderMailSentDate" | "draftSecondReminderMailSentDate"
) =>
  dispositifs.filter((dispositif) => {
    if (get(dispositif, reminderDateProp)) {
      logger.info(`[sendDraftReminderMail] dispositif with id ${dispositif._id} has already received reminder`);
      return false;
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24));

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} days ago`
      );
      return false;
    }

    if (!dispositif.getCreator()?.email) {
      logger.info(`[sendDraftReminderMail] dispositif with id ${dispositif._id}, creator has no email related`);
      return false;
    }

    return true;
  });

export const filterDispositifsForUpdateReminders = (dispositifs: Dispositif[], nbDaysBeforeReminder: number) =>
  dispositifs.filter((dispositif) => {
    if (dispositif.lastReminderMailSentToUpdateContentDate) {
      const nbDaysLastReminderFromNow = Math.round(
        moment(moment()).diff(dispositif.lastReminderMailSentToUpdateContentDate) / (1000 * 60 * 60 * 24)
      );
      if (nbDaysLastReminderFromNow < nbDaysBeforeReminder) {
        logger.info(
          `[sendReminderMailToUpdateContents] dispositif with id ${dispositif._id} has already received reminder ${nbDaysLastReminderFromNow} days ago`
        );
        return false;
      }
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24));

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendReminderMailToUpdateContents] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} days ago`
      );
      return false;
    }

    return true;
  });

export interface FormattedDispositif {
  creatorId: UserId;
  username: string;
  email: string;
  dispositifs: { _id: DispositifId; titreInformatif: string }[];
}
export const formatDispositifsByCreator = (dispositifs: Dispositif[]) => {
  logger.error("TO REFACTOR");
  const formattedArray: FormattedDispositif[] = [];

  dispositifs.forEach((dispositif) => {
    const elementIndex = formattedArray.findIndex(
      (obj) => obj.creatorId.toString() === dispositif.creatorId._id.toString()
    );

    const isCreatorIdInArray = elementIndex !== -1;

    if (!isCreatorIdInArray && dispositif.getCreator()?.email) {
      formattedArray.push({
        creatorId: dispositif.creatorId._id,
        username: dispositif.getCreator()?.username,
        email: dispositif.getCreator()?.email,
        dispositifs: [{ _id: dispositif._id, titreInformatif: dispositif.getTranslated("content.titreInformatif") }]
      });
      return;
    }

    const updatedObject = {
      ...formattedArray[elementIndex],
      dispositifs: [
        ...formattedArray[elementIndex].dispositifs,
        { _id: dispositif._id, titreInformatif: dispositif.getTranslated("content.titreInformatif") }
      ]
    };

    formattedArray[elementIndex] = updatedObject;
  });
  return formattedArray;
};

interface Result {
  _id: DispositifId;
  department: string | null;
  region: string | null;
}

const getRegionName = (regionData: RegionData | undefined, department: string) => {
  if (department === "All") return "France";
  return regionData.region || null;
};

export const adaptDispositifDepartement = (dispositifs: Dispositif[]): Result[] => {
  const result: Result[] = [];

  for (const dispositif of dispositifs) {
    const location = dispositif.metadatas.location;
    const departments = location && location.length > 0 ? location : null;
    if (!departments) {
      result.push({
        _id: dispositif._id,
        department: null,
        region: null
      });
    } else {
      for (const department of departments) {
        const regionData = departmentRegionCorrespondency.find((data) => data.department === department);
        const region = getRegionName(regionData, department);
        result.push({
          _id: dispositif._id,
          department,
          region
        });
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
      nbDepartmentsWithDispo
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
      region: dataRegion?.region || "Pas de région"
    };
  });
};

export const getTitreInfoOrMarque = (titre: string | Record<string, string> | null): string => {
  if (!titre) return "";
  if (isTitreInformatifObject(titre)) {
    return titre.fr;
  }
  return titre;
};

export const getTitreInfoOrMarqueInLocale = (titre: string | Record<string, string> | null, locale: string): string => {
  if (!titre) return "";
  if (isTitreInformatifObject(titre)) {
    return titre[locale] || titre.fr;
  }
  return titre;
};

export const filterContentsOnGeoloc = (
  contentsArray: Dispositif[],
  department: string | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  strict: boolean = false
): any[] => {
  throw new RefactorTodoError();
  // if (!department) return contentsArray;
  // const normalizedRefDep = removeAccents(department);
  // return contentsArray.filter((content) => {
  //   if (content.contenu && content.contenu[1] && content.contenu[1].children && content.contenu[1].children.length) {
  //     const geolocInfocard = content.contenu[1].children.find((infocard: any) => infocard.title === "Zone d'action");
  //     if (geolocInfocard && geolocInfocard.departments) {
  //       for (var i = 0; i < geolocInfocard.departments.length; i++) {
  //         const normalizedDep = removeAccents(geolocInfocard.departments[i]);
  //         if (!strict && normalizedDep === "All") {
  //           return true;
  //         }
  //         if (normalizedDep.split(" - ")[1] === normalizedRefDep) {
  //           return true;
  //         }
  //       }
  //     }
  //   }
  // });
};
