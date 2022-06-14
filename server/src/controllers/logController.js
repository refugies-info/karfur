import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import { getLogs } from "../workflows/log/getLogs";

router.get("/", checkToken.check, getLogs);

module.exports = router;
