import { RequestFromClientWithBody, Res } from "../../../types/interface";
import logger from "../../../logger";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { updateUserInDB } from "../../../modules/users/users.repository";

interface Query {
  dispositifId?: string;
  type: "remove" | "remove-all";
}

export const updateUserFavorites = async (req: RequestFromClientWithBody<Query>, res: Res) => {
  try {
    checkRequestIsFromSite(req.fromSite);

    if (!req.body.type) {
      throw new Error("INVALID_REQUEST");
    }
    if (req.body.type === "remove" && !req.body.dispositifId) {
      throw new Error("INVALID_REQUEST");
    }

    const { type, dispositifId } = req.body;
    logger.info("[updateUserFavorites] received");
    const user = req.user;

    if (type === "remove-all") {
      await updateUserInDB(user._id, { cookies: { dispositifsPinned: [] } });
      return res.status(200).json({ text: "OK" });
    }

    const actualFavorites: { _id: string }[] =
      // @ts-ignore FIXME
      user.cookies && user.cookies.dispositifsPinned && user.cookies.dispositifsPinned.length > 0
        ? // @ts-ignore FIXME
          user.cookies.dispositifsPinned
        : [];
    const updatedFavorites = actualFavorites.filter((fav) => dispositifId && fav._id !== dispositifId);

    await updateUserInDB(user._id, {
      cookies: { dispositifsPinned: updatedFavorites }
    });
    return res.status(200).json({ text: "OK" });
  } catch (error) {
    logger.error("[updateUserFavorites] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};
