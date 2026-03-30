import type { GetTraductionsForReview, Languages } from "@refugies-info/api-types";
import type { DispositifId, User } from "@refugies-info/mongo";
import { type LeanTraductions, type Traductions, TraductionsType } from "@refugies-info/mongo";
import { toPicture } from "~/libs/pictureUtils";
import { getTraductionUser } from "~/modules/traductions/traductions.business";
import { getTraductionsByLanguageAndDispositif } from "~/modules/traductions/traductions.repository";

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
    translations.find((t: LeanTraductions) => t.toReview.length > 0) &&
    !translations.find(
      (t: LeanTraductions) => getTraductionUser(t)._id.toString() === currentUser.id,
    )
  ) {
    const trad = translations.find((t: LeanTraductions) => t.toReview.length > 0);
    return [
      {
        translated: trad.translated,
        validator: {
          id: getTraductionUser(trad).id,
          username: getTraductionUser(trad).username || getTraductionUser(trad).email,
          picture: toPicture(getTraductionUser(trad).picture),
        },
        author: {
          id: currentUser.id,
          username: currentUser.username || currentUser.email,
          picture: toPicture(currentUser.picture),
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
          (currentUser.isExpert() &&
            getTraductionUser(translation)._id.toString() === currentUser.id) ||
          translation.type === TraductionsType.SUGGESTION,
      )
      // Permet d'avoir la traduction de l'utilisateur courant en première dans l'ordre d'affichage
      .sort((translation: LeanTraductions) =>
        getTraductionUser(translation)._id.toString() === currentUser.id ? -1 : 0,
      )
      // transforme en GetTraductionsForReview
      .map((trad: LeanTraductions) => ({
        translated: trad.translated,
        author: {
          id: getTraductionUser(trad).id,
          username: getTraductionUser(trad).username || getTraductionUser(trad).email,
          picture: toPicture(getTraductionUser(trad).picture),
        },
        toReview: trad.toReview,
        toFinish: trad.toFinish || [],
      }))
  );
};

export default getTraductionsForReview;
