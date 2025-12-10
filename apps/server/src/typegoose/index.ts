import { getModelForClass, Severity, setGlobalOptions } from "@typegoose/typegoose";

setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });

import type { AdminOptions, AdminOptionsId, AdminOptionsType } from "./AdminOptions";
import type { AppUser, AppUserType, NotificationsSettings } from "./AppUser";
import { Dispositif, type DispositifId } from "./Dispositif";
import type { Error, ErrorId, ErrorType } from "./Error";
import type { CloudinaryImage, CloudinaryImageId, CloudinaryImageType } from "./Image";
import type { Indicator, IndicatorId, IndicatorType } from "./Indicator";
import type { Langue, LangueId } from "./Langue";
import { Log, type LogId } from "./Log";
import type { MailEvent, MailEventId, MailEventType } from "./MailEvent";
import type { Need, NeedId, NeedType } from "./Need";
import type { Notification, NotificationId, NotificationType } from "./Notification";
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

export { AdminOptionsModel, AppUserModel } from "@refugies-info/mongo";
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
export {
  CloudinaryImageModel,
  ErrorModel,
  IndicatorModel,
  LangueModel,
  MailEventModel,
  NeedModel,
  NotificationModel,
} from "@refugies-info/mongo";
export const LogModel = getModelForClass(Log);
export { RoleModel, StructureModel, ThemeModel } from "@refugies-info/mongo";
export const TraductionsModel = getModelForClass(Traductions);
export { UserModel } from "@refugies-info/mongo";
export const WidgetModel = getModelForClass(Widget);

export { Dispositif, Log, Snapshot, Traductions, TraductionsStatus, Widget };

export type {
  AdminOptions,
  AdminOptionsId,
  AdminOptionsType,
  AppUser,
  AppUserType,
  CloudinaryImage,
  CloudinaryImageId,
  CloudinaryImageType,
  DispositifId,
  Error,
  ErrorId,
  ErrorType,
  Indicator,
  IndicatorId,
  IndicatorType,
  Langue,
  LangueId,
  LogId,
  MailEvent,
  MailEventId,
  MailEventType,
  Need,
  NeedId,
  NeedType,
  Notification,
  NotificationId,
  NotificationType,
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
