import express from "express";
import { Controller, Request, Get, Post, Body, Route, Security, Queries } from "tsoa";
import { pick } from "lodash";

const account = require("./account/lib");
const checkToken = require("./account/checkToken");
import { getFiguresOnUsers } from "../workflows/users/getFiguresOnUsers";
import { getAllUsers } from "../workflows/users/getAllUsers";
import { updateUser } from "../workflows/users/updateUser";
import { exportUsers } from "../workflows/users/exportUsers";
import { login } from "../workflows/users/login";
import changePassword from "../workflows/users/changePassword";
import { setNewPassword } from "../workflows/users/setNewPassword";
import { getUserFavoritesInLocale, GetUserFavoritesResponse } from "../workflows/users/getUserFavoritesInLocale";
import { updateUserFavorites } from "../workflows/users/updateUserFavorites";
import deleteUser from "../workflows/users/deleteUser/deleteUser";
import { LangueId } from "../typegoose";
import { setSelectedLanguages } from "../workflows";
import { Id, IRequest, ResponseWithData } from "../types/interface";
// import { UserStatus } from "../typegoose/User";

/* TODO: use tsoa */
const router = express.Router();

router.post("/login", checkToken.getId, checkToken.getRoles, login);
router.post("/checkUserExists", account.checkUserExists);
router.post("/set_user_info", checkToken.check, checkToken.getRoles, account.set_user_info);
router.post("/get_users", checkToken.getId, account.get_users);
// @ts-ignore FIXME
router.post("/changePassword", checkToken.check, changePassword);
router.post("/reset_password", checkToken.getRoles, account.reset_password);
router.post("/set_new_password", checkToken.getRoles, setNewPassword);
// @ts-ignore FIXME
router.get("/getFiguresOnUsers", getFiguresOnUsers);
router.get("/getAllUsers", checkToken.check, getAllUsers);
router.post("/updateUser", checkToken.check, checkToken.getRoles, updateUser);
router.post("/exportUsers", checkToken.check, checkToken.getRoles, exportUsers);
router.post("/updateUserFavorites", checkToken.check, updateUserFavorites);
// @ts-ignore FIXME
router.delete("/:id", checkToken.check, checkToken.getRoles, deleteUser);

export { router };

export interface SelectedLanguagesRequest {
  selectedLanguages: LangueId[];
}

// THIS NOT WORK BECAUSE TSOA NEED TO KNOW EVERY
// EXTENDED TYPE (IE TYPEGOOSE TYPES) => HE CAN'T
// export type GetUserInfoResponse = Pick<
//   User,
//   "contributions" | "email" | "roles" | "selectedLanguages" | "status" | "structures" | "username" | "_id"
// >;

export interface GetUserInfoResponse {
  _id: Id;
  contributions: string[];
  email: string;
  roles: { _id: string; nom: string; nomPublic: string };
  selectedLanguages: string[];
  status: "Actif" | "Exclu"; // FIXME : UserStatus does not work with tsoa
  structures: string[];
  traductionsFaites: string[];
  username: string;
}

export interface UserFavoritesRequest {
  locale: string
}

@Route("user")
export class UserController extends Controller {
  @Security("jwt")
  @Get("/favorites")
  public async getUserFavorites(
    @Request() request: IRequest,
    @Queries() query: UserFavoritesRequest
  ): ResponseWithData<GetUserFavoritesResponse[]> {
    return getUserFavoritesInLocale(request.user, query)
  }

  @Post("/selected_languages")
  @Security("jwt")
  public async selectedLanguages(@Request() request: IRequest, @Body() body: SelectedLanguagesRequest) {
    return setSelectedLanguages(request.user, body.selectedLanguages).then(() => ({ text: "success" }));
  }

  @Get("/get_user_info") // TODO: change name
  @Security("jwt")
  public async getUserInfo(@Request() request: IRequest): ResponseWithData<GetUserInfoResponse> {
    return {
      text: "success",
      data: pick(request.user.toObject(), [
        "structures",
        "_id",
        "roles",
        "traductionsFaites",
        "contributions",
        "username",
        "status",
        "email",
        "selectedLanguages",
      ]),
    };
  }
}
