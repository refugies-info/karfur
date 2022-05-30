const checkToken = require("./account/checkToken");
import { getWidgets } from "../workflows/log/getWidgets";
import { postWidgets } from "../workflows/log/postWidgets";

module.exports = function (app) {
  app.get("/", checkToken.check, getWidgets);
  app.post("/", checkToken.check, postWidgets);
};
