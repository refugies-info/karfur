import logger from "../../../logger";
import { RequestFromClientWithBody, Res } from "../../../types/interface";
import { createTheme } from "../../../modules/themes/themes.repository";
import { checkRequestIsFromSite } from "../../../libs/checkAuthorizations";
import { checkIfUserIsAdmin } from "../../../libs/checkAuthorizations";
import { Theme, ThemeDoc } from "../../../schema/schemaTheme";
import { Request, getValidator, isThemeActive } from "../../../modules/themes/themes.service";
import { getActiveLanguagesFromDB } from "../../../modules/langues/langues.repository";
import { getAllAppUsers, updateNotificationsSettings } from "src/modules/appusers/appusers.repository";
import { map } from "lodash/fp";
import { AppUserType } from "src/schema/schemaAppUser";

export const hasOneNotificationEnabled = (user: AppUserType) =>
  user.notificationsSettings.demarches ||
  user.notificationsSettings.global ||
  user.notificationsSettings.local ||
  Object.values(user.notificationsSettings.themes).reduce((acc, cur) => acc || cur, false);

export const addThemeInNotificationSettingsForUser = (theme: ThemeDoc) => (user: AppUserType) =>
  updateNotificationsSettings(user.uid, {
    ...user.notificationsSettings,
    themes: { ...user.notificationsSettings.themes, [`${theme._id}`]: hasOneNotificationEnabled(user) }
  });

const updateUsersNotificationsSettings = async (theme: ThemeDoc) =>
  getAllAppUsers().then(map(addThemeInNotificationSettingsForUser(theme)));

const validator = getValidator("post");

const handler = async (req: RequestFromClientWithBody<Request>, res: Res) => {
  try {
    logger.info("[postThemes] received", req.body);
    checkRequestIsFromSite(req.fromSite);
    //@ts-ignore
    checkIfUserIsAdmin(req.user.roles);

    const theme = new Theme({
      name: req.body.name,
      short: req.body.short,
      colors: req.body.colors,
      position: req.body.position,
      icon: req.body.icon,
      banner: req.body.banner,
      appBanner: req.body.appBanner,
      appImage: req.body.appImage,
      shareImage: req.body.shareImage,
      notificationEmoji: req.body.notificationEmoji
    });

    const dbTheme = await createTheme(theme);
    const activeLanguages = await getActiveLanguagesFromDB();

    await updateUsersNotificationsSettings(dbTheme);

    return res.status(200).json({
      text: "Succès",
      data: { ...dbTheme.toObject(), active: isThemeActive(dbTheme, activeLanguages) }
    });
  } catch (error) {
    logger.error("[postThemes] error", { error: error.message });
    switch (error.message) {
      case "NOT_FROM_SITE":
        return res.status(405).json({ text: "Requête bloquée par API" });
      case "INVALID_REQUEST":
        return res.status(400).json({ text: "Requête invalide" });
      case "NOT_AUTHORIZED":
        return res.status(403).json({ text: "Création interdite" });
      default:
        return res.status(500).json({ text: "Erreur interne" });
    }
  }
};

export default [validator, handler];
