import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { sendAdminImprovementsMailService } from "../../../modules/mail/mail.service";
import { asyncForEach } from "../../../libs/asyncForEach";
import { log } from "./log";
import { ImprovementsRequest } from "@refugies-info/api-types";

export const sendAdminImprovementsMail = async (body: ImprovementsRequest, userId: string): Response => {
  logger.info("[sendAdminImprovementsMail] received with data", { data: body });
  // TODO: rewrite with new structure
  const formattedSections = {
    quoi: body.sections.includes("C'est quoi ?"),
    qui: body.sections.includes("C'est pour qui ?"),
    interessant: body.sections.includes("Pourquoi c'est intéressant ?"),
    engagement: body.sections.includes("Comment je m'engage ?"),
    carte: body.sections.includes("Carte interactive"),
  };

  await asyncForEach(body.users, async (user) => {
    await sendAdminImprovementsMailService({
      //@ts-ignore
      dispositifId: body.dispositifId /* TODO: fix id types */,
      //@ts-ignore
      userId: user._id,
      titreInformatif: body.titreInformatif,
      titreMarque: body.titreMarque,
      lien: "https://refugies.info/dispositif/" + body.dispositifId,
      email: user.email,
      pseudo: user.username,
      sectionsToModify: formattedSections,
      message: body.message,
    });
  });

  const options = {
    message: body.message,
    sections: body.sections,
    users: body.users,
  };

  //@ts-ignore
  await log(body.dispositifId, userId, options);

  return { text: "success" };
};
