import { Controller, Get, Post, Body, Route, Header } from "tsoa";
import { AppUserRequest, GetNotificationsSettingsResponse, NotificationSettingsRequest, PostAppUserResponse, PostNotificationsSettingsResponse } from "api-types";

import { updateAppUser } from "../workflows/appusers/updateAppUser";
import { getNotificationsSettings } from "../workflows/appusers/getNotificationsSettings";
import { postNotificationsSettings } from "../workflows/appusers/postNotificationsSettings";
import { ResponseWithData } from "../types/interface";



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

  @Get("/notification_settings") /* TODO: udpate case */
  public async notificationSettings(
    @Header("x-app-uid") appUid: Uid,
  ): ResponseWithData<GetNotificationsSettingsResponse> {
    return getNotificationsSettings(appUid);
  }

  @Post("/notification_settings") /* TODO: udpate case */
  public async update(
    @Header("x-app-uid") appUid: Uid,
    @Body() body: NotificationSettingsRequest,
  ): ResponseWithData<PostNotificationsSettingsResponse> {
    return postNotificationsSettings(appUid, body);
  }
}
