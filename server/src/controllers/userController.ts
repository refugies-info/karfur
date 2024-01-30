import { Controller, Request, Get, Post, Put, Body, Delete, Route, Security, Queries, Path, Patch, Query } from "tsoa";
import { pick } from "lodash";
import { Request as ExRequest } from "express";
import {
  AddUserFavoriteRequest,
  DeleteUserFavoriteRequest,
  GetActiveUsersResponse,
  GetAllUsersResponse,
  GetUserFavoritesResponse,
  GetUserInfoResponse,
  GetUserStatisticsResponse,
  LoginRequest,
  LoginResponse,
  NewPasswordRequest,
  NewPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SelectedLanguagesRequest,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdateUserRequest,
  GetUserFavoritesRequest,
  RegisterRequest,
  CheckCodeRequest,
  CheckUserExistsResponse,
  SendCodeRequest,
} from "@refugies-info/api-types";

import { getFiguresOnUsers } from "../workflows/users/getFiguresOnUsers";
import { getAllUsers } from "../workflows/users/getAllUsers";
import { getActiveUsers } from "../workflows/users/getActiveUsers";
import { updateUser } from "../workflows/users/updateUser";
import { exportUsers } from "../workflows/users/exportUsers";
import { login } from "../workflows/users/login";
import { changePassword } from "../workflows/users/changePassword";
import { setNewPassword } from "../workflows/users/setNewPassword";
import { getUserFavoritesInLocale } from "../workflows/users/getUserFavoritesInLocale";
import { deleteUser } from "../workflows/users/deleteUser";
import { setSelectedLanguages } from "../workflows";
import { IRequest, Response, ResponseWithData } from "../types/interface";
import { addUserFavorite } from "../workflows/users/addUserFavorite";
import { deleteUserFavorites } from "../workflows/users/deleteUserFavorites";
import { resetPassword } from "../workflows/users/resetPassword";
import { checkResetToken } from "../workflows/users/checkResetToken";
import { checkUserExists } from "../workflows/users/checkUserExists";
import { checkCode } from "../workflows/users/checkCode";
import { register } from "../workflows/users/register";
import { sendCode } from "../workflows/users/sendCode";

// import { UserStatus } from "../typegoose/User";

// THIS NOT WORK BECAUSE TSOA NEED TO KNOW EVERY
// EXTENDED TYPE (IE TYPEGOOSE TYPES) => HE CAN'T
// export type GetUserInfoResponse = Pick<
//   User,
//   "contributions" | "email" | "roles" | "selectedLanguages" | "status" | "structures" | "username" | "_id"
// >;

@Route("user")
export class UserController extends Controller {
  @Security("fromSite")
  @Post("/register")
  public async register(@Body() body: RegisterRequest): ResponseWithData<LoginResponse> {
    const data = await register(body);
    return { text: "success", data };
  }

  @Security("fromSite")
  @Post("/login")
  public async login(@Body() body: LoginRequest): ResponseWithData<LoginResponse> {
    const data = await login(body);
    return { text: "success", data };
  }

  @Security("fromSite")
  @Post("/check-code")
  public async checkCode(@Body() body: CheckCodeRequest): ResponseWithData<LoginResponse> {
    const data = await checkCode(body);
    return { text: "success", data };
  }

  @Security("fromSite")
  @Post("/send-code")
  public async sendCode(@Body() body: SendCodeRequest): Response {
    await sendCode(body);
    return { text: "success" };
  }

  @Security("jwt")
  @Get("/actives")
  public async get(@Request() request: ExRequest): ResponseWithData<GetActiveUsersResponse[]> {
    return getActiveUsers(request.user);
  }

  @Security({ jwt: ["admin"] })
  @Get("/all")
  public async getAll(): ResponseWithData<GetAllUsersResponse[]> {
    return getAllUsers();
  }

  @Get("/exists")
  public async getExists(@Query() email: string): ResponseWithData<CheckUserExistsResponse> {
    const data = await checkUserExists(email);
    return { text: "success", data }
  }

  @Security({ jwt: ["admin"] })
  @Get("/statistics")
  public async getStatistics(): ResponseWithData<GetUserStatisticsResponse> {
    return getFiguresOnUsers();
  }

  @Get("/password/reset")
  public async checkResetToken(@Query() token: string): Response {
    return checkResetToken(token);
  }

  @Post("/password/reset")
  public async resetPassword(@Body() body: ResetPasswordRequest): ResponseWithData<ResetPasswordResponse> {
    return resetPassword(body);
  }

  @Security("fromSite")
  @Post("/password/new")
  public async setNewPassword(@Body() body: NewPasswordRequest): ResponseWithData<NewPasswordResponse> {
    return setNewPassword(body);
  }

  @Security("jwt")
  @Get("/favorites")
  public async getUserFavorites(
    @Request() request: IRequest,
    @Queries() query: GetUserFavoritesRequest,
  ): ResponseWithData<GetUserFavoritesResponse[]> {
    return getUserFavoritesInLocale(request.user, query);
  }

  @Security("jwt")
  @Put("/favorites")
  public async addUserFavorite(@Request() request: ExRequest, @Body() body: AddUserFavoriteRequest): Response {
    return addUserFavorite(request.user, body);
  }

  @Security("jwt")
  @Delete("/favorites")
  public async deleteUserFavorites(
    @Request() request: ExRequest,
    @Queries() query: DeleteUserFavoriteRequest,
  ): Response {
    return deleteUserFavorites(request.user, query);
  }

  @Post("/export")
  @Security({ jwt: ["admin"] })
  public async exportUsers(): Response {
    return exportUsers();
  }

  @Post("/selected_languages")
  @Security("jwt")
  public async selectedLanguages(@Request() request: IRequest, @Body() body: SelectedLanguagesRequest): Response {
    return setSelectedLanguages(request.user, body.selectedLanguages).then(() => ({ text: "success" }));
  }

  @Get("/")
  @Security("jwt")
  public async getUserInfo(@Request() request: IRequest): ResponseWithData<GetUserInfoResponse> {
    return {
      text: "success",
      data: pick(request.user.toObject(), [
        "structures",
        "_id",
        "roles",
        "contributions",
        "username",
        "status",
        "email",
        "phone",
        "picture",
        "favorites",
        "selectedLanguages",
        "partner",
        "departments",
      ]),
    };
  }

  @Security({ jwt: [], fromSite: [] })
  @Patch("/{id}/password")
  public async updatePassword(
    @Path() id: string,
    @Request() request: ExRequest,
    @Body() body: UpdatePasswordRequest,
  ): ResponseWithData<UpdatePasswordResponse> {
    return changePassword(id, body, request.user);
  }

  @Security({ jwt: [], fromSite: [] })
  @Patch("/{id}")
  public async updateUser(
    @Path() id: string,
    @Request() request: ExRequest,
    @Body() body: UpdateUserRequest,
  ): Response {
    return updateUser(id, body, request.user);
  }

  @Delete("/{id}")
  @Security({ jwt: ["admin"], fromSite: [] })
  public async deleteUser(@Path() id: string): Response {
    return deleteUser(id);
  }
}
