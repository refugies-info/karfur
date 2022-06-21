import express from "express";
const router = express.Router();
const translate = require("./translate/lib.js");

router.post("/get_translation", translate.get_translation);

module.exports = router;
