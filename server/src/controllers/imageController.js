import express from "express";
const router = express.Router();
const image = require("./image/lib.js");

router.post("/set_image", image.set_image);

module.exports = router;
