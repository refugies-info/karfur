const checkToken = require("./account/checkToken");
import { getLogs } from "../workflows/log/getLogs";

module.exports = function (app) {
  app.get("/", checkToken.check, getLogs);
};
