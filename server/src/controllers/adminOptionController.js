import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import getAdminOptions from "../workflows/adminOption/getAdminOptions";
import postAdminOptions from "../workflows/adminOption/postAdminOptions";

router.get("/:key", checkToken.check, getAdminOptions);
router.post("/:key", checkToken.check, postAdminOptions);

module.exports = router;
