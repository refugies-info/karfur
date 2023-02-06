import { getModelForClass } from "@typegoose/typegoose";
import { AdminOptions } from "./AdminOptions";
import { AppUser, NotificationsSettings } from "./AppUser";
import { Dispositif, DispositifId } from "./Dispositif";
import { Error } from "./Error";
import { Image } from "./Image";
import { Indicator } from "./Indicator";
import { Langue, LangueId } from "./Langue";
import { Log } from "./Log";
import { MailEvent } from "./MailEvent";
import { Need, NeedId } from "./Need";
import { Notification } from "./Notification";
import { Role } from "./Role";
import { Structure, StructureId } from "./Structure";
import { Theme, ThemeId } from "./Theme";
import { Traductions, TraductionId } from "./Traductions";
import { User, UserId } from "./User";
import { Widget } from "./Widget";

export const AdminOptionsModel = getModelForClass(AdminOptions);
export const AppUserModel = getModelForClass(AppUser);
export const DispositifModel = getModelForClass(Dispositif);
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
  DispositifId,
  Error,
  Image,
  Indicator,
  Langue,
  LangueId,
  Log,
  MailEvent,
  Need,
  NeedId,
  Notification,
  NotificationsSettings,
  Role,
  Structure,
  StructureId,
  Theme,
  ThemeId,
  Traductions,
  TraductionId,
  User,
  UserId,
  Widget
};

export * from "./generics";
