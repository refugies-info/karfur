import { celebrate, Segments } from "celebrate";
import express from "express";
import Joi from "joi";
import logger from "src/logger";
import { verifyVersion } from "src/workflows/misc";
const router = express.Router();

const validator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    appVersion: Joi.string().regex(/\d{4}.\d{2}.\d{1,}/)
  })
});

// interface Request {
//   appVersion: string;
// }

const handler = async (req /*: RequestFromClientWithBody<Request>*/, res /*: Res*/) =>
  verifyVersion(req.body.appVersion)
    .then((result) => {
      return result
        ? res.status(200).json({
            text: "Succès"
          })
        : res.status(403).json({ message: "Please upgrade your application" });
    })
    .catch((error) => {
      logger.error("[technical-info] error", {
        error: error.message
      });
      return res.status(500).json({ text: "Erreur interne" });
    });

const _verifyVersion = [validator, handler];

/**
 * Cette route est implémentée dans la nouvelle version
 * du serveur dans le fichier miscController
 */
router.post("/technical-info", _verifyVersion);

module.exports = router;
