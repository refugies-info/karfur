import { DispositifStatus, GetContentsForAppRequest, GetContentsForAppResponse, Languages } from "api-types";

import { Dispositif } from "../../../typegoose";
import logger from "../../../logger";
import { getActiveContentsFiltered } from "../../../modules/dispositif/dispositif.repository";

const present = (locale: Languages) => (dispositif: Dispositif) => {
  const translation = dispositif.translations[locale] || dispositif.translations.fr;

  const sponsorUrl = dispositif.getMainSponsor().picture?.secure_url || null;

  return {
    _id: dispositif._id.toString(),
    titreInformatif: translation.content.titreInformatif,
    titreMarque: translation.content.titreMarque,
    theme: dispositif.theme,
    secondaryThemes: dispositif.secondaryThemes,
    needs: dispositif.needs,
    nbVues: dispositif.nbVues,
    nbVuesMobile: dispositif.nbVuesMobile,
    typeContenu: dispositif.typeContenu,
    sponsorUrl,
  };
};

const filterByAge =
  (age: GetContentsForAppRequest["age"] | null) =>
  (dispositifs: Dispositif[]): Dispositif[] => {
    let bottomValue: number | null = null,
      topValue: number | null = null;
    switch (age) {
      case "0 à 17 ans":
        bottomValue = 0;
        topValue = 17;
        break;

      case "18 à 25 ans":
        bottomValue = 18;
        topValue = 25;
        break;

      case "26 ans et plus":
        bottomValue = 26;
        topValue = Number.MAX_SAFE_INTEGER;
        break;
      default:
        // Pas de filtrage par âge => c'est ok
        return dispositifs;
    }

    return dispositifs.filter((dispositif) => {
      if (!dispositif.metadatas.age) return false;
      // Initialisation d'une intersection d'intervale invalide
      // car la borne supérieure est inférieure à la borne inférieure
      let intersection = { bottom: 0, top: -1 };
      switch (dispositif.metadatas.age.type) {
        case "between":
          intersection = {
            bottom: Math.max(bottomValue, dispositif.metadatas.age.ages[0]),
            top: Math.min(topValue, dispositif.metadatas.age.ages[1]),
          };
          break;
        case "lessThan":
          intersection = {
            // 0 comme borne inférieure
            bottom: Math.max(bottomValue, 0),
            top: Math.min(topValue, dispositif.metadatas.age.ages[0]),
          };
          break;
        case "moreThan":
          intersection = {
            bottom: Math.max(bottomValue, dispositif.metadatas.age.ages[0]),
            // Infini comme borne supérieure
            top: Math.min(topValue, Number.MAX_SAFE_INTEGER),
          };
          break;
      }

      /**
       * Si l'intersection est valide le dispositif est gardé par le filtrage
       *
       * Un intervalle d'intersection est valide lorsque sa borne inférieure
       * est bien inférieure à sa borne supérieure.
       */
      return intersection.bottom - intersection.top <= 0;
    });
  };

export const getContentsForApp = async (req: GetContentsForAppRequest): Promise<GetContentsForAppResponse> => {
  const { locale, age, county, frenchLevel, strictLocation } = req;

  logger.info("[getContentsForApp] called", {
    locale,
    age,
    county,
    frenchLevel,
    strictLocation,
  });

  const query: any[] = [
    {
      status: DispositifStatus.ACTIVE,
    },
  ];

  /**
   * frenchLevel
   */
  if (frenchLevel === "Je parle un peu") {
    query.push(
      { "metadatas.frenchLevel": { $ne: "C1" } },
      { "metadatas.frenchLevel": { $ne: "C2" } },
      { "metadatas.frenchLevel": { $ne: "B1" } },
      { "metadatas.frenchLevel": { $ne: "B2" } },
    );
  }
  if (frenchLevel === "Je parle bien") {
    query.push({ "metadatas.frenchLevel": { $ne: "C1" } }, { "metadatas.frenchLevel": { $ne: "C2" } });
  }

  /**
   * Location
   */
  if (county) {
    const locationFilter = [];
    if (strictLocation) {
      locationFilter.push({ "metadatas.location": { $regex: ` - ${county}$` } });
    } else {
      locationFilter.push({ "metadatas.location": { $eq: "All" } });
      // TODO locationFilter.push({ "metadatas.location": { $eq: "france" } });
      // TODO locationFilter.push({ "metadatas.location": { $eq: "online" } });
    }
    query.push({
      $or: locationFilter,
    });
  }

  const dispositifs: Dispositif[] = await getActiveContentsFiltered(
    {
      translations: 1,
      theme: 1,
      secondaryThemes: 1,
      needs: 1,
      typeContenu: 1,
      nbVues: 1,
      nbVuesMobile: 1,
      metadatas: 1,
    },
    {
      $and: query,
    },
  ).then(filterByAge(age));

  const contentsArrayFr = dispositifs.map(present("fr"));

  if (locale === "fr") {
    return {
      dataFr: contentsArrayFr,
    };
  }

  const contentsArrayLocale = dispositifs.map(present(locale));

  return {
    data: contentsArrayLocale,
    dataFr: contentsArrayFr,
  };
};
