import { Router } from "express";

import updateAppUserHandler from "./updateAppUserHandler";
import getNotificationsSettingsHandler from "./getNotificationsSettingsHandler";
import updateNotificationsSettingsHandler from "./updateNotificationsSettingsHandler";

const router = Router();

router.post("/", updateAppUserHandler);
router.get("/notification_settings", getNotificationsSettingsHandler);
router.post("/notification_settings", updateNotificationsSettingsHandler);

export default router;
