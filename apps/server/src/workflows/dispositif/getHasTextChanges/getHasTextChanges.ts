import { isEmpty } from "lodash";
import { NotFoundError } from "~/errors";
import logger from "~/logger";
import {
  getDispositifById,
  getDraftDispositifById,
} from "~/modules/dispositif/dispositif.repository";
import { diffTraductions } from "~/modules/traductions/traductions.business";
import type { Dispositif, Traductions } from "~/typegoose";

export const getHasTextChanges = async (id: string): Promise<boolean> => {
  logger.info("[getHasTextChanges] called");

  const originalDispositif = await getDispositifById(id, { hasDraftVersion: 1, translations: 1 });
  if (!originalDispositif) throw new NotFoundError("Dispositif not found");

  if (!originalDispositif.hasDraftVersion) return false;
  const draftDispositif = await getDraftDispositifById(id, { hasDraftVersion: 1, translations: 1 });
  const traductionDiff = diffTraductions(
    originalDispositif.translations.fr,
    draftDispositif.translations.fr,
  );

  return !isEmpty(traductionDiff.modified) || !isEmpty(traductionDiff.added);
};
