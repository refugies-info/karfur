const checkToken = require("./account/checkToken");
import { getAllStructures } from "../workflows/structure/getAllStructures";
import { getStructureById } from "../workflows/structure/getStructureById";
import { getActiveStructures } from "../workflows/structure/getActiveStructures";
import { createStructure } from "../workflows/structure/createStructure";
import { updateStructure } from "../workflows/structure/updateStructure";
import { modifyUserRoleInStructure } from "../workflows/structure/modifyUserRoleInStructure";

module.exports = function (app) {
  app.get("/getStructureById", checkToken.getId, checkToken.getRoles, getStructureById);
  app.get("/getActiveStructures", getActiveStructures);
  app.get("/getAllStructures", getAllStructures);
  app.post("/createStructure", checkToken.check, createStructure);
  app.post("/updateStructure", checkToken.check, updateStructure);
  app.post(
    "/modifyUserRoleInStructure",
    checkToken.check,
    modifyUserRoleInStructure
  );
  /* NOT USED
  app.post("/modifyMembreRoleInStructures", modifyMembreRoleInStructures);
  app.post(
    "/targetErrosOnDispositifsAssociesInStructures",
    targetErrosOnDispositifsAssociesInStructures
  ); */
};
