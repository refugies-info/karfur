import type { GetTraductionsForReview, Languages } from "@refugies-info/api-types";
import type { DispositifId, User } from "@refugies-info/mongo";
import { type LeanTraductions, TraductionsType } from "@refugies-info/mongo";
import { toPicture } from "~/libs/pictureUtils";
import logger from "~/logger";
import { getTraductionUser } from "~/modules/traductions/traductions.business";
import { getTraductionsByLanguageAndDispositif } from "~/modules/traductions/traductions.repository";

const getPopulatedTranslations = (translations: LeanTraductions[]) =>
  translations
    .map((translation) => {
      try {
        const user = getTraductionUser(translation);
        const userId = user._id?.toString() || user.id;

        if (!userId) {
          logger.warn("[getTraductionsForReview] skipping translation with empty user id", {
            translationId: translation._id?.toString(),
          });
          return null;
        }

        return { translation, user, userId };
      } catch (error) {
        logger.warn("[getTraductionsForReview] skipping translation with unpopulated user", {
          translationId: translation._id?.toString(),
          error,
        });
        return null;
      }
    })
    .filter(
      (translation): translation is { translation: LeanTraductions; user: User; userId: string } =>
        !!translation,
    );

const getTraductionsForReview = async (
  dispositif: DispositifId,
  language: Languages,
  currentUser: User,
): Promise<GetTraductionsForReview[]> => {
  const translations = await getTraductionsByLanguageAndDispositif(language, dispositif);
  const populatedTranslations = getPopulatedTranslations(translations);

  // S'il y a des trads à revoir et que l'expert n'a pas de validation attitré,
  // on copie l'objet disponible et on y assigne le user courant.
  // on garde également le nom de l'expert initial dans `validator`
  const tradToReview = populatedTranslations.find(
    ({ translation }) => (translation.toReview || []).length > 0,
  );

  if (
    currentUser.isExpert() &&
    tradToReview &&
    !populatedTranslations.find(({ userId }) => userId === currentUser.id)
  ) {
    return [
      {
        translated: tradToReview.translation.translated,
        validator: {
          id: tradToReview.userId,
          username: tradToReview.user.username || tradToReview.user.email,
          picture: toPicture(tradToReview.user.picture),
        },
        author: {
          id: currentUser.id,
          username: currentUser.username || currentUser.email,
          picture: toPicture(currentUser.picture),
        },
        toReview: tradToReview.translation.toReview,
        toFinish: tradToReview.translation.toFinish || [],
      },
    ];
  }

  // Sinon, on retourne toutes les suggestions + la validation de l'expert courant si applicable
  return populatedTranslations
    .filter(
      ({ translation, userId }) =>
        (currentUser.isExpert() && userId === currentUser.id) ||
        translation.type === TraductionsType.SUGGESTION,
    )
    .sort(({ userId }) => (userId === currentUser.id ? -1 : 0))
    .map(({ translation, user, userId }) => ({
      translated: translation.translated,
      author: {
        id: userId,
        username: user.username || user.email,
        picture: toPicture(user.picture),
      },
      toReview: translation.toReview,
      toFinish: translation.toFinish || [],
    }));
};

export default getTraductionsForReview;
