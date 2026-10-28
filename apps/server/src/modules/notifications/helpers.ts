import { ContentType, type Metadatas } from "@refugies-info/api-types";
import type { AppUserType, Dispositif, Theme } from "@refugies-info/mongo";
import type { FilterQuery } from "mongoose";
import {
  getDispositifDepartements,
  getDispositifTheme,
} from "~/modules/dispositif/dispositif.business";

const ALL = "france";

export interface Requirements {
  age: { min: number; max: number };
  departments: Metadatas["location"];
  type: ContentType;
  mainThemeId: string | null;
}

// FIXME : refactor
export const getTitle = (title: string | Record<string, string>, lang: string = "fr") => {
  if (typeof title === "string") {
    return title;
  }

  return title[lang] || title["fr"] || "";
};

export const getAge = (dispositif: Dispositif) => {
  const age = dispositif.metadatas?.age;
  if (!age) {
    return {
      min: 0,
      max: 99,
    };
  }

  if (age.type === "lessThan") {
    return {
      min: 0,
      max: age.ages[0],
    };
  } else if (age.type === "moreThan") {
    return {
      min: age.ages[0],
      max: 99,
    };
  }
  return {
    min: Math.min(...age.ages),
    max: Math.max(...age.ages),
  };
};

const parseTargetAge = (targetAge: string) => {
  if (targetAge === "0 à 17 ans") {
    return {
      min: 0,
      max: 17,
    };
  } else if (targetAge === "18 à 25 ans") {
    return {
      min: 18,
      max: 25,
    };
  } else if (targetAge === "26 ans et plus") {
    return {
      min: 26,
      max: 60,
    };
  }
  return {
    min: 0,
    max: 60,
  };
};

//Extracts age, french level, departments from a dispositif
export const parseDispositif = (dispositif: Dispositif): Requirements => {
  return {
    departments: getDispositifDepartements(dispositif) as any,
    age: getAge(dispositif),
    type: dispositif.typeContenu,
    mainThemeId: (dispositif.theme as unknown as Theme)?._id?.toString() || null,
  };
};

const getDepartmentNames = (departments: string[]) => departments.map((dep) => dep.split(" - ")[1]);

const hasPushTokenQuery = { expoPushToken: { $nin: [null, ""] } };

const getThemeQuery = (mainThemeId: string | null) =>
  mainThemeId ? { [`notificationsSettings.themes.${mainThemeId}`]: true } : {};

export const getTargetsQuery = (
  requirements: Requirements,
  lang: string,
): FilterQuery<AppUserType> => {
  const { departments, mainThemeId } = requirements;
  const locationQuery = Array.isArray(departments)
    ? { department: { $in: getDepartmentNames(departments) }, "notificationsSettings.local": true }
    : departments === ALL
      ? { "notificationsSettings.global": true }
      : { department: { $in: [] as string[] } };

  return {
    selectedLanguage: lang,
    ...hasPushTokenQuery,
    ...getThemeQuery(mainThemeId),
    ...locationQuery,
  };
};

export const getDemarcheTargetsQuery = (
  requirements: Requirements,
  languages: string[],
): FilterQuery<AppUserType> => ({
  selectedLanguage: { $in: languages },
  "notificationsSettings.demarches": true,
  ...hasPushTokenQuery,
  ...getThemeQuery(requirements.mainThemeId),
});

export const filterTargets = (targets: AppUserType[], requirements: Requirements, lang: string) => {
  return targets.filter((target) => {
    const { age, departments, type, mainThemeId } = requirements;
    const { notificationsSettings } = target;
    const parsedAge = parseTargetAge(target.age);

    const ageOk = !target.age || (parsedAge.min >= age.min && parsedAge.max <= age.max);
    const departmentsOk =
      (Array.isArray(departments) &&
        getDepartmentNames(departments).includes(target.department) &&
        notificationsSettings.local) ||
      (departments === ALL && notificationsSettings.global);

    const typeOk = type === ContentType.DISPOSITIF ? true : notificationsSettings?.demarches;
    const themeOk = !mainThemeId || notificationsSettings?.themes?.[mainThemeId];

    const langOk = target.selectedLanguage === lang;

    return langOk && ageOk && departmentsOk && themeOk && typeOk && target.expoPushToken;
  });
};

export const filterTargetsForDemarche = (
  targets: AppUserType[],
  requirements: Requirements,
  languages: string[],
) => {
  return targets.filter((target) => {
    const { age, mainThemeId } = requirements;
    const { notificationsSettings } = target;
    const parsedAge = parseTargetAge(target.age);

    const ageOk = !target.age || parsedAge.min >= 18 || (parsedAge.max < 18 && age.min === 0);

    const typeOk = notificationsSettings?.demarches;
    const themeOk = !mainThemeId || notificationsSettings?.themes?.[mainThemeId];

    const langOk = languages.includes(target.selectedLanguage || "");

    return langOk && ageOk && themeOk && typeOk && target.expoPushToken;
  });
};

export const getNotificationEmoji = (dispositif: Dispositif) => {
  return getDispositifTheme(dispositif)?.notificationEmoji || "🔔";
};
