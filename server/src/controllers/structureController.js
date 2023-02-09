import express from "express";
const router = express.Router();
const checkToken = require("./account/checkToken");
import { getAllStructures } from "../workflows/structure/getAllStructures";
import { getStructureById } from "../workflows/structure/getStructureById";
import { getActiveStructures } from "../workflows/structure/getActiveStructures";
import { createStructure } from "../workflows/structure/createStructure";
import { updateStructure } from "../workflows/structure/updateStructure";
import { modifyUserRoleInStructure } from "../workflows/structure/modifyUserRoleInStructure";
import getStatistics from "../workflows/structure/getStatistics";

/* TODO: use tsoa */

router.get("/getStructureById", checkToken.getId, checkToken.getRoles, getStructureById);
router.get("/getActiveStructures", getActiveStructures);
router.get("/getAllStructures", getAllStructures);
router.post("/createStructure", checkToken.check, createStructure);
router.post("/updateStructure", checkToken.check, updateStructure);
router.post("/modifyUserRoleInStructure", checkToken.check, modifyUserRoleInStructure);
router.get("/statistics", getStatistics);
/* NOT USED
router.post("/modifyMembreRoleInStructures", modifyMembreRoleInStructures);
router.post(
  "/targetErrosOnDispositifsAssociesInStructures",
  targetErrosOnDispositifsAssociesInStructures
); */

module.exports = router;
