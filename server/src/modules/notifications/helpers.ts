import { AppUserType } from "../../schema/schemaAppUser";
import { DispositifPopulatedThemesDoc } from "../../schema/schemaDispositif";

const ACTION_ZONE = "Zone d'action";
const TARGET_AUDIENCE = "C'est pour qui ?";
const TARGET_AGE = "Âge requis";
// const FRENCH_LEVEL = "Niveau de français";
// const ALL_FRENCH_LEVEL = "Tous les niveaux";
const ALL = "All";

interface Requirements {
  age: { min: number; max: number };
  departments: string[] | null;
  type: "dispositif" | "demarche";
  mainThemeId: string | null;
}

export const getTitle = (title: string | Record<string, string>, lang: string = "fr") => {
  if (typeof title === "string") {
    return title;
  }

  return title[lang] || title["fr"] || "";
};

const getAge = (target: any) => {
  const age = target?.children?.find((item: any) => getTitle(item.title) === TARGET_AGE);

  return {
    min: parseInt(age?.bottomValue || 0),
    max: parseInt(age?.topValue || 99)
  };
};

// const getFrenchLevel = (target: any) => {
//   const frenchLevel = target?.children?.find((item: any) => getTitle(item.title) === FRENCH_LEVEL);

//   return frenchLevel ? getTitle(frenchLevel.contentTitle) : ALL_FRENCH_LEVEL;
// };

const getDepartments = (target: any): string[] => {
  const actionZone = target?.children?.find((item: any) => getTitle(item.title) === ACTION_ZONE);
  if (actionZone) {
    return actionZone.departments
      .map((dep: string) => {
        if (dep === ALL) {
          return dep;
        }
        const split = dep.split("-");
        if (split.length < 2) {
          return null;
        }
        return split.slice(1).join("-").trim();
      })
      .filter((dep: []) => dep?.length);
  }
  return [ALL];
};

const parseTargetAge = (targetAge: string) => {
  if (targetAge === "0 à 17 ans") {
    return {
      min: 0,
      max: 17
    };
  } else if (targetAge === "18 à 25 ans") {
    return {
      min: 18,
      max: 25
    };
  } else if (targetAge === "26 ans et plus") {
    return {
      min: 26,
      max: 60
    };
  }
  return {
    min: 0,
    max: 60
  };
};

//Extracts age, french level, departments from a dispositif
export const parseDispositif = (dispositif: DispositifPopulatedThemesDoc): Requirements => {
  const target = (dispositif?.contenu as any)?.find((item: any) => getTitle(item.title) === TARGET_AUDIENCE);

  if (!target) {
    return null;
  }

  return {
    departments: getDepartments(target),
    age: getAge(target),
    type: dispositif.typeContenu,
    mainThemeId: dispositif?.theme?._id.toString() || null
  };
};

export const filterTargets = (targets: AppUserType[], requirements: Requirements, lang: string) => {
  return targets.filter((target) => {
    const { age, departments, type, mainThemeId } = requirements;
    const { notificationsSettings } = target;
    const parsedAge = parseTargetAge(target.age);

    const ageOk = !target.age || (parsedAge.min >= age.min && parsedAge.max <= age.max);
    const departmentsOk = (
      departments.includes(target.department) && notificationsSettings.local
    ) || (
      departments.includes(ALL) && notificationsSettings.global
    );

    const typeOk = type === "dispositif" ? true : notificationsSettings?.demarches;
    const themeOk = !mainThemeId || notificationsSettings?.themes?.[mainThemeId];

    const langOk = target.selectedLanguage === lang;

    return langOk && ageOk && departmentsOk && themeOk && typeOk && target.expoPushToken;
  });
};

export const filterTargetsForDemarche = (targets: AppUserType[], requirements: Requirements, avancement: any) => {
  return targets.filter((target) => {
    const { age, mainThemeId } = requirements;
    const { notificationsSettings } = target;
    const parsedAge = parseTargetAge(target.age);

    const ageOk = !target.age || parsedAge.min >= 18 || (parsedAge.max < 18 && age.min === 0);

    const typeOk = notificationsSettings?.demarches;
    const themeOk = !mainThemeId || notificationsSettings?.themes?.[mainThemeId];

    const langOk = target.selectedLanguage === "fr" || avancement[target.selectedLanguage] === 1;

    return langOk && ageOk && themeOk && typeOk && target.expoPushToken;
  });
};


export const getNotificationEmoji = (dispositif: DispositifPopulatedThemesDoc) => {
  return dispositif.theme.notificationEmoji || "🔔";
};
