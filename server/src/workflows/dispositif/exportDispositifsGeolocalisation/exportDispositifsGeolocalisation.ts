import { RequestFromClient, Res } from "../../../types/interface";
import logger = require("../../../logger");

export const exportDispositifsGeolocalisation = async (
  req: RequestFromClient<{}>,
  res: Res
) => {
  try {
    logger.info("[exportDispositifsGeolocalisation] received");

    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[exportDispositifsGeolocalisation] error", {
      error: error.message,
    });
    return res.status(500).json({ text: "KO" });
  }
};
