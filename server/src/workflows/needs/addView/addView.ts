import logger from "../../../logger";
import { celebrate, Joi, Segments } from "celebrate";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { getNeedFromDB, saveNeedInDB } from "../../../modules/needs/needs.repository";
import { NeedId } from "src/typegoose";

const validator = celebrate({
  [Segments.BODY]: Joi.object({
    id: Joi.string()
  })
});

export interface Request {
  id: NeedId;
}

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[addView] received", req.body.id);

    const need = await getNeedFromDB(req.body.id);
    if (!need) throw new Error("INVALID_REQUEST");

    await saveNeedInDB(need._id, { nbVues: (need.nbVues || 0) + 1 });

    return res.status(200).json({
      text: "Succès"
    });
  } catch (error) {
    logger.error("[addView] error", { error: error.message });
    switch (error.message) {
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
