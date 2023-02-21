import { Controller, Request, Get, Post, Put, Body, Delete, Route, Security, Queries, Path } from "tsoa";
import { pick } from "lodash";

const account = require("./account/lib");
const checkToken = require("./account/checkToken");
import express, { Request as ExRequest } from "express";
import { getFiguresOnUsers, GetUserStatisticsResponse } from "../workflows/users/getFiguresOnUsers";
import { getAllUsers, GetAllUsersResponse } from "../workflows/users/getAllUsers";
import { getActiveUsers, GetActiveUsersResponse } from "../workflows/users/getActiveUsers";
import { updateUser } from "../workflows/users/updateUser";
import { exportUsers } from "../workflows/users/exportUsers";
import { login } from "../workflows/users/login";
import changePassword from "../workflows/users/changePassword";
import { setNewPassword } from "../workflows/users/setNewPassword";
import { getUserFavoritesInLocale, GetUserFavoritesResponse } from "../workflows/users/getUserFavoritesInLocale";
import { deleteUser } from "../workflows/users/deleteUser";
import { LangueId } from "../typegoose";
import { setSelectedLanguages } from "../workflows";
import { Id, IRequest, Picture, Response, ResponseWithData } from "../types/interface";
import { addUserFavorite } from "../workflows/users/addUserFavorite";
import { deleteUserFavorites } from "../workflows/users/deleteUserFavorites";
// import { UserStatus } from "../typegoose/User";

/* TODO: use tsoa */
const router = express.Router();

router.post("/login", checkToken.getId, checkToken.getRoles, login);
router.post("/checkUserExists", account.checkUserExists);
router.post("/get_users", checkToken.getId, account.get_users);
// @ts-ignore FIXME
router.post("/changePassword", checkToken.check, changePassword);
router.post("/reset_password", checkToken.getRoles, account.reset_password);
router.post("/set_new_password", checkToken.getRoles, setNewPassword);
router.post("/updateUser", checkToken.check, checkToken.getRoles, updateUser);
router.post("/exportUsers", checkToken.check, checkToken.getRoles, exportUsers);

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
  phone: string;
  roles: { _id: string; nom: string; nomPublic: string }[];
  selectedLanguages: string[];
  status: "Actif" | "Exclu"; // FIXME : UserStatus does not work with tsoa
  structures: string[];
  traductionsFaites: string[];
  username: string;
  picture?: Picture;
  favorites?: {
    dispositifId: Id;
    created_at: Date;
  }[];
}

export interface UserFavoritesRequest {
  locale: string
}

export interface AddUserFavorite {
  dispositifId: string;
}

export interface DeleteUserFavorite {
  dispositifId?: string;
  all?: boolean;
}

@Route("user")
export class UserController extends Controller {

  @Security("jwt")
  @Get("/actives")
  public async get(
    @Request() request: ExRequest
  ): ResponseWithData<GetActiveUsersResponse[]> {
    return getActiveUsers(request.user);
  }

  @Security({
    jwt: ["admin"],
  })
  @Get("/all")
  public async getAll(): ResponseWithData<GetAllUsersResponse[]> {
    return getAllUsers();
  }

  @Security({
    jwt: ["admin"],
  })
  @Get("/statistics")
  public async getStatistics(): ResponseWithData<GetUserStatisticsResponse> {
    return getFiguresOnUsers();
  }

  @Security("jwt")
  @Get("/favorites")
  public async getUserFavorites(
    @Request() request: IRequest,
    @Queries() query: UserFavoritesRequest
  ): ResponseWithData<GetUserFavoritesResponse[]> {
    return getUserFavoritesInLocale(request.user, query)
  }

  @Security("jwt")
  @Put("/favorites")
  public async addUserFavorite(
    @Request() request: ExRequest,
    @Body() body: AddUserFavorite,
  ): Response {
    return addUserFavorite(request.user, body);
  }

  @Security("jwt")
  @Delete("/favorites")
  public async deleteUserFavorites(
    @Request() request: ExRequest,
    @Queries() query: DeleteUserFavorite,
  ): Response {
    return deleteUserFavorites(request.user, query);
  }

  @Post("/selected_languages")
  @Security("jwt")
  public async selectedLanguages(@Request() request: IRequest, @Body() body: SelectedLanguagesRequest): Response {
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
        "phone",
        "picture",
        "favorites",
        "selectedLanguages",
      ]),
    };
  }

  @Delete("/{id}")
  @Security({
    jwt: ["admin"],
    fromSite: []
  })
  public async deleteUser(@Path() id: string): Response {
    return deleteUser(id);
  }
}
