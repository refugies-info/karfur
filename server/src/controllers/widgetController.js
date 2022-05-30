const checkToken = require("./account/checkToken");
import { getWidgets } from "../workflows/widget/getWidgets";
import { postWidgets } from "../workflows/widget/postWidgets";

module.exports = function (app) {
  app.get("/", checkToken.check, getWidgets);
  app.post("/", checkToken.check, postWidgets);
};
