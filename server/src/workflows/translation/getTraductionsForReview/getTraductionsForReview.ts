import { Languages } from "@refugies-info/api-types";
import { filter, sortBy } from "lodash/fp";
import { TraductionsType, Traductions } from "../../../typegoose/Traductions";
import { getTraductionsByLanguageAndDispositif } from "../../../modules/traductions/traductions.repository";
import { DispositifId, User } from "../../../typegoose";

const getTraductionsForReview = (dispositif: DispositifId, language: Languages, currentUser: User) =>
  getTraductionsByLanguageAndDispositif(language, dispositif)
    .then(translations =>
      // S'il y a des trads à revoir et que l'expert n'a pas de validation attitré,
      // on copie l'objet disponible et on y assigne le user courant. (temporaire ?)
      translations.map((translation: Traductions) => {
        if (
          translation.toReview.length > 0
          && currentUser.isExpert()
          && !translations.find((t: Traductions) => t.userId._id.toString() === currentUser.id)
          && translation.userId._id.toString() !== currentUser.id
        ) {
          const _translation = new Traductions();
          _translation.translated = translation.translated;
          _translation.toReview = translation.toReview;
          _translation.toFinish = translation.toFinish;
          _translation.type = translation.type;
          //@ts-ignore populate user
          _translation.userId = currentUser;
          return _translation;
        }
        return translation;
      })
    )
    .then(
      // Non-experts users can only acces non-expert translations. Experts can only access his own validation
      filter((translation) => (currentUser.isExpert() && translation.userId._id.toString() === currentUser.id) || translation.type === TraductionsType.SUGGESTION),
    )
    // Permet d'avoir la traduction de l'utilisateur courant en première dans l'ordre d'affichage
    .then(sortBy((translation) => (translation.userId._id.toString() === currentUser.id ? -1 : 0)));

export default getTraductionsForReview;
