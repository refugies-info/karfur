import { getModelForClass, Severity, setGlobalOptions } from "@typegoose/typegoose";

setGlobalOptions({ options: { allowMixed: Severity.ALLOW } });

import { DispositifStatus } from "@refugies-info/api-types";

import type { AdminOptions, AdminOptionsId, AdminOptionsType } from "./AdminOptions";
import type { AppUser, AppUserType, NotificationsSettings } from "./AppUser";
import { Dispositif, type DispositifId } from "./Dispositif";
import type { Error, ErrorId, ErrorType } from "./Error";
import type { CloudinaryImage, CloudinaryImageId, CloudinaryImageType } from "./Image";
import type { Indicator, IndicatorId, IndicatorType } from "./Indicator";
import type { Langue, LangueId } from "./Langue";
import type { Log, LogId, LogType } from "./Log";
import type { MailEvent, MailEventId, MailEventType } from "./MailEvent";
import type { Need, NeedId, NeedType } from "./Need";
import type { Notification, NotificationId, NotificationType } from "./Notification";
import type { Role } from "./Role";
import type { Snapshot, SnapshotId, SnapshotType, SnapshotTypeObj } from "./Snapshot";
import type { Structure, StructureId } from "./Structure";
import type { Theme, ThemeId, ThemeType } from "./Theme";
import {
  type TraductionDiff,
  type TraductionId,
  type Traductions,
  TraductionsStatus,
  TraductionsType,
} from "./Traductions";
import type { User, UserId } from "./User";
import type { Widget, WidgetId, WidgetType } from "./Widget";

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
// export const SnapshotModel = getModelForClass(Snapshot);
// export const LogModel = getModelForClass(Log);
// export const TraductionsModel = getModelForClass(Traductions);
export {
  CloudinaryImageModel,
  ErrorModel,
  IndicatorModel,
  LangueModel,
  LogModel,
  MailEventModel,
  NeedModel,
  NotificationModel,
  RoleModel,
  SnapshotModel,
  StructureModel,
  ThemeModel,
  TraductionsModel,
  WidgetModel,
} from "@refugies-info/mongo";

export { Dispositif, DispositifStatus, TraductionsStatus, TraductionsType };
export type { Traductions };

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
  Log,
  LogId,
  LogType,
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
  Snapshot,
  SnapshotId,
  SnapshotType,
  SnapshotTypeObj,
  Structure,
  StructureId,
  Theme,
  ThemeId,
  ThemeType,
  TraductionDiff,
  TraductionId,
  User,
  UserId,
  Widget,
  WidgetId,
  WidgetType,
};

export * from "./generics";
