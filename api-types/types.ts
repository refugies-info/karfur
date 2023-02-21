import { Id, TranslatedText, UserStructure, ContentStructure, SimpleUser, StructureMember, InfoSections } from "../server/src/types/interface";

// adminOptions
import { AdminOptionRequest } from "../server/src/controllers/AdminOptionController";
import { GetAdminOptionResponse } from "../server/src/workflows/adminOption/getAdminOptions";
import { PostAdminOptionResponse } from "../server/src/workflows/adminOption/postAdminOptions";

// dispositifs
import {
  GetDispositifsRequest,
  GetStatisticsRequest,
  CountDispositifsRequest,
  AdminCommentsRequest,
  AddViewsRequest,
  MainSponsorRequest,
  DispositifStatusRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  CreateDispositifRequest
} from "../server/src/controllers/dispositifController";
import { GetDispositifResponse } from "../server/src/workflows/dispositif/getContentById";
import { GetDispositifsResponse } from "../server/src/workflows/dispositif/getDispositifs";
import { GetStatisticsResponse } from "../server/src/workflows/dispositif/getStatistics";
import { GetAllDispositifsResponse } from "../server/src/workflows/dispositif/getAllDispositifs";
import { GetCountDispositifsResponse } from "../server/src/workflows/dispositif/getCountDispositifs";
import { GetUserContributionsResponse } from "../server/src/workflows/dispositif/getUserContributions";

// images
import { PostImageResponse } from "../server/src/workflows/images/postImages";

// langues
import { GetLanguagesResponse } from "../server/src/workflows/langues/getLanguages";

// logs
import { GetLogResponse } from "../server/src/workflows/log/getLogs";

// mail
import {
  ImprovementsRequest,
  SubscriptionRequest,
  AddContactRequest
} from "../server/src/controllers/mailController"

// needs
import {
  NeedRequest,
  UpdatePositionsRequest
} from "../server/src/controllers/needController";
import { GetNeedResponse } from "../server/src/workflows/needs/getNeeds";
import { UpdatePositionsNeedResponse } from "../server/src/workflows/needs/updatePositions";

// notifications
import { SendNotificationsRequest } from "../server/src/controllers/notificationsController";

// sms
import {
  DownloadAppRequest, ContentLinkRequest
} from "../server/src/controllers/smsController";

// structures
import { GetStructureStatisticsRequest } from "../server/src/controllers/structureController";
import { GetAllStructuresResponse } from "../server/src/workflows/structure/getAllStructures";
import { GetStructureResponse } from "../server/src/workflows/structure/getStructureById";
import { GetStructureStatisticsResponse } from "../server/src/workflows/structure/getStatistics";
import { GetActiveStructuresResponse } from "../server/src/workflows/structure/getActiveStructures";

// themes
import { ThemeRequest } from "../server/src/controllers/themeController";
import { GetThemeResponse } from "../server/src/workflows/themes/getThemes";
import { PostThemeResponse } from "../server/src/workflows/themes/postThemes";
import { PatchThemeResponse } from "../server/src/workflows/themes/patchTheme";

// tts
import { TtsRequest } from "../server/src/controllers/ttsController";

// user
import { GetUserInfoResponse, UserFavoritesRequest, AddUserFavorite, DeleteUserFavorite, UpdatePasswordRequest, ResetPasswordRequest } from "../server/src/controllers/userController";
import { GetUserFavoritesResponse } from "../server/src/workflows/users/getUserFavoritesInLocale";
import { GetActiveUsersResponse } from "../server/src/workflows/users/getActiveUsers";
import { GetAllUsersResponse } from "../server/src/workflows/users/getAllUsers";
import { GetUserStatisticsResponse } from "../server/src/workflows/users/getFiguresOnUsers";
import { UpdatePasswordResponse } from "../server/src/workflows/users/changePassword";
import { ResetPasswordResponse } from "../server/src/workflows/users/resetPassword";

// widgets
import { WidgetRequest } from "../server/src/controllers/widgetController";
import { GetWidgetResponse } from "../server/src/workflows/widget/getWidgets";
import { PostWidgetResponse } from "../server/src/workflows/widget/postWidgets";
import { PatchWidgetResponse } from "../server/src/workflows/widget/patchWidget";

export type {
  // generics
  Id,
  InfoSections,
  TranslatedText,
  UserStructure,
  ContentStructure,
  SimpleUser,
  StructureMember,

  // adminOptions
  AdminOptionRequest,
  GetAdminOptionResponse,
  PostAdminOptionResponse,

  // dispositifs
  GetStatisticsRequest,
  GetDispositifsRequest,
  GetDispositifResponse,
  GetDispositifsResponse,
  GetStatisticsResponse,
  GetAllDispositifsResponse,
  CountDispositifsRequest,
  GetCountDispositifsResponse,
  AdminCommentsRequest,
  GetUserContributionsResponse,
  AddViewsRequest,
  MainSponsorRequest,
  DispositifStatusRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  CreateDispositifRequest,

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
  NeedRequest,
  UpdatePositionsRequest,
  GetNeedResponse,
  UpdatePositionsNeedResponse,

  // notifications
  SendNotificationsRequest,

  // sms
  DownloadAppRequest,
  ContentLinkRequest,

  // structures
  GetAllStructuresResponse,
  GetStructureResponse,
  GetStructureStatisticsRequest,
  GetStructureStatisticsResponse,
  GetActiveStructuresResponse,

  // themes
  ThemeRequest,
  GetThemeResponse,
  PostThemeResponse,
  PatchThemeResponse,

  // tts
  TtsRequest,

  // user
  GetUserInfoResponse,
  UserFavoritesRequest,
  GetUserFavoritesResponse,
  GetActiveUsersResponse,
  GetAllUsersResponse,
  AddUserFavorite,
  DeleteUserFavorite,
  GetUserStatisticsResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,

  // widgets
  WidgetRequest,
  GetWidgetResponse,
  PostWidgetResponse,
  PatchWidgetResponse,
};
