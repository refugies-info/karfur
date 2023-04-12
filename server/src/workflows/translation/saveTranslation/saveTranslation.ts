import { SaveTranslationRequest } from "@refugies-info/api-types";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { IndicatorModel, ObjectId, Traductions, TraductionsModel, User } from "../../../typegoose";
import { TraductionsType } from "../../../typegoose/Traductions";
import validateTranslation from "../validateTranslation";

const saveTranslation = (
  { timeSpent, language, dispositifId, translated }: SaveTranslationRequest,
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

    /**
     * Si l'avancement est à 100% + faite par un expert => traduction prête
     *
     * Alors il faut publier la traduction de la fiche
     * puis supprimer l'ensemble des traductions.
     */
    return _traduction.avancement >= 1 && user.isExpert()
      ? validateTranslation(dispositif, language, _traduction).then(() => _traduction)
      : TraductionsModel.findOneAndUpdate(
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
