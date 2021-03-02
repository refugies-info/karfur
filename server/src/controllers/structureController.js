const structure = require("./structure/lib.js");
const checkToken = require("./account/checkToken");
import { getAllStructures } from "../workflows/structure/getAllStructures";
import { targetErrosOnDispositifsAssociesInStructures } from "./structure/cleanStructure";
import { getStructureById } from "../workflows/structure/getStructureById";
import { getActiveStructures } from "../workflows/structure/getActiveStructures";
import { createStructure } from "../workflows/structure/createStructure";
import { updateStructure } from "../workflows/structure/updateStructure";
import { modifyUserRoleInStructure } from "../workflows/structure/modifyUserRoleInStructure";

module.exports = function (app) {
  app.post("/get_structure", structure.get_structure);
  app.get("/getStructureById", getStructureById);
  app.post(
    "/targetErrosOnDispositifsAssociesInStructures",
    targetErrosOnDispositifsAssociesInStructures
  );
  app.get("/getActiveStructures", getActiveStructures);
  app.get("/getAllStructures", getAllStructures);
  app.post("/createStructure", checkToken.check, createStructure);
  app.post("/updateStructure", checkToken.check, updateStructure);
  app.post(
    "/modifyUserRoleInStructure",
    checkToken.check,
    modifyUserRoleInStructure
  );
};
