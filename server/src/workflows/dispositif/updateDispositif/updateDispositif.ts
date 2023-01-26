import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { updateDispositifInDB } from "../../../modules/dispositif/dispositif.repository";
import { checkIfUserIsAdmin, checkRequestIsFromSite } from "../../../libs/checkAuthorizations";

/* TODO: support all dispositif properties */
const validator = celebrate({
  [Segments.BODY]: Joi.object({
    webOnly: Joi.boolean(),
  }),
  [Segments.PARAMS]: Joi.object({
    id: Joi.string(),
  })
});

interface Query {
  webOnly: boolean;
}
const handler = async (
  req: RequestFromClientWithBody<Query>,
  res: Res
) => {
  try {
    logger.info("[updateDispositif] received", req.params.id);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    const editedDispositif = {
      webOnly: req.body.webOnly,
      lastAdminUpdate: Date.now(),
    };

    await updateDispositifInDB(req.params.id, editedDispositif);

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateDispositif] error", {
      error: error.message,
    });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
