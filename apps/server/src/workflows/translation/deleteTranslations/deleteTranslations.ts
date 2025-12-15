import type { Languages } from "@refugies-info/api-types";
import { type Dispositif, DispositifModel, TraductionsModel } from "~/typegoose";
import type { DeleteResult } from "~/types/interface";

const deleteTranslations = (
  dispositifId: string,
  locale: Languages,
): Promise<[Dispositif, DeleteResult]> =>
  Promise.all([
    DispositifModel.findByIdAndUpdate(dispositifId, { $unset: { [`translations.${locale}`]: "" } }),
    TraductionsModel.deleteMany({ dispositifId, language: locale }),
  ]);

export default deleteTranslations;
