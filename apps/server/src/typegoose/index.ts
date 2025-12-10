import { getModelForClass, Severity, setGlobalOptions } from "@typegoose/typegoose";

setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });

import { AdminOptions } from "./AdminOptions";
import type { AppUser, AppUserType, NotificationsSettings } from "./AppUser";
import { Dispositif, type DispositifId } from "./Dispositif";
import { Error } from "./Error";
import { Image } from "./Image";
import { Indicator } from "./Indicator";
import type { Langue, LangueId } from "./Langue";
import { Log, type LogId } from "./Log";
import { MailEvent } from "./MailEvent";
import type { Need, NeedId, NeedType } from "./Need";
import { Notification } from "./Notification";
import type { Role } from "./Role";
import { Snapshot, type SnapshotType } from "./Snapshot";
import type { Structure, StructureId } from "./Structure";
import type { Theme, ThemeId, ThemeType } from "./Theme";
import {
  type TraductionDiff,
  type TraductionId,
  Traductions,
  TraductionsStatus,
} from "./Traductions";
import type { User, UserId } from "./User";
import { Widget, type WidgetId } from "./Widget";

export const AdminOptionsModel = getModelForClass(AdminOptions);
export { AppUserModel } from "@refugies-info/mongo";
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
export const SnapshotModel = getModelForClass(Snapshot);
export const ErrorModel = getModelForClass(Error);
export const ImageModel = getModelForClass(Image);
export const IndicatorModel = getModelForClass(Indicator);
export { LangueModel } from "@refugies-info/mongo";
export const LogModel = getModelForClass(Log);
export const MailEventModel = getModelForClass(MailEvent);
export { NeedModel } from "@refugies-info/mongo";
export const NotificationModel = getModelForClass(Notification);
export { RoleModel, StructureModel, ThemeModel } from "@refugies-info/mongo";
export const TraductionsModel = getModelForClass(Traductions);
export { UserModel } from "@refugies-info/mongo";
export const WidgetModel = getModelForClass(Widget);

export {
  AdminOptions,
  Dispositif,
  Error,
  Image,
  Indicator,
  Log,
  Notification,
  Snapshot,
  Traductions,
  TraductionsStatus,
  Widget,
};

export type {
  AppUser,
  AppUserType,
  DispositifId,
  Langue,
  LangueId,
  LogId,
  Need,
  NeedId,
  NeedType,
  NotificationsSettings,
  Role,
  SnapshotType,
  Structure,
  StructureId,
  Theme,
  ThemeId,
  ThemeType,
  TraductionDiff,
  TraductionId,
  User,
  UserId,
  WidgetId,
};

export * from "./generics";
