import express from "express";
const router = express.Router();
import downloadApp from "../workflows/sms/downloadApp";

router.post("/download-app", downloadApp);

module.exports = router;
