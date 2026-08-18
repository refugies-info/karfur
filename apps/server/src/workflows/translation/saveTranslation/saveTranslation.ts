import { ContentType, type SaveTranslationRequest } from "@refugies-info/api-types";
import {
  ObjectId,
  type Traductions,
  TraductionsModel,
  TraductionsType,
  type User,
} from "@refugies-info/mongo";
import { isUndefined } from "lodash";
import { ConflictError } from "~/errors";
import { isDispositifTranslatedIn } from "~/modules/dispositif/dispositif.business";
import { addNewParticipant, getDispositifById } from "~/modules/dispositif/dispositif.repository";
import { updateIndicator } from "~/modules/indicators/indicators.service";
import {
  computeTraductionFinished,
  getTraductionWordsCount,
} from "~/modules/traductions/traductions.business";
import { getOtherValidationForDispositif } from "~/modules/traductions/traductions.repository";

const saveTranslation = (
  { timeSpent, language, dispositifId, translated, toFinish, toReview }: SaveTranslationRequest,
  user: User,
): Promise<Traductions> =>
  getDispositifById(new ObjectId(dispositifId)).then(async (dispositif) => {
    const userIsExpert = user.isExpert() || user.isAdmin();
    if (isDispositifTranslatedIn(dispositif, language) && !userIsExpert) {
      throw new ConflictError(`Dispositif is already translated in ${language}`);
    }

    const _traduction: Partial<Traductions> = {
      dispositifId: new ObjectId(dispositifId),
      language,
      translated: translated as any,
      toFinish,
      toReview: user.isExpert() ? toReview : [],
      type: user.isExpert() ? TraductionsType.VALIDATION : TraductionsType.SUGGESTION,
      userId: user._id,
    };

    // ensure titreMarque is saved empty for demarches, to calculate progress properly
    if (
      dispositif.typeContenu === ContentType.DEMARCHE &&
      isUndefined((_traduction.translated as any)?.content?.titreMarque)
    ) {
      if (!_traduction.translated) _traduction.translated = { content: {} };
      if (!_traduction.translated.content) _traduction.translated.content = {};
      (_traduction.translated as any).content.titreMarque = "";
    }

    // copy toReviewCache from other traductions if it exists
    if (user.isExpert()) {
      const otherValidation = await getOtherValidationForDispositif(
        language,
        new ObjectId(dispositifId),
        user._id,
      );
      if (otherValidation?.toReviewCache) {
        _traduction.toReviewCache = otherValidation.toReviewCache;
      }
    }

    _traduction.finished = computeTraductionFinished(dispositif, _traduction as Traductions);

    const wordsCount = getTraductionWordsCount(_traduction as Traductions);

    await updateIndicator(user._id, dispositifId, language, timeSpent, wordsCount);

    await addNewParticipant(new ObjectId(dispositifId), user._id);

    return TraductionsModel.findOneAndUpdate(
      { dispositifId: new ObjectId(dispositifId), userId: user._id, language },
      { ..._traduction, $inc: { timeSpent } },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        returnDocument: "after",
        returnNewDocument: true,
      },
    );
  });

export default saveTranslation;
