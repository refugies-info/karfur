import _, { get } from "lodash";
import moment from "moment";
import logger from "../../logger";
import { departmentRegionCorrespondency } from "./data";
import { isTitreInformatifObject } from "../../types/typeguards";
import { Dispositif, DispositifId, UserId } from "src/typegoose";
import { RefactorTodoError } from "src/errors";

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

const keysToDelete: string[] = [
  "isFakeContent",
  "titleIcon",
  "typeIcon",
  "editable",
  "type",
  "footer",
  "footerType",
  "tooltipContent",
  "tooltipHeader"
];

export const removeUselessContent = (dispositifArray: Dispositif[]): Partial<Dispositif[]> => {
  throw new RefactorTodoError();
  // return dispositifArray.map((dispositif) => {
  //   const selectZoneAction = dispositif.contenu[1].children.map((child: any) => {
  //     if (child.title === "Zone d'action" || child.title === "Durée" || child.title === "Combien ça coûte ?") {
  //       const newChild = { ...child };
  //       for (const key of keysToDelete) {
  //         delete newChild[key];
  //       }
  //       return newChild;
  //     }
  //     return {};
  //   });

  //   const simplifiedContent = [{}, { children: selectZoneAction }];

  //   const simplifiedMainSponsor = {
  //     nom: dispositif.mainSponsor.nom,
  //     picture: {
  //       secure_url: dispositif.mainSponsor?.picture?.secure_url || null
  //     }
  //   };
  //   return { ...dispositif, contenu: simplifiedContent, mainSponsor: simplifiedMainSponsor };
};

export const countDispositifMercis = (dispositifs: Partial<Dispositif>[]) =>
  dispositifs.map((dispositif) => {
    const nbMercis = (dispositif.merci || []).length;
    delete dispositif.merci;

    return {
      ...dispositif,
      nbMercis: nbMercis
    };
  });

export const adaptDispositifMainSponsorAndCreatorId = (dispositifs: Dispositif[]) =>
  dispositifs.map((dispositif) => ({
    ...dispositif,
    mainSponsor: dispositif.getMainSponsor()
      ? {
          _id: dispositif.getMainSponsor()._id,
          nom: dispositif.getMainSponsor().nom,
          status: dispositif.getMainSponsor().status,
          picture: dispositif.getMainSponsor().picture
        }
      : "",
    creatorId: dispositif.getCreator()
      ? {
          username: dispositif.getCreator().username,
          picture: dispositif.getCreator().picture,
          _id: dispositif.getCreator()._id,
          email: dispositif.getCreator().email
        }
      : null
  }));

interface Result {
  _id: DispositifId;
  department: string;
  region: string;
}
interface CorrespondingData {
  department: string;
  region: string;
}
const getRegion = (correspondingData: CorrespondingData[], department: string) => {
  if (department === "All") return "France";
  return correspondingData.length > 0 ? correspondingData[0].region : "No geoloc";
};

export const adaptDispositifDepartement = (dispositifs: Dispositif[]): Dispositif[] => {
  throw new RefactorTodoError();
  // const result: Result[] = [];

  // dispositifs.map((dispositif) => {
  //   const selectZoneAction = dispositif.contenu[1].children.filter((child: any) => child.title === "Zone d'action");
  //   const departments =
  //     selectZoneAction.length > 0 && selectZoneAction[0].departments.length > 0
  //       ? selectZoneAction[0].departments
  //       : ["No geoloc"];

  //   departments.map((department: string) => {
  //     const correspondingData = departmentRegionCorrespondency.filter((data) => data.department === department);

  //     const region = getRegion(correspondingData, department);

  //     return result.push({
  //       _id: dispositif._id,
  //       department,
  //       region
  //     });
  //   });

  //   return;
  // });

  // return result;
};

export const getRegionFigures = (dispositifs: Result[]) => {
  const groupedDataByRegion = _.groupBy(dispositifs, "region");
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");

  const regionArray = Object.keys(_.groupBy(departmentRegionCorrespondency, "region"));
  const regionArrayFull = regionArray.concat(["No geoloc", "France"]);
  return regionArrayFull.map((region) => {
    const correspondingData = departmentRegionCorrespondency.filter((data) => data.region === region);
    let nbDepartmentsWithDispo = 0;
    correspondingData.map((data) => {
      if (Object.keys(groupedDataByDepartment).includes(data.department)) {
        nbDepartmentsWithDispo++;
      }
      return;
    });
    return {
      region,
      nbDispositifs: groupedDataByRegion[region] ? groupedDataByRegion[region].length : 0,
      nbDepartments: correspondingData.length,
      nbDepartmentsWithDispo
    };
  });
};

export const getDepartementsFigures = (dispositifs: Result[]) => {
  const groupedDataByDepartment = _.groupBy(dispositifs, "department");
  const departementArray = Object.keys(_.groupBy(departmentRegionCorrespondency, "department"));
  return departementArray.map((dep) => {
    const dataRegion = departmentRegionCorrespondency.filter((data) => data.department === dep);

    return {
      departement: dep,
      nbDispositifs: groupedDataByDepartment[dep] ? groupedDataByDepartment[dep].length : 0,
      region: dataRegion && dataRegion[0] ? dataRegion[0].region : "Pas de région"
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

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const filterContentsOnGeoloc = (
  contentsArray: Dispositif[],
  department: string | null,
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
