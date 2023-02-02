import { getModelForClass } from "@typegoose/typegoose";
import { AdminOptions } from "./AdminOptions";
import { AppUser } from "./AppUser";
import { Dispositif } from "./Dispositif";
import { Error } from "./Error";
import { Image } from "./Image";
import { Indicator } from "./Indicator";
import { Langue } from "./Langue";
import { Log } from "./Log";
import { MailEvent } from "./MailEvent";
import { Need } from "./Need";
import { Notification } from "./Notification";
import { Role } from "./Role";
import { Structure } from "./Structure";
import { Theme } from "./Theme";
import { Traductions } from "./Traductions";
import { User } from "./User";
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
  Error,
  Image,
  Indicator,
  Langue,
  Log,
  MailEvent,
  Need,
  Notification,
  Role,
  Structure,
  Theme,
  Traductions,
  User,
  Widget
};
