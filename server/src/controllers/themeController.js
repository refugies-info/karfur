import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");

import getThemes from "../workflows/themes/getThemes";
import postThemes from "../workflows/themes/postThemes";
import patchTheme from "../workflows/themes/patchTheme";
import deleteTheme from "../workflows/themes/deleteTheme";

router.get("/", getThemes);
router.post("/", checkToken.check, postThemes);
router.patch("/:id", checkToken.check, patchTheme);
router.delete("/:id", checkToken.check, deleteTheme);

module.exports = router;
