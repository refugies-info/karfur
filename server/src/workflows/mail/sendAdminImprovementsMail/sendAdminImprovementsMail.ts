import { ObjectId } from "mongoose";
import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { sendAdminImprovementsMailService } from "../../../modules/mail/mail.service";
import {
  checkIfUserIsAdmin,
  checkRequestIsFromSite,
} from "../../../libs/checkAuthorizations";
import { asyncForEach } from "../../../libs/asyncForEach";
import { log } from "./log";

interface Query {
  dispositifId: ObjectId;
  users: {
    username: string;
    _id: ObjectId;
    email: string;
  }[];
  titreInformatif: string;
  titreMarque: string;
  sections: string[];
}
export const sendAdminImprovementsMail = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[sendAdminImprovementsMail] received with data", {
      data: req.body,
    });
    // @ts-ignore
    checkIfUserIsAdmin(req.user.roles);
    checkRequestIsFromSite(req.fromSite);
    const data = req.body;

    const formattedSections = {
      quoi: data.sections.includes("C'est quoi ?"),
      qui: data.sections.includes("C'est pour qui ?"),
      interessant: data.sections.includes("Pourquoi c'est intéressant ?"),
      engagement: data.sections.includes("Comment je m'engage ?"),
      carte: data.sections.includes("Carte interactive"),
    };

    await asyncForEach(data.users, async (user) => {
      await sendAdminImprovementsMailService({
        dispositifId: data.dispositifId,
        userId: user._id,
        titreInformatif: data.titreInformatif,
        titreMarque: data.titreMarque,
        lien: "https://refugies.info/dispositif/" + data.dispositifId,
        email: user.email,
        pseudo: user.username,
        sectionsToModify: formattedSections,
      });
    });

    await log(data.dispositifId, req.user._id);

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[sendAdminImprovementsMail] error", { error: error.message });

    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "NOT_AUTHORIZED":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
