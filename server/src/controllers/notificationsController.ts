import {
  Controller,
  Get,
  Post,
  Body,
  Route,
  Security,
  Header
} from "tsoa";

/* TODO: update workflows */
import { getNotifications, GetNotificationResponse } from "../workflows/notifications/getNotifications";
import { markAsSeen } from "../workflows/notifications/markAsSeen";
import { sendNotifications } from "../workflows/notifications/sendNotifications";
import { Response, ResponseWithData } from "../types/interface";

@Route("notifications")
export class NotificationController extends Controller {

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Get("/")
  public async get(
    @Header("x-app-uid") appUid: string
  ): ResponseWithData<GetNotificationResponse[]> {
    return getNotifications(appUid);
  }

  @Post("/seen")
  public async seen(
    @Header("x-app-uid") appUid: string,
    @Body() body: { notificationId: string }
  ): Response {
    return markAsSeen(appUid, body);
  }

  @Security({
    jwt: ["admin"]
  })
  @Post("/send")
  public async send(
    @Body() body: { demarcheId: string }
  ): Response {
    return sendNotifications(body);
  }
}
