import { filter } from "lodash/fp";
import { getTraductionsByLanguageAndDispositif } from "../../../modules/traductions/traductions.repository";
import { DispositifId, Languages, User } from "../../../typegoose";

const getTraductionsForReview = (dispositif: DispositifId, language: Languages, currentUser: User) =>
  getTraductionsByLanguageAndDispositif(language, dispositif).then(
    // Non-experts users can only acces to their own translations
    filter((translation) => currentUser.isExpert() || translation.userId._id.toString() === currentUser.id),
  );

export default getTraductionsForReview;
