import { Controller, Request, Get, Post, Put, Body, Delete, Route, Security, Queries, Path, Patch, Query } from "tsoa";
import { pick } from "lodash";
import { Request as ExRequest } from "express";

import { getFiguresOnUsers, GetUserStatisticsResponse } from "../workflows/users/getFiguresOnUsers";
import { getAllUsers, GetAllUsersResponse } from "../workflows/users/getAllUsers";
import { getActiveUsers, GetActiveUsersResponse } from "../workflows/users/getActiveUsers";
import { updateUser } from "../workflows/users/updateUser";
import { exportUsers } from "../workflows/users/exportUsers";
import { login } from "../workflows/users/login";
import { changePassword, UpdatePasswordResponse } from "../workflows/users/changePassword";
import { setNewPassword, NewPasswordResponse } from "../workflows/users/setNewPassword";
import { getUserFavoritesInLocale, GetUserFavoritesResponse } from "../workflows/users/getUserFavoritesInLocale";
import { deleteUser } from "../workflows/users/deleteUser";
import { LangueId } from "../typegoose";
import { setSelectedLanguages } from "../workflows";
import { Id, IRequest, Picture, Response, ResponseWithData } from "../types/interface";
import { addUserFavorite } from "../workflows/users/addUserFavorite";
import { deleteUserFavorites } from "../workflows/users/deleteUserFavorites";
import { resetPassword, ResetPasswordResponse } from "../workflows/users/resetPassword";
import { checkResetToken } from "../workflows/users/checkResetToken";
import { checkUserExists } from "../workflows/users/checkUserExists";
import { LoginResponse } from "../workflows/users/login/login";

// import { UserStatus } from "../typegoose/User";

// THIS NOT WORK BECAUSE TSOA NEED TO KNOW EVERY
// EXTENDED TYPE (IE TYPEGOOSE TYPES) => HE CAN'T
// export type GetUserInfoResponse = Pick<
//   User,
//   "contributions" | "email" | "roles" | "selectedLanguages" | "status" | "structures" | "username" | "_id"
// >;

export interface SelectedLanguagesRequest {
  selectedLanguages: LangueId[];
}

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

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  username: string;
}

export interface NewPasswordRequest {
  newPassword: string;
  reset_password_token: string;
  code?: string;
  email?: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  code?: string;
  email?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  user: {
    roles?: Id[];
    email?: string;
    phone?: string;
    code?: string;
    username?: string;
    picture?: Picture;
    adminComments?: string;
    selectedLanguages?: Id[];
  },
  action: "modify-with-roles" | "modify-my-details";
}

@Route("user")
export class UserController extends Controller {

  @Security("fromSite")
  @Post("/login")
  public async login(@Body() body: LoginRequest): ResponseWithData<LoginResponse> {
    return login(body);
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
  public async getExists(@Query() username: string): Response {
    return checkUserExists(username);
  }

  @Security({ jwt: ["admin"] })
  @Get("/statistics")
  public async getStatistics(): ResponseWithData<GetUserStatisticsResponse> {
    return getFiguresOnUsers();
  }

  @Get("/password/reset")
  public async checkResetToken(@Query() token: string): Response {
    return checkResetToken(token)
  }

  @Post("/password/reset")
  public async resetPassword(@Body() body: ResetPasswordRequest): ResponseWithData<ResetPasswordResponse> {
    return resetPassword(body)
  }

  @Security("fromSite")
  @Post("/password/new")
  public async setNewPassword(@Body() body: NewPasswordRequest): ResponseWithData<NewPasswordResponse> {
    return setNewPassword(body)
  }

  @Security("jwt")
  @Get("/favorites")
  public async getUserFavorites(@Request() request: IRequest, @Queries() query: UserFavoritesRequest): ResponseWithData<GetUserFavoritesResponse[]> {
    return getUserFavoritesInLocale(request.user, query)
  }

  @Security("jwt")
  @Put("/favorites")
  public async addUserFavorite(@Request() request: ExRequest, @Body() body: AddUserFavorite): Response {
    return addUserFavorite(request.user, body);
  }

  @Security("jwt")
  @Delete("/favorites")
  public async deleteUserFavorites(@Request() request: ExRequest, @Queries() query: DeleteUserFavorite): Response {
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

  @Security({ jwt: [], fromSite: [] })
  @Patch("/{id}/password")
  public async updatePassword(@Path() id: string, @Request() request: ExRequest, @Body() body: UpdatePasswordRequest): ResponseWithData<UpdatePasswordResponse> {
    return changePassword(id, body, request.user);
  }

  @Security({ jwt: [], fromSite: [] })
  @Patch("/{id}")
  public async updateUser(@Path() id: string, @Request() request: ExRequest, @Body() body: UpdateUserRequest): Response {
    return updateUser(id, body, request.user);
  }

  @Delete("/{id}")
  @Security({ jwt: ["admin"], fromSite: [] })
  public async deleteUser(@Path() id: string): Response {
    return deleteUser(id);
  }
}
