import express from "express";
const router = express.Router();
const tts = require("./tts/lib.js");

router.post("/get_tts", tts.get_tts);

module.exports = router;
