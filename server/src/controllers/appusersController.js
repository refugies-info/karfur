import express from "express";
const router = express.Router();
import updateAppUser from "../workflows/appusers/updateAppUser";
import getNotificationsSettings from "../workflows/appusers/getNotificationsSettings";
import updateNotificationsSettings from "../workflows/appusers/updateNotificationsSettings";


router.post("/", updateAppUser);
router.get("/notification_settings", getNotificationsSettings);
router.post("/notification_settings", updateNotificationsSettings);

module.exports = router;

