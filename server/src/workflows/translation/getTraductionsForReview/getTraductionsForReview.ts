import { getTraductionsByLanguageAndDispositif } from "src/modules/traductions/traductions.repository";
import { DispositifId, LangueId } from "src/typegoose";

const getTraductionsForReview = (dispositif: DispositifId, language: LangueId) =>
  getTraductionsByLanguageAndDispositif(language, dispositif);

export default getTraductionsForReview;
