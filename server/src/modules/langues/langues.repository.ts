import { Langue } from "../../schema/schemaLangue";

export const getActiveLanguagesFromDB = async () =>
  await Langue.find(
    { avancement: { $gt: 0 } },
    {
      langueFr: 1,
      langueLoc: 1,
      langueCode: 1,
      i18nCode: 1,
      avancement: 1,
      avancementTrad: 1,
    }
  ).sort({
    avancement: -1,
  });
