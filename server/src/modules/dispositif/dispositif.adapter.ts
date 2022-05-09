import {
  DispositifPopulatedDoc,
  DispositifPopulatedMainSponsorDoc,
} from "../../schema/schemaDispositif";
import logger from "../../logger";
import moment from "moment";
import { ObjectId } from "mongoose";
import { IDispositif } from "../../types/interface";
import { departmentRegionCorrespondency } from "./data";
import _ from "lodash";
import { isTitreInformatifObject } from "../../types/typeguards";

export const filterDispositifsForDraftReminders = (
  dispositifs: DispositifPopulatedDoc[],
  nbDaysBeforeReminder: number,
  reminderDateProp: "draftReminderMailSentDate" | "draftSecondReminderMailSentDate"
) =>
  dispositifs.filter((dispositif) => {
    if (dispositif.get(reminderDateProp)) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has already received reminder`
      );
      return false;
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(
      moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24)
    );

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendDraftReminderMail] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} days ago`
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

export const filterDispositifsForUpdateReminders = (
  dispositifs: DispositifPopulatedDoc[],
  nbDaysBeforeReminder: number
) =>
  dispositifs.filter((dispositif) => {
    if (dispositif.lastReminderMailSentToUpdateContentDate) {
      const nbDaysLastReminderFromNow = Math.round(
        moment(moment()).diff(
          dispositif.lastReminderMailSentToUpdateContentDate
        ) /
          (1000 * 60 * 60 * 24)
      );
      if (nbDaysLastReminderFromNow < nbDaysBeforeReminder) {
        logger.info(
          `[sendReminderMailToUpdateContents] dispositif with id ${dispositif._id} has already received reminder ${nbDaysLastReminderFromNow} days ago`
        );
        return false;
      }
    }

    const lastUpdate = dispositif.lastModificationDate || dispositif.updatedAt;
    const nbDaysFromNow = Math.round(
      moment(moment()).diff(lastUpdate) / (1000 * 60 * 60 * 24)
    );

    if (nbDaysFromNow < nbDaysBeforeReminder) {
      logger.info(
        `[sendReminderMailToUpdateContents] dispositif with id ${dispositif._id} has been updated ${nbDaysFromNow} days ago`
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

export interface FormattedDispositif {
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

export const removeUselessContent = (dispositifArray: IDispositif[]) =>
  dispositifArray.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.map(
      (child: any) => {
        if (child.title === "Zone d'action") {
          return child;
        }
        return {};
      }
    );

    const simplifiedContent = [{}, { children: selectZoneAction }];
    return { ...dispositif, contenu: simplifiedContent };
  });

export const countDispositifMercis = (
  dispositifs: Partial<IDispositif>[]
) =>
  dispositifs.map((dispositif) => {
    const nbMercis = (dispositif.merci || []).length;
    delete dispositif.merci;

    return {
      ...dispositif,
      nbMercis: nbMercis
    };
  });

export const adaptDispositifMainSponsorAndCreatorId = (
  dispositifs: DispositifPopulatedMainSponsorDoc[]
) =>
  dispositifs.map((dispositif) => {
    const jsonDispositif = dispositif.toJSON();

    return {
      ...jsonDispositif,
      mainSponsor: jsonDispositif.mainSponsor
        ? {
            _id: jsonDispositif.mainSponsor._id,
            nom: jsonDispositif.mainSponsor.nom,
            status: jsonDispositif.mainSponsor.status,
            picture: jsonDispositif.mainSponsor.picture,
          }
        : "",
      creatorId: jsonDispositif.creatorId
        ? {
            username: jsonDispositif.creatorId.username,
            picture: jsonDispositif.creatorId.picture,
            _id: jsonDispositif.creatorId._id,
            email: jsonDispositif.creatorId.email,
          }
        : null,
    };
  });

interface Result {
  _id: ObjectId;
  department: string;
  region: string;
}
interface CorrespondingData {
  department: string;
  region: string;
}
const getRegion = (
  correspondingData: CorrespondingData[],
  department: string
) => {
  if (department === "All") return "France";
  return correspondingData.length > 0
    ? correspondingData[0].region
    : "No geoloc";
};

export const adaptDispositifDepartement = (dispositifs: IDispositif[]) => {
  const result: Result[] = [];

  dispositifs.map((dispositif) => {
    const selectZoneAction = dispositif.contenu[1].children.filter(
      (child: any) => child.title === "Zone d'action"
    );
    const departments =
      selectZoneAction.length > 0 && selectZoneAction[0].departments.length > 0
        ? selectZoneAction[0].departments
        : ["No geoloc"];

    departments.map((department: string) => {
      const correspondingData = departmentRegionCorrespondency.filter(
        (data) => data.department === department
      );

      const region = getRegion(correspondingData, department);

      return result.push({
        _id: dispositif._id,
        department,
        region,
      });
    });

    return;
  });

  return result;
};

export const getRegionFigures = (dispositifs: Result[]) => {
  const groupedDataByRegion = _.groupBy(dispositifs, "region");
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");

  const regionArray = Object.keys(
    _.groupBy(departmentRegionCorrespondency, "region")
  );
  const regionArrayFull = regionArray.concat(["No geoloc", "France"]);
  return regionArrayFull.map((region) => {
    const correspondingData = departmentRegionCorrespondency.filter(
      (data) => data.region === region
    );
    let nbDepartmentsWithDispo = 0;
    correspondingData.map((data) => {
      if (Object.keys(groupedDataByDepartment).includes(data.department)) {
        nbDepartmentsWithDispo++;
      }
      return;
    });
    return {
      region,
      nbDispositifs: groupedDataByRegion[region]
        ? groupedDataByRegion[region].length
        : 0,
      nbDepartments: correspondingData.length,
      nbDepartmentsWithDispo,
    };
  });
};

export const getDepartementsFigures = (dispositifs: Result[]) => {
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");
  const departementArray = Object.keys(
    _.groupBy(departmentRegionCorrespondency, "department")
  );
  return departementArray.map((dep) => {
    const dataRegion = departmentRegionCorrespondency.filter(
      (data) => data.department === dep
    );

    return {
      departement: dep,
      nbDispositifs: groupedDataByDepartment[dep]
        ? groupedDataByDepartment[dep].length
        : 0,
      region:
        dataRegion && dataRegion[0] ? dataRegion[0].region : "Pas de région",
    };
  });
};

export const getTitreInfoOrMarque = (
  titre: string | Record<string, string> | null
): string => {
  if (!titre) return "";
  if (isTitreInformatifObject(titre)) {
    return titre.fr;
  }
  return titre;
};

export const getTitreInfoOrMarqueInLocale = (
  titre: string | Record<string, string> | null,
  locale: string
): string => {
  if (!titre) return "";
  if (isTitreInformatifObject(titre)) {
    return titre[locale] || titre.fr;
  }
  return titre;
};

export const filterContentsOnGeoloc = (
  contentsArray: IDispositif[],
  department: string | null,
  strict: boolean = false
) => {
  if (!department) return contentsArray;
  return contentsArray.filter((content) => {
    if (
      content.contenu &&
      content.contenu[1] &&
      content.contenu[1].children &&
      content.contenu[1].children.length
    ) {
      const geolocInfocard = content.contenu[1].children.find(
        (infocard: any) => infocard.title === "Zone d'action"
      );
      if (geolocInfocard && geolocInfocard.departments) {
        for (var i = 0; i < geolocInfocard.departments.length; i++) {
          if (!strict && geolocInfocard.departments[i] === "All") {
            return true;
          }
          if (geolocInfocard.departments[i].split(" - ")[1] === department) {
            return true;
          }
        }
      }
    }
  });
};
