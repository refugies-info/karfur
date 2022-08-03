import express from "express";
const router = express.Router();
import getNotifications from "../workflows/notifications/getNotifications";
import markAsSeen from "../workflows/notifications/markAsSeen";

router.get("/", getNotifications);
router.post("/seen", markAsSeen);

module.exports = router;
