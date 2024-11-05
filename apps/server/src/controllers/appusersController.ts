import {
  AppUserRequest,
  AppUserUid,
  GetNotificationsSettingsResponse,
  NotificationSettingsRequest,
  PostAppUserResponse,
  PostNotificationsSettingsResponse,
} from "@refugies-info/api-types";
import { Body, Controller, Get, Header, Post, Route } from "tsoa";

import { ResponseWithData } from "~/types/interface";
import { getNotificationsSettings } from "~/workflows/appusers/getNotificationsSettings";
import { postNotificationsSettings } from "~/workflows/appusers/postNotificationsSettings";
import { updateAppUser } from "~/workflows/appusers/updateAppUser";

@Route("appuser")
export class AppUsersController extends Controller {
  @Post("/")
  public async post(
    @Header("x-app-uid") appUid: AppUserUid,
    @Body() body: AppUserRequest,
  ): ResponseWithData<PostAppUserResponse> {
    return updateAppUser(appUid, body);
  }

  @Get("/notification_settings") /* TODO: udpate case */ public async notificationSettings(
    @Header("x-app-uid") appUid: AppUserUid,
  ): ResponseWithData<GetNotificationsSettingsResponse> {
    return getNotificationsSettings(appUid);
  }

  @Post("/notification_settings") /* TODO: udpate case */ public async update(
    @Header("x-app-uid") appUid: AppUserUid,
    @Body() body: NotificationSettingsRequest,
  ): ResponseWithData<PostNotificationsSettingsResponse> {
    return postNotificationsSettings(appUid, body);
  }
}
