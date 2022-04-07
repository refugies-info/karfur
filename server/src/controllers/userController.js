const account = require("./account/lib.js");
const checkToken = require("./account/checkToken");
import { getFiguresOnUsers } from "../workflows/users/getFiguresOnUsers";
import { getAllUsers } from "../workflows/users/getAllUsers";
import { updateUser } from "../workflows/users/updateUser";
import { exportUsers } from "../workflows/users/exportUsers";
import { login } from "../workflows/users/login";
import { changePassword } from "../workflows/users/changePassword";
import { getUserFavoritesInLocale } from "../workflows/users/getUserFavoritesInLocale";
import { updateUserFavorites } from "../workflows/users/updateUserFavorites";

module.exports = function (app) {
  app.post("/login", checkToken.getId, checkToken.getRoles, login);
  app.post("/checkUserExists", account.checkUserExists);
  app.post(
    "/set_user_info",
    checkToken.check,
    checkToken.getRoles,
    account.set_user_info
  );
  app.post("/get_users", checkToken.getId, account.get_users);
  app.post("/get_user_info", checkToken.check, account.get_user_info);
  app.post("/changePassword", checkToken.check, changePassword);
  app.post("/reset_password", checkToken.getRoles, account.reset_password);
  app.post("/set_new_password", checkToken.getRoles, account.set_new_password);

  app.get("/getFiguresOnUsers", getFiguresOnUsers);
  app.get("/getAllUsers", checkToken.check, getAllUsers);
  app.post("/updateUser", checkToken.check, checkToken.getRoles, updateUser);
  app.post("/exportUsers", checkToken.check, checkToken.getRoles, exportUsers);
  app.get(
    "/getUserFavoritesInLocale",
    checkToken.check,
    getUserFavoritesInLocale
  );
  app.post("/updateUserFavorites", checkToken.check, updateUserFavorites);
  /* NOT USED
  app.get("/findBuggedUsers", findBuggedUsers);
  */
};
