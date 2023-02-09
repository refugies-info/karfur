import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getUserById, updateUserInDB } from "../../../modules/users/users.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { removeMemberFromStructure } from "../../../modules/structure/structure.repository";
import { generateRandomId } from "../../../libs/generateRandomId";
import { sendAccountDeletedMailService } from "../../../modules/mail/mail.service";
import { UserStatus } from "src/typegoose/User";
import { Request } from "express";

const validator = celebrate({
  [Segments.PARAMS]: Joi.object({
    id: Joi.string(),
  }),
});

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[deleteUser] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    checkIfUserIsAdmin(req.user);

    const user = await getUserById(req.params.id, { email: 1, structures: 1 });
    const email = user?.email;
    if (!user) throw new Error("INVALID_REQUEST");

    if (user.structures)
      await Promise.all(user.structures?.map((structure) => removeMemberFromStructure(structure._id, req.params.id)));

    await updateUserInDB(req.params.id, {
      username: `utilisateur_${generateRandomId()}`,
      password: "",
      email: "",
      phone: "",
      picture: null,
      roles: [],
      authy_id: "",
      cookies: null,
      reset_password_token: "",
      structures: [],
      status: UserStatus.USER_STATUS_DELETED,
    });

    if (email) {
      await sendAccountDeletedMailService(email);
    }

    return res.status(200).json({
      text: "Succès",
    });
  } catch (error) {
    logger.error("[deleteUser] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Suppression interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
