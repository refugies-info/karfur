import logger from "../../../logger";
import { Response } from "../../../types/interface";
import { sendAdminImprovementsMailService } from "../../../modules/mail/mail.service";
import { asyncForEach } from "../../../libs/asyncForEach";
import { log } from "./log";
import { ImprovementsRequest } from "@refugies-info/api-types";
import { DispositifId, UserId } from "../../../typegoose";

export const sendAdminImprovementsMail = async (body: ImprovementsRequest, userId: string): Response => {
  logger.info("[sendAdminImprovementsMail] received with data", { data: body });
  const formattedSections = {
    quoi: body.sections.includes("C'est quoi ?"),
    qui: body.sections.includes("C'est pour qui ?"),
    interessant: body.sections.includes("Pourquoi c'est intéressant ?"),
    engagement: body.sections.includes("Comment je m'engage ?"),
    carte: body.sections.includes("Carte interactive"),
  };

  await asyncForEach(body.users, async (user) => {
    await sendAdminImprovementsMailService({
      dispositifId: body.dispositifId as DispositifId,
      userId: user._id as UserId,
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
