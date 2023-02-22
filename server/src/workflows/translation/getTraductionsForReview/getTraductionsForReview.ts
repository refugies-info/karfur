import { filter, sortBy } from "lodash/fp";
import { getTraductionsByLanguageAndDispositif } from "src/modules/traductions/traductions.repository";
import { DispositifId, Languages, User } from "src/typegoose";

const getTraductionsForReview = (dispositif: DispositifId, language: Languages, currentUser: User) =>
  getTraductionsByLanguageAndDispositif(language, dispositif)
    .then(
      // Non-experts users can only acces to their own translations
      filter((translation) => currentUser.isExpert() || translation.userId._id.toString() === currentUser.id),
    )
    // Permet d'avoir la traduction de l'utilisateur courant en première dans l'ordre d'affichage
    .then(sortBy((translation) => (translation.userId._id.toString() === currentUser.id ? -1 : 0)));

export default getTraductionsForReview;
