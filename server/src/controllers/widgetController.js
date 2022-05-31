import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import { getWidgets } from "../workflows/widget/getWidgets";
import { postWidgets } from "../workflows/widget/postWidgets";

router.get("/", checkToken.check, getWidgets);
router.post("/", checkToken.check, postWidgets);

module.exports = router;
