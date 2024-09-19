import { Languages } from "@refugies-info/api-types";
import { Dispositif, DispositifModel, TraductionsModel } from "~/typegoose";
import { DeleteResult } from "~/types/interface";

const deleteTranslations = (dispositifId: string, locale: Languages): Promise<[Dispositif, DeleteResult]> =>
  Promise.all([
    DispositifModel.findByIdAndUpdate(dispositifId, { $unset: { [`translations.${locale}`]: "" } }),
    TraductionsModel.deleteMany({ dispositifId, language: locale }),
  ]);

export default deleteTranslations;
