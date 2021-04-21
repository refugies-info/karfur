const traduction = require("./traduction/lib.js");
const checkToken = require("./account/checkToken");
import { validateTranslations } from "../workflows/translation/validateTranslations";

module.exports = function (app) {
  app.post(
    "/add_tradForReview",
    checkToken.getId,
    checkToken.getRoles,
    traduction.add_tradForReview
  );
  app.post(
    "/get_tradForReview",
    checkToken.check,
    traduction.get_tradForReview
  );
  app.post("/validateTranslations", checkToken.check, validateTranslations);
  app.post(
    "/update_tradForReview",
    checkToken.check,
    traduction.update_tradForReview
  );
  app.post("/get_progression", checkToken.check, traduction.get_progression);
  app.post("/delete_trads", checkToken.check, traduction.delete_trads);
};
