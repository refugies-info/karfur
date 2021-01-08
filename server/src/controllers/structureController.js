const structure = require("./structure/lib.js");
const checkToken = require("./account/checkToken");
import { getAllStructures } from "../models/structure/getAllStructures";
import { targetErrosOnDispositifsAssociesInStructures } from "./structure/cleanStructure";
import { getStructureById } from "../models/structure/getStructureById";
import { getActiveStructures } from "../models/structure/getActiveStructures";
import { createStructure } from "../models/structure/createStructure";
import { updateStructure } from "../models/structure/updateStructure";
import { modifyUserRoleInStructure } from "../models/structure/modifyUserRoleInStructure";

module.exports = function (app) {
  app.post("/add_structure", checkToken.check, structure.add_structure);
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
