import {
  Controller,
  Post,
  Body,
  Route,
  Security
} from "tsoa";

/* TODO: update workflows */
import { sendDraftReminderMail } from "../workflows/mail/sendDraftReminderMail";
import { sendReminderMailToUpdateContents } from "../workflows/mail/sendReminderMailToUpdateContents";
import { sendAdminImprovementsMail } from "../workflows/mail/sendAdminImprovementsMail";
import { sendSubscriptionReminderMail } from "../workflows/mail/sendSubscriptionReminderMail";
import setMail from "../workflows/miscellaneaous/setMail";
import { Response } from "../types/interface";
import { DispositifId, UserId } from "../typegoose";

export interface ImprovementsRequest {
  dispositifId: DispositifId;
  users: {
    username: string;
    _id: UserId;
    email: string;
  }[];
  titreInformatif: string;
  titreMarque: string;
  sections: string[];
  message: string;
}

@Route("mail")
export class NeedController extends Controller {

  @Security({
    fromCron: []
  })
  @Post("sendDraftReminderMail")
  public draftReminderMail(): Response {
    return sendDraftReminderMail();
  }

  @Security({
    fromCron: []
  })
  @Post("sendReminderMailToUpdateContents")
  public reminderMailToUpdateContents(): Response {
    return sendReminderMailToUpdateContents();
  }

  @Security({
    fromSite: [],
    jwt: ["admin"]
  })
  @Post("sendAdminImprovementsMail")
  public adminImprovementsMail(
    @Body() body: ImprovementsRequest
  ): Response {
    return sendAdminImprovementsMail(body);
  }

  @Security({
    fromSite: [],
  })
  @Post("sendSubscriptionReminderMail")
  public subscriptionReminderMail(
    @Body() body: { email: string }
  ): Response {
    return sendSubscriptionReminderMail(body);
  }

  @Security({
    fromSite: [],
  })
  @Post("contacts") // TODO: moved from misceallaneous/set_mail
  public addContact(
    @Body() body: { email: string }
  ): Response {
    return setMail(body);
  }
}
