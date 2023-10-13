import { ContentType, SaveTranslationRequest } from "@refugies-info/api-types";
import { isUndefined } from "lodash";
import { updateIndicator } from "../../../modules/indicators/indicators.service";
import { addNewParticipant, getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { ObjectId, Traductions, TraductionsModel, User } from "../../../typegoose";
import { TraductionsType } from "../../../typegoose/Traductions";

const saveTranslation = (
  { timeSpent, language, dispositifId, translated, toFinish, toReview }: SaveTranslationRequest,
  user: User,
): Promise<Traductions> =>
  getDispositifById(dispositifId).then(async (dispositif) => {
    const userIsExpert = user.isExpert() || user.isAdmin();
    if (dispositif.isTranslatedIn(language) && !userIsExpert) {
      throw new Error(`Dispositif is already translated in ${language}`);
    }

    const _traduction = new Traductions();
    _traduction.dispositifId = new ObjectId(dispositifId);
    _traduction.language = language;
    // @ts-ignore
    _traduction.translated = translated;
    _traduction.toFinish = toFinish;
    _traduction.toReview = user.isExpert() ? toReview : [];
    _traduction.type = user.isExpert() ? TraductionsType.VALIDATION : TraductionsType.SUGGESTION;
    _traduction.userId = user._id;

    // ensure titreMarque is saved empty for demarches, to calculate progress properly
    if (dispositif.typeContenu === ContentType.DEMARCHE && isUndefined(_traduction.translated.content.titreMarque)) {
      _traduction.translated.content.titreMarque = "";
    }

    _traduction.avancement = Traductions.computeAvancement(dispositif, _traduction);

    const wordsCount = _traduction.countWords();

    await updateIndicator(
      user._id,
      dispositifId,
      language,
      timeSpent,
      wordsCount
    );

    await addNewParticipant(dispositifId, user._id);

    return TraductionsModel.findOneAndUpdate(
      { dispositifId, userId: user._id, language },
      { ..._traduction, $inc: { timeSpent } },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        returnDocument: "after",
        returnNewDocument: true,
      },
    ).then((trad) => trad.toObject());
  });

export default saveTranslation;
