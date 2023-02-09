import {
  Controller,
  Get,
  Post,
  Body,
  Route,
  Header,
} from "tsoa";

/* TODO: update workflows */
import { updateAppUser } from "../workflows/appusers/updateAppUser";
import { getNotificationsSettings, GetNotificationsSettings } from "../workflows/appusers/getNotificationsSettings";
import { updateNotificationsSettings, PostNotificationsSettings } from "../workflows/appusers/updateNotificationsSettings";
import { Response, ResponseWithData } from "../types/interface";

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
  themes: any; /* TODO: precise type */
}

@Route("options")
export class AdminOptionController extends Controller {

  @Post("/")
  public async post(
    @Header("x-app-uid") appUid: string,
    @Body() body: AppUserRequest
  ): Response {
    return updateAppUser(appUid, body);
  }
  @Get("/notification_settings") /* TODO: udpate case */
  public async notificationSettings(
    @Header("x-app-uid") appUid: string
  ): ResponseWithData<GetNotificationsSettings[]> {
    return getNotificationsSettings(appUid);
  }

  @Post("/notification_settings") /* TODO: udpate case */
  public async get(
    @Header("x-app-uid") appUid: string,
    @Body() body: NotificationSettingsRequest
  ): ResponseWithData<PostNotificationsSettings[]> {
    return updateNotificationsSettings(appUid, body);
  }
}
