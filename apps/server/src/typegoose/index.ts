import { getModelForClass, setGlobalOptions, Severity } from "@typegoose/typegoose";
setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });

import { AdminOptions } from "./AdminOptions";
import { AppUser, NotificationsSettings } from "./AppUser";
import { Dispositif, DispositifId } from "./Dispositif";
import { Error } from "./Error";
import { Image } from "./Image";
import { Indicator } from "./Indicator";
import { Langue, LangueId } from "./Langue";
import { Log, LogId } from "./Log";
import { MailEvent } from "./MailEvent";
import { Need, NeedId } from "./Need";
import { Notification } from "./Notification";
import { Role } from "./Role";
import { Structure, StructureId } from "./Structure";
import { Theme, ThemeId } from "./Theme";
import { TraductionDiff, TraductionId, Traductions, TraductionsStatus } from "./Traductions";
import { User, UserId } from "./User";
import { Widget, WidgetId } from "./Widget";

export const AdminOptionsModel = getModelForClass(AdminOptions);
export const AppUserModel = getModelForClass(AppUser);
export const DispositifModel = getModelForClass(Dispositif, {
  options: {
    customName: "Dispositif",
  },
  schemaOptions: {
    collection: "dispositifs",
  },
});
export const DispositifDraftModel = getModelForClass(Dispositif, {
  options: {
    customName: "DispositifDraft",
  },
  schemaOptions: {
    collection: "dispositifs_draft",
  },
});
export const ErrorModel = getModelForClass(Error);
export const ImageModel = getModelForClass(Image);
export const IndicatorModel = getModelForClass(Indicator);
export const LangueModel = getModelForClass(Langue);
export const LogModel = getModelForClass(Log);
export const MailEventModel = getModelForClass(MailEvent);
export const NeedModel = getModelForClass(Need);
export const NotificationModel = getModelForClass(Notification);
export const RoleModel = getModelForClass(Role);
export const StructureModel = getModelForClass(Structure);
export const ThemeModel = getModelForClass(Theme);
export const TraductionsModel = getModelForClass(Traductions);
export const UserModel = getModelForClass(User);
export const WidgetModel = getModelForClass(Widget);

export {
  AdminOptions,
  AppUser,
  Dispositif,
  Error,
  Image,
  Indicator,
  Langue,
  Log,
  MailEvent,
  Need,
  Notification,
  NotificationsSettings,
  Role,
  Structure,
  Theme,
  Traductions,
  TraductionsStatus,
  User,
  Widget,
};

export type {
  DispositifId,
  LangueId,
  LogId,
  NeedId,
  StructureId,
  ThemeId,
  TraductionDiff,
  TraductionId,
  UserId,
  WidgetId,
};

export * from "./generics";
