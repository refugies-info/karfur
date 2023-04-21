import { Languages } from "@refugies-info/api-types";
import { filter, sortBy } from "lodash/fp";
import { TraductionsType } from "../../../typegoose/Traductions";
import { getTraductionsByLanguageAndDispositif } from "../../../modules/traductions/traductions.repository";
import { DispositifId, User } from "../../../typegoose";

const getTraductionsForReview = (dispositif: DispositifId, language: Languages, currentUser: User) =>
  getTraductionsByLanguageAndDispositif(language, dispositif)
    .then(
      // Non-experts users can only acces non-expert translations. Experts can only access his own validation
      filter((translation) => (currentUser.isExpert() && translation.userId._id.toString() === currentUser.id) || translation.type === TraductionsType.SUGGESTION),
    )
    // Permet d'avoir la traduction de l'utilisateur courant en première dans l'ordre d'affichage
    .then(sortBy((translation) => (translation.userId._id.toString() === currentUser.id ? -1 : 0)));

export default getTraductionsForReview;
