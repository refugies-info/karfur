import type { PublishTranslationRequest } from "@refugies-info/api-types";
import { ObjectId, type User } from "@refugies-info/mongo";
import { UnauthorizedError } from "~/errors";
import { isDispositifTranslatedIn } from "~/modules/dispositif/dispositif.business";
import { addNewParticipant, getDispositifById } from "~/modules/dispositif/dispositif.repository";
import { getValidation } from "~/modules/traductions/traductions.repository";
import validateTranslation from "../validateTranslation";

/**
 * Extrait toutes les clés de section du contenu FR (titreInformatif, what, accordéons how/why/next).
 * Utilisé pour détecter les entrées "fantômes" dans toReview — sections supprimées du FR
 * mais encore présentes dans le document de traduction (migration Typegoose → Zod).
 */
const getFrContentKeys = (dispositif: Awaited<ReturnType<typeof getDispositifById>>): string[] => {
  const fr = dispositif?.translations?.fr?.content as Record<string, unknown> | undefined;
  if (!fr) return [];

  const keys: string[] = [
    "content.titreInformatif",
    "content.titreMarque",
    "content.abstract",
    "content.what",
    "content.administrationName",
  ];

  for (const section of ["why", "how", "next"]) {
    const sections = fr[section] as Record<string, { title?: string; text?: string }> | undefined;
    if (!sections) continue;
    for (const [key, value] of Object.entries(sections)) {
      if (value?.title || value?.text) {
        keys.push(`content.${section}.${key}.title`);
        keys.push(`content.${section}.${key}.text`);
      }
    }
  }
  return keys;
};

const publishTranslation = (
  { language, dispositifId }: PublishTranslationRequest,
  user: User,
): Promise<void> =>
  getDispositifById(new ObjectId(dispositifId), { translations: 1, typeContenu: 1 }).then(
    async (dispositif) => {
      const userIsExpert = user.isExpert() || user.isAdmin();
      if (isDispositifTranslatedIn(dispositif, language) && !userIsExpert) {
        throw new Error(`Dispositif is already translated in ${language}`);
      }

      const traduction = await getValidation(
        language,
        new ObjectId(dispositifId),
        user._id as ObjectId,
      );

      /**
       * Si la traduction n'est pas terminée ou pas faite par un expert => erreur.
       *
       * Exception : si toutes les sections restantes dans toReview n'existent plus
       * dans le FR actuel (supprimées par le rédacteur après la mise en révision),
       * on considère la traduction comme terminée — l'expert ne peut pas cocher
       * des sections qui ne sont plus affichées dans l'UI.
       */
      if (!traduction || !user.isExpert()) {
        throw new UnauthorizedError("You cannot publish this dispositif");
      }

      const pendingToReview = traduction.toReview ?? [];
      const frKeys = getFrContentKeys(dispositif);
      const hasOnlyStaleToReview =
        pendingToReview.length > 0 && pendingToReview.every((key) => !frKeys.includes(key));
      const effectivelyFinished = traduction.finished || hasOnlyStaleToReview;

      if (!effectivelyFinished) {
        throw new UnauthorizedError("You cannot publish this dispositif");
      }

      /**
       * Sinon, il faut publier la traduction de la fiche
       * puis supprimer l'ensemble des traductions.
       */
      await validateTranslation(dispositif, language, traduction, user.username);
      await addNewParticipant(new ObjectId(dispositifId), user._id);
    },
  );

export default publishTranslation;
