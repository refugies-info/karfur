import type { ImprovementsRequest } from "@refugies-info/api-types";
import { asyncForEach } from "~/libs/asyncForEach";
import logger from "~/logger";
import { sendAdminImprovementsMailService } from "~/modules/mail/mail.service";
import { getUserById } from "~/modules/users/users.repository";
import type { DispositifId, UserId } from "~/typegoose";
import type { Response } from "~/types/interface";
import { log } from "./log";

export const sendAdminImprovementsMail = async (
  body: ImprovementsRequest,
  userId: string,
): Response => {
  logger.info("[sendAdminImprovementsMail] received with data", { data: body });
  const formattedSections = {
    quoi: body.sections.includes("C'est quoi ?"),
    qui: body.sections.includes("C'est pour qui ?"),
    interessant: body.sections.includes("Pourquoi c'est intéressant ?"),
    engagement: body.sections.includes("Comment je m'engage ?"),
    carte: body.sections.includes("Carte interactive"),
  };

  const users: (Awaited<ReturnType<typeof getUserById>> | null)[] = await Promise.all(
    body.userIds.map((userId) =>
      getUserById(userId, { email: 1, firstName: 1 }).catch((): null => null),
    ),
  );

  await asyncForEach(
    users.filter((u) => !!u),
    async (user) => {
      await sendAdminImprovementsMailService({
        dispositifId: body.dispositifId as DispositifId,
        userId: userId as UserId,
        titreInformatif: body.titreInformatif,
        titreMarque: body.titreMarque,
        lien: "https://refugies.info/dispositif/" + body.dispositifId,
        email: user.email,
        firstName: user.firstName,
        sectionsToModify: formattedSections,
        message: body.message,
      });
    },
  );

  const options = {
    message: body.message,
    sections: body.sections,
    userEmails: users.map((u) => u.email),
  };

  await log(body.dispositifId, userId, options);

  return { text: "success" };
};
