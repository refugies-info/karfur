const account = require("./account/lib.js");
const checkToken = require("./account/checkToken");
import { getFiguresOnUsers } from "../models/users/getFiguresOnUsers";
import { getAllUsers } from "../models/users/getAllUsers";

module.exports = function (app) {
  app.post("/login", checkToken.getId, checkToken.getRoles, account.login);
  app.post("/signup", checkToken.getRoles, account.signup);
  app.post("/checkUserExists", account.checkUserExists);
  app.post(
    "/set_user_info",
    checkToken.check,
    checkToken.getRoles,
    account.set_user_info
  );
  app.post("/get_users", checkToken.getId, account.get_users);
  app.post("/get_user_info", checkToken.check, account.get_user_info);
  app.post("/change_password", checkToken.check, account.change_password);
  app.post("/reset_password", checkToken.getRoles, account.reset_password);
  app.post("/set_new_password", checkToken.getRoles, account.set_new_password);

  app.get("/getFiguresOnUsers", getFiguresOnUsers);
  app.get("/getAllUsers", getAllUsers);
};
