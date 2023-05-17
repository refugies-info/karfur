import { PublishTranslationRequest } from "@refugies-info/api-types";
import { getValidation } from "../../../modules/traductions/traductions.repository";
import { getDispositifById } from "../../../modules/dispositif/dispositif.repository";
import { User } from "../../../typegoose";
import { UnauthorizedError } from "../../../errors";
import validateTranslation from "../validateTranslation";

const publishTranslation = (
  { language, dispositifId }: PublishTranslationRequest,
  user: User,
): Promise<void> =>
  getDispositifById(dispositifId).then(async (dispositif) => {
    const userIsExpert = user.isExpert() || user.isAdmin();
    if (dispositif.isTranslatedIn(language) && !userIsExpert) {
      throw new Error(`Dispositif is already translated in ${language}`);
    }
    const traduction = await getValidation(language, dispositifId, user._id);

    /**
     * Si l'avancement est < à 100% ou pas faite par un expert => erreur
     */
    if (traduction.avancement < 1 || !user.isExpert()) {
      throw new UnauthorizedError("You cannot publish this dispositif");
    }

    /**
     * Sinon, il faut publier la traduction de la fiche
     * puis supprimer l'ensemble des traductions.
     */
    await validateTranslation(dispositif, language, traduction);
  });

export default publishTranslation;
