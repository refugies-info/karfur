import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import { getWidgets } from "../workflows/widget/getWidgets";
import { postWidgets } from "../workflows/widget/postWidgets";
import { patchWidget } from "../workflows/widget/patchWidget";
import { deleteWidget } from "../workflows/widget/deleteWidget";

router.get("/", checkToken.check, getWidgets);
router.post("/", checkToken.check, postWidgets);
router.patch("/:id", checkToken.check, patchWidget);
router.delete("/:id", checkToken.check, deleteWidget);

module.exports = router;
