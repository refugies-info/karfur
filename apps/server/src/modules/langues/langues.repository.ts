import type { Id } from "@refugies-info/api-types";
import { LangueModel } from "@refugies-info/mongo";
import type { Types } from "mongoose";

export const getActiveLanguagesFromDB = () =>
  LangueModel.find(
    { avancement: { $gt: 0 } },
    {
      langueFr: 1,
      langueLoc: 1,
      langueCode: 1,
      i18nCode: 1,
      avancement: 1,
      avancementTrad: 1,
    },
  )
    .sort({ avancement: -1 })
    .cacheQuery();

export const updateLanguageAvancementInDB = (langueId: Types.ObjectId, avancementTrad: number) =>
  LangueModel.findByIdAndUpdate({ _id: langueId }, { avancementTrad });

export const getLanguageByCode = (locale: string) => LangueModel.findOne({ i18nCode: locale });

export const getLangueName = async (id: Id) =>
  LangueModel.findById(id, { langueFr: 1 }).then((res) => res?.langueFr);
