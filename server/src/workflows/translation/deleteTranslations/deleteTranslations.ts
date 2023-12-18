import { Languages } from "@refugies-info/api-types";
import { DeleteResult } from "../../../types/interface";
import { Dispositif, DispositifModel, TraductionsModel } from "../../../typegoose";

const deleteTranslations = (dispositifId: string, locale: Languages): Promise<[Dispositif, DeleteResult]> =>
  Promise.all([
    DispositifModel.findByIdAndUpdate(dispositifId, { $unset: { [`translations.${locale}`]: "" } }),
    TraductionsModel.deleteMany({ dispositifId, language: locale }),
    // TODO: maj airtable?
  ]);

export default deleteTranslations;
