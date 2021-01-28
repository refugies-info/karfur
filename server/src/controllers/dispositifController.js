const dispositif = require("./dispositif/lib.js");
const checkToken = require("./account/checkToken");
const {
  getDispositifs,
  getAllDispositifs,
  updateDispositifStatus,
  modifyDispositifMainSponsor,
  updateDispositifAdminComments,
  getNbDispositifsByRegion,
} = require("./dispositif/dispositif.service");

import { fixAudienceAgeOnDispositifs } from "../models/dispositif/fixAudienceAgeOnDispositifs";

module.exports = function (app) {
  app.post("/add_dispositif", checkToken.check, dispositif.add_dispositif);
  app.post(
    "/create_csv_dispositifs_length",
    checkToken.check,
    dispositif.create_csv_dispositifs_length
  );
  app.post(
    "/add_dispositif_infocards",
    checkToken.check,
    dispositif.add_dispositif_infocards
  );
  app.post("/get_dispositif", dispositif.get_dispositif);
  app.post("/count_dispositifs", dispositif.count_dispositifs);
  app.post(
    "/update_dispositif",
    checkToken.getId,
    dispositif.update_dispositif
  );
  app.post(
    "/get_dispo_progression",
    checkToken.check,
    dispositif.get_dispo_progression
  );
  app.post("/getDispositifs", getDispositifs);
  app.get("/getAllDispositifs", getAllDispositifs);
  app.post("/updateDispositifStatus", updateDispositifStatus);
  app.post("/modifyDispositifMainSponsor", modifyDispositifMainSponsor);
  app.post("/updateDispositifAdminComments", updateDispositifAdminComments);
  app.get("/getNbDispositifsByRegion", getNbDispositifsByRegion);
  app.post("/fixAudienceAgeOnDispositifs", fixAudienceAgeOnDispositifs);
};
