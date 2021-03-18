import { RequestFromClient, Res } from "../../../types/interface";
import logger = require("../../../logger");

interface Query {
  locale: string;
}
export const getUserFavoritesInLocale = (
  req: RequestFromClient<Query>,
  res: Res
) => {
  try {
    logger.info("[getUserFavoritesInLocale] received");
    const user = req.user;
    const locale = req.body.locale;
    console.log("body", locale);

    // const userFavorites =

    res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[getUserFavoritesInLocale] error", { error: error.message });
    res.status(500).json({ text: "Erreur interne" });
  }
};
