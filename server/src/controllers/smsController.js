import express from "express";
const router = express.Router();
import downloadApp from "../workflows/sms/downloadApp";
import contentLink from "../workflows/sms/contentLink";

router.post("/download-app", downloadApp);
router.post("/content-link", contentLink);

module.exports = router;
