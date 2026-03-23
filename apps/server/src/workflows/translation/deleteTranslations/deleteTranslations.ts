import type { Languages } from "@refugies-info/api-types";
import { type Dispositif, DispositifModel, TraductionsModel } from "@refugies-info/mongo";
import { countDispositifWords } from "~/libs/wordCounter";
import logger from "~/logger";
import { incrementWordsTranslatedCounter } from "~/modules/adminOptions/adminOptions.repository";
import type { DeleteResult } from "~/types/interface";

const deleteTranslations = async (
  dispositifId: string,
  locale: Languages,
): Promise<[Dispositif, DeleteResult]> => {
  // Fetch word count of the translation being removed before deleting it
  const existing = await DispositifModel.findById(dispositifId, {
    [`translations.${locale}`]: 1,
  }).lean();
  const existingContent = (existing?.translations as any)?.[locale]?.content;
  const wordsDelta = existingContent ? -countDispositifWords(existingContent) : 0;

  const result = await Promise.all([
    DispositifModel.findByIdAndUpdate(dispositifId, { $unset: { [`translations.${locale}`]: "" } }),
    TraductionsModel.deleteMany({ dispositifId, language: locale }),
  ]);

  if (wordsDelta !== 0) {
    try {
      await incrementWordsTranslatedCounter(wordsDelta);
    } catch (error) {
      logger.error("[deleteTranslations] error while updating words counter", {
        error: (error as Error).message,
      });
    }
  }

  return result;
};

export default deleteTranslations;
