import { Types } from "mongoose";
import { LangueModel } from "../../typegoose";

export const getActiveLanguagesFromDB = () =>
  LangueModel.find(
    { avancement: { $gt: 0 } },
    {
      langueFr: 1,
      langueLoc: 1,
      langueCode: 1,
      i18nCode: 1,
      avancement: 1,
      avancementTrad: 1
    }
  ).sort({
    avancement: -1
  });

export const updateLanguageAvancementInDB = (langueId: Types.ObjectId, avancementTrad: number) =>
  LangueModel.findByIdAndUpdate({ _id: langueId }, { avancementTrad });

export const getLanguageByCode = (locale: string) => LangueModel.findOne({ i18nCode: locale });
