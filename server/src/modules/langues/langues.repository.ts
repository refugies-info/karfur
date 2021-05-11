import { Langue } from "../../schema/schemaLangue";
import { ObjectId } from "mongoose";

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

export const updateLanguageAvancementInDB = async (
  langueId: ObjectId,
  avancementTrad: number
) => await Langue.findByIdAndUpdate({ _id: langueId }, { avancementTrad });
