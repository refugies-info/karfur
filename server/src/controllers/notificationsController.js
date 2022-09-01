import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import getNotifications from "../workflows/notifications/getNotifications";
import markAsSeen from "../workflows/notifications/markAsSeen";
import sendNotifications from "../workflows/notifications/sendNotifications";

router.get("/", getNotifications);
router.post("/seen", markAsSeen);
router.post("/send", checkToken.check, sendNotifications);

module.exports = router;
