import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { ObjectId, IndicatorModel, Languages, RichText, Traductions, TraductionsModel, User } from "../../../typegoose";
import { Content, InfoSection, InfoSections } from "../../../typegoose/Dispositif";

export interface SaveTranslationRequest {
  dispositifId: string;
  language: Languages;
  timeSpent: number;
  translated: Partial<{
    content: Partial<Content> & {
      what?: RichText;
      why?: { [key: string]: Partial<InfoSection> };
      how?: { [key: string]: Partial<InfoSection> };
      next?: InfoSections;
    };
    metadatas: Partial<{
      important?: string;
      duration?: string;
    }>;
  }>;
}

const saveTranslation = (
  { timeSpent, language, dispositifId, translated }: SaveTranslationRequest,
  user: User,
): Promise<Traductions> =>
  getDispositifById(dispositifId).then(async (dispositif) => {
    const _traduction = new Traductions();
    _traduction.dispositifId = new ObjectId(dispositifId);
    _traduction.language = language;
    // @ts-ignore
    _traduction.translated = translated;
    _traduction.type = user.isExpert() ? "validation" : "suggestion";
    _traduction.userId = user._id;

    _traduction.avancement = Traductions.computeAvancement(dispositif, _traduction);
    if (user.isExpert()) _traduction.validatorId = user._id;

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
