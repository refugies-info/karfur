import { ContentType } from "api-types";
import { AppUser, Dispositif } from "../../typegoose";

const ALL = "All";

interface Requirements {
  age: { min: number; max: number };
  departments: string[] | null;
  type: ContentType;
  mainThemeId: string | null;
}

export const getTitle = (title: string | Record<string, string>, lang: string = "fr") => {
  if (typeof title === "string") {
    return title;
  }

  return title[lang] || title["fr"] || "";
};

const getAge = (dispositif: Dispositif) => {
  const age = dispositif.metadatas.age;

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
    departments: dispositif.getDepartements(),
    age: getAge(dispositif),
    type: dispositif.typeContenu,
    mainThemeId: dispositif.theme.toString() || null,
  };
};

export const filterTargets = (targets: AppUser[], requirements: Requirements, lang: string) => {
  return targets.filter((target) => {
    const { age, departments, type, mainThemeId } = requirements;
    const { notificationsSettings } = target;
    const parsedAge = parseTargetAge(target.age);

    const ageOk = !target.age || (parsedAge.min >= age.min && parsedAge.max <= age.max);
    const departmentsOk =
      (departments.includes(target.department) && notificationsSettings.local) ||
      (departments.includes(ALL) && notificationsSettings.global);

    const typeOk = type === ContentType.DISPOSITIF ? true : notificationsSettings?.demarches;
    const themeOk = !mainThemeId || notificationsSettings?.themes?.[mainThemeId];

    const langOk = target.selectedLanguage === lang;

    return langOk && ageOk && departmentsOk && themeOk && typeOk && target.expoPushToken;
  });
};

export const filterTargetsForDemarche = (targets: AppUser[], requirements: Requirements, demarche: Dispositif) => {
  return targets.filter((target) => {
    const { age, mainThemeId } = requirements;
    const { notificationsSettings } = target;
    const parsedAge = parseTargetAge(target.age);

    const ageOk = !target.age || parsedAge.min >= 18 || (parsedAge.max < 18 && age.min === 0);

    const typeOk = notificationsSettings?.demarches;
    const themeOk = !mainThemeId || notificationsSettings?.themes?.[mainThemeId];

    const langOk = demarche.isTranslatedIn(target.selectedLanguage);

    return langOk && ageOk && themeOk && typeOk && target.expoPushToken;
  });
};

export const getNotificationEmoji = (dispositif: Dispositif) => {
  return dispositif.getTheme()?.notificationEmoji || "🔔";
};
