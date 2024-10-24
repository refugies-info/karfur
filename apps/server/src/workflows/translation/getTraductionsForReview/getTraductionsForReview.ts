import { GetTraductionsForReview, Languages } from "@refugies-info/api-types";
import { getTraductionsByLanguageAndDispositif } from "~/modules/traductions/traductions.repository";
import { DispositifId, User } from "~/typegoose";
import { Traductions, TraductionsType } from "~/typegoose/Traductions";

const getTraductionsForReview = async (
  dispositif: DispositifId,
  language: Languages,
  currentUser: User,
): Promise<GetTraductionsForReview[]> => {
  const translations = await getTraductionsByLanguageAndDispositif(language, dispositif);

  // S'il y a des trads à revoir et que l'expert n'a pas de validation attitré,
  // on copie l'objet disponible et on y assigne le user courant.
  // on garde également le nom de l'expert initial dans `validator`
  if (
    currentUser.isExpert() &&
    translations.find((t: Traductions) => t.toReview.length > 0) &&
    !translations.find((t: Traductions) => t.userId._id.toString() === currentUser.id)
  ) {
    const trad = translations.find((t: Traductions) => t.toReview.length > 0);
    return [
      {
        translated: trad.translated,
        validator: {
          id: trad.getUser().id,
          username: trad.getUser().username || trad.getUser().email,
          picture: trad.getUser().picture,
        },
        author: {
          id: currentUser.id,
          username: currentUser.username || currentUser.email,
          picture: currentUser.picture,
        },
        toReview: trad.toReview,
        toFinish: trad.toFinish || [],
      },
    ];
  }

  // Sinon, on retourne toutes les suggestions + la validation de l'expert courant si applicable
  return (
    translations
      // Non-experts users can only acces non-expert translations. Experts can only access his own validation
      .filter(
        (translation) =>
          (currentUser.isExpert() && translation.userId._id.toString() === currentUser.id) ||
          translation.type === TraductionsType.SUGGESTION,
      )
      // Permet d'avoir la traduction de l'utilisateur courant en première dans l'ordre d'affichage
      .sort((translation) => (translation.userId._id.toString() === currentUser.id ? -1 : 0))
      // transforme en GetTraductionsForReview
      .map((trad) => ({
        translated: trad.translated,
        author: {
          id: trad.getUser().id,
          username: trad.getUser().username || trad.getUser().email,
          picture: trad.getUser().picture,
        },
        toReview: trad.toReview,
        toFinish: trad.toFinish || [],
      }))
  );
};

export default getTraductionsForReview;
