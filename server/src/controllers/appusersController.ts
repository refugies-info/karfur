import { Controller, Get, Post, Body, Route, Header } from "tsoa";

import { PostAppUserResponse, updateAppUser } from "../workflows/appusers/updateAppUser";
import { getNotificationsSettings, GetNotificationsSettings } from "../workflows/appusers/getNotificationsSettings";
import { postNotificationsSettings, PostNotificationsSettings } from "../workflows/appusers/postNotificationsSettings";
import { ResponseWithData } from "../types/interface";

export interface AppUserRequest {
  city?: string;
  department?: string;
  selectedLanguage?: string;
  age?: string;
  frenchLevel?: string;
  expoPushToken?: string;
}

export interface NotificationSettingsRequest {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes?: {
    [key: string]: boolean;
  };
}

/**
 * TODO: test pattern
 * @pattern [0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}
 */
export type Uid = string;

@Route("appuser")
export class AppUsersController extends Controller {
  @Post("/")
  public async post(
    @Header("x-app-uid") appUid: Uid,
    @Body() body: AppUserRequest,
  ): ResponseWithData<PostAppUserResponse> {
    return updateAppUser(appUid, body);
  }

  @Get("/notification_settings") /* TODO: udpate case */ public async notificationSettings(
    @Header("x-app-uid") appUid: Uid,
  ): ResponseWithData<GetNotificationsSettings> {
    return getNotificationsSettings(appUid);
  }

  @Post("/notification_settings") /* TODO: udpate case */ public async update(
    @Header("x-app-uid") appUid: Uid,
    @Body() body: NotificationSettingsRequest,
  ): ResponseWithData<PostNotificationsSettings> {
    return postNotificationsSettings(appUid, body);
  }
}
