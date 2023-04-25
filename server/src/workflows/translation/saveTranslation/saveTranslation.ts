import { SaveTranslationRequest } from "@refugies-info/api-types";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { IndicatorModel, ObjectId, Traductions, TraductionsModel, User } from "../../../typegoose";
import { TraductionsType } from "../../../typegoose/Traductions";

const saveTranslation = (
  { timeSpent, language, dispositifId, translated, toFinish }: SaveTranslationRequest,
  user: User,
): Promise<Traductions> =>
  getDispositifById(dispositifId).then(async (dispositif) => {
    if (dispositif.isTranslatedIn(language)) {
      throw new Error(`Dispositif is already translated in ${language}`);
    }

    const _traduction = new Traductions();
    _traduction.dispositifId = new ObjectId(dispositifId);
    _traduction.language = language;
    // @ts-ignore
    _traduction.translated = translated;
    _traduction.toFinish = toFinish;
    _traduction.type = user.isExpert() ? TraductionsType.VALIDATION : TraductionsType.SUGGESTION;
    _traduction.userId = user._id;

    _traduction.avancement = Traductions.computeAvancement(dispositif, _traduction);

    const wordsCount = _traduction.countWords();

    // We save a new indicator document to know the number of words translated and the time spent, this is needed for stats in the front
    await IndicatorModel.create({
      userId: user._id,
      dispositifId,
      language,
      timeSpent,
      wordsCount,
    });

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
