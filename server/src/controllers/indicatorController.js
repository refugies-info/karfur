import express from "express";
const router = express.Router();
const indicator = require("./indicator/lib.js");

router.post("/set_indicator", indicator.post_indicator);
router.post("/get_indicator", indicator.get_indicator);

module.exports = router;
