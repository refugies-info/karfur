export * from "./generics";
export * from "./modules/misc";

// adminOption
import { AdminOptionRequest, GetAdminOptionResponse, PostAdminOptionResponse } from "./modules/adminOption";

// appusers
import {
  AppUserRequest,
  NotificationSettingsRequest,
  PostAppUserResponse,
  GetNotificationsSettingsResponse,
  PostNotificationsSettingsResponse,
} from "./modules/appuser";

// dispositifs
import {
  AddSuggestionDispositifRequest,
  AddViewsRequest,
  AdminCommentsRequest,
  ContentForApp,
  CountDispositifsRequest,
  CreateDispositifRequest,
  DispositifStatusRequest,
  DispositifThemeNeedsRequest,
  GetAllDispositifsResponse,
  GetContentsForAppRequest,
  GetContentsForAppResponse,
  GetCountDispositifsResponse,
  GetDispositifResponse,
  GetDispositifsHasTextChanges,
  GetDispositifsRequest,
  GetDispositifsResponse,
  GetNbContentsForCountyRequest,
  GetNbContentsForCountyResponse,
  GetRegionStatisticsResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  GetUserContributionsResponse,
  MainSponsorRequest,
  MobileFrenchLevel,
  PostDispositifsResponse,
  PublishDispositifRequest,
  ReadSuggestionDispositifRequest,
  StructureReceiveDispositifRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  UpdateDispositifResponse,
  ViewsType,
} from "./modules/dispositif";

// images
import { PostImageResponse } from "./modules/image";

// langues
import { GetLanguagesResponse } from "./modules/language";

// logs
import { GetLogResponse } from "./modules/log";

// mail
import { ImprovementsRequest, SubscriptionRequest, AddContactRequest } from "./modules/mail";

// needs
import {
  NeedRequest,
  NeedTranslation,
  UpdatePositionsRequest,
  GetNeedResponse,
  UpdatePositionsNeedResponse,
} from "./modules/need";

// notifications
import { MarkAsSeenRequest, SendNotificationsRequest, GetNotificationResponse } from "./modules/notification";

// search
import { UpdateIndexResponse } from "./modules/search";

// sms
import { DownloadAppRequest, ContentLinkRequest } from "./modules/sms";

// structures
import {
  GetStructureStatisticsRequest,
  PostStructureRequest,
  PatchStructureRequest,
  PatchStructureRolesRequest,
  GetAllStructuresResponse,
  GetStructureResponse,
  GetStructureStatisticsResponse,
  GetActiveStructuresResponse,
} from "./modules/structure";

// translations
export * from "./modules/translations";

// themes
import { ThemeRequest, GetThemeResponse, PostThemeResponse, PatchThemeResponse } from "./modules/theme";

// tts
import { TtsRequest } from "./modules/tts";

// user
import {
  GetUserInfoResponse,
  GetUserFavoritesRequest,
  AddUserFavoriteRequest,
  DeleteUserFavoriteRequest,
  UpdatePasswordRequest,
  ResetPasswordRequest,
  LoginRequest,
  SelectedLanguagesRequest,
  NewPasswordRequest,
  UpdateUserRequest,
  GetUserFavoritesResponse,
  GetActiveUsersResponse,
  GetAllUsersResponse,
  GetUserStatisticsResponse,
  UpdatePasswordResponse,
  ResetPasswordResponse,
  LoginResponse,
  NewPasswordResponse,
} from "./modules/user";

// widgets
import { WidgetRequest, GetWidgetResponse, PostWidgetResponse, PatchWidgetResponse } from "./modules/widget";

// enums
export type {
  // adminOptions
  AdminOptionRequest,
  GetAdminOptionResponse,
  PostAdminOptionResponse,

  // appusers
  AppUserRequest,
  NotificationSettingsRequest,
  PostAppUserResponse,
  GetNotificationsSettingsResponse,
  PostNotificationsSettingsResponse,

  // dispositifs
  AddSuggestionDispositifRequest,
  AddViewsRequest,
  AdminCommentsRequest,
  ContentForApp,
  CountDispositifsRequest,
  CreateDispositifRequest,
  DispositifStatusRequest,
  DispositifThemeNeedsRequest,
  GetAllDispositifsResponse,
  GetContentsForAppRequest,
  GetContentsForAppResponse,
  GetCountDispositifsResponse,
  GetDispositifResponse,
  GetDispositifsHasTextChanges,
  GetDispositifsRequest,
  GetDispositifsResponse,
  GetNbContentsForCountyRequest,
  GetNbContentsForCountyResponse,
  GetRegionStatisticsResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  GetUserContributionsResponse,
  MainSponsorRequest,
  PostDispositifsResponse,
  PublishDispositifRequest,
  ReadSuggestionDispositifRequest,
  StructureReceiveDispositifRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  UpdateDispositifResponse,

  // images
  PostImageResponse,

  // langues
  GetLanguagesResponse,

  // logs
  GetLogResponse,

  // mail
  ImprovementsRequest,
  SubscriptionRequest,
  AddContactRequest,

  // needs
  GetNeedResponse,
  NeedRequest,
  NeedTranslation,
  UpdatePositionsNeedResponse,
  UpdatePositionsRequest,

  // notifications
  MarkAsSeenRequest,
  SendNotificationsRequest,
  GetNotificationResponse,

  // search
  UpdateIndexResponse,

  // sms
  DownloadAppRequest,
  ContentLinkRequest,

  // structures
  GetAllStructuresResponse,
  GetStructureResponse,
  GetStructureStatisticsRequest,
  GetStructureStatisticsResponse,
  GetActiveStructuresResponse,
  PostStructureRequest,
  PatchStructureRequest,
  PatchStructureRolesRequest,

  // themes
  ThemeRequest,
  GetThemeResponse,
  PostThemeResponse,
  PatchThemeResponse,

  // tts
  TtsRequest,

  // user
  GetUserInfoResponse,
  GetUserFavoritesRequest,
  GetUserFavoritesResponse,
  GetActiveUsersResponse,
  GetAllUsersResponse,
  AddUserFavoriteRequest,
  DeleteUserFavoriteRequest,
  GetUserStatisticsResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LoginRequest,
  LoginResponse,
  NewPasswordRequest,
  NewPasswordResponse,
  UpdateUserRequest,
  SelectedLanguagesRequest,

  // widgets
  WidgetRequest,
  GetWidgetResponse,
  PostWidgetResponse,
  PatchWidgetResponse,
};

export { MobileFrenchLevel, ViewsType };
