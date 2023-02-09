import express from "express";
const account = require("./account/lib");
const checkToken = require("./account/checkToken");
import { getFiguresOnUsers } from "../workflows/users/getFiguresOnUsers";
import { getAllUsers } from "../workflows/users/getAllUsers";
import { updateUser } from "../workflows/users/updateUser";
import { exportUsers } from "../workflows/users/exportUsers";
import { login } from "../workflows/users/login";
import changePassword from "../workflows/users/changePassword";
import { setNewPassword } from "../workflows/users/setNewPassword";
import { getUserFavoritesInLocale } from "../workflows/users/getUserFavoritesInLocale";
import { updateUserFavorites } from "../workflows/users/updateUserFavorites";
import deleteUser from "../workflows/users/deleteUser/deleteUser";

/* TODO: use tsoa */
const router = express.Router();

router.post("/login", checkToken.getId, checkToken.getRoles, login);
router.post("/checkUserExists", account.checkUserExists);
router.post("/set_user_info", checkToken.check, checkToken.getRoles, account.set_user_info);
router.post("/get_users", checkToken.getId, account.get_users);
router.post("/get_user_info", checkToken.check, account.get_user_info);
// @ts-ignore FIXME
router.post("/changePassword", checkToken.check, changePassword);
router.post("/reset_password", checkToken.getRoles, account.reset_password);
router.post("/set_new_password", checkToken.getRoles, setNewPassword);
// @ts-ignore FIXME
router.get("/getFiguresOnUsers", getFiguresOnUsers);
router.get("/getAllUsers", checkToken.check, getAllUsers);
router.post("/updateUser", checkToken.check, checkToken.getRoles, updateUser);
router.post("/exportUsers", checkToken.check, checkToken.getRoles, exportUsers);
router.get("/getUserFavoritesInLocale", checkToken.check, getUserFavoritesInLocale);
router.post("/updateUserFavorites", checkToken.check, updateUserFavorites);
// @ts-ignore FIXME
router.delete("/:id", checkToken.check, checkToken.getRoles, deleteUser);

module.exports = router;