const structure = require("./structure/lib.js");
const checkToken = require("./account/checkToken");
import { getStructureByIdWithDispositifsAssocies } from "./structure/structure.service";

module.exports = function (app) {
  app.post("/add_structure", checkToken.check, structure.add_structure);
  app.post("/get_structure", structure.get_structure);
  app.get(
    "/getStructureByIdWithDispositifsAssocies",
    getStructureByIdWithDispositifsAssocies
  );
};
