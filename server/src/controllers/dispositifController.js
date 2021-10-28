const dispositif = require("./dispositif/lib.js");
const checkToken = require("./account/checkToken");

import { updateNbVuesOrFavoritesOnContent } from "../workflows/dispositif/updateNbVuesOrFavoritesOnContent";
import { getDispositifs } from "../workflows/dispositif/getDispositifs";
import { getAllDispositifs } from "../workflows/dispositif/getAllDispositifs";
import { updateDispositifStatus } from "../workflows/dispositif/updateDispositifStatus";
import { modifyDispositifMainSponsor } from "../workflows/dispositif/modifyDispositifMainSponsor";
import { updateDispositifAdminComments } from "../workflows/dispositif/updateDispositifAdminComments";
import { getNbDispositifsByRegion } from "../workflows/dispositif/getNbDispositifsByRegion";
import { updateDispositifReactions } from "../workflows/dispositif/updateDispositifReactions";
import { getUserContributions } from "../workflows/dispositif/getUserContributions";
import { getDispositifsWithTranslationAvancement } from "../workflows/dispositif/getDispositifsWithTranslationAvancement";
import { exportFiches } from "../workflows/dispositif/exportFiches";
import { addDispositif } from "../workflows/dispositif/addDispositif";
import { exportDispositifsGeolocalisation } from "../workflows/dispositif/exportDispositifsGeolocalisation";
import { getContentsForApp } from "../workflows/dispositif/getContentsForApp";
import { updateDispositifTagsOrNeeds } from "../workflows/dispositif/updateDispositifTagsOrNeeds";
import { getContentById } from "../workflows/dispositif/getContentById";

module.exports = function (app) {
  app.post("/addDispositif", checkToken.check, addDispositif);
  app.post(
    "/add_dispositif_infocards",
    checkToken.check,
    dispositif.add_dispositif_infocards
  );
  app.post("/get_dispositif", dispositif.get_dispositif);
  app.post("/count_dispositifs", dispositif.count_dispositifs);
  app.post("/getDispositifs", getDispositifs);
  app.get("/getAllDispositifs", getAllDispositifs);
  app.post("/updateDispositifStatus", checkToken.check, updateDispositifStatus);
  app.post("/modifyDispositifMainSponsor", modifyDispositifMainSponsor);
  app.post("/updateDispositifAdminComments", updateDispositifAdminComments);
  app.get("/getNbDispositifsByRegion", getNbDispositifsByRegion);
  app.post(
    "/updateNbVuesOrFavoritesOnContent",
    updateNbVuesOrFavoritesOnContent
  );
  app.post(
    "/updateDispositifReactions",
    checkToken.getId,
    updateDispositifReactions
  );
  app.get("/getUserContributions", checkToken.check, getUserContributions);
  app.get(
    "/getDispositifsWithTranslationAvancement",
    checkToken.check,
    getDispositifsWithTranslationAvancement
  );
  app.post("/exportFiches", exportFiches);
  app.post(
    "/exportDispositifsGeolocalisation",
    exportDispositifsGeolocalisation
  );
  app.get("/getContentsForApp", getContentsForApp);
  app.post(
    "/updateDispositifTagsOrNeeds",
    checkToken.check,
    updateDispositifTagsOrNeeds
  );
  app.get("/getContentById", getContentById);
  /* NOT USED
  app.post("/addNeedsFromAirtable", addNeedsFromAirtable);
  app.post("/fixAudienceAgeOnContents", fixAudienceAgeOnContents);
  app.post(
    "/get_dispo_progression",
    checkToken.check,
    dispositif.get_dispo_progression
  );
  */
};
