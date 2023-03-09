import { Languages } from "api-types";
import { DispositifModel, TraductionsModel } from "../../../typegoose";

const deleteTranslations = (dispositifId: string, locale: Languages) =>
  Promise.all([
    DispositifModel.findByIdAndUpdate(dispositifId, { $unset: { [`translations.${locale}`]: "" } }),
    TraductionsModel.deleteMany({ dispositifId, language: locale }),
  ]);

export default deleteTranslations;
