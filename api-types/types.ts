import { Id, TranslatedText } from "../server/src/types/interface";

// adminOptions
import { AdminOptionRequest } from "../server/src/controllers/AdminOptionController";
import { GetAdminOptionResponse } from "../server/src/workflows/adminOption/getAdminOptions";
import { PostAdminOptionResponse } from "../server/src/workflows/adminOption/postAdminOptions";

// dispositifs
import { GetDispositifsRequest, GetStatisticsRequest } from "../server/src/controllers/dispositifController";
import { GetDispositifResponse, InfoSections } from "../server/src/workflows/dispositif/getContentById";
import { GetDispositifsResponse } from "../server/src/workflows/dispositif/getDispositifs";
import { GetStatisticsResponse } from "../server/src/workflows/dispositif/getStatistics";
import { GetAllDispositifsResponse } from "../server/src/workflows/dispositif/getAllDispositifs";

// images
import { PostImageResponse } from "../server/src/workflows/images/postImages";

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
import { PatchNeedResponse } from "../server/src/workflows/needs/patchNeed";
import { UpdatePositionsNeedResponse } from "../server/src/workflows/needs/updatePositions";

// notifications
import { SendNotificationsRequest } from "../server/src/controllers/notificationsController";

// sms
import {
  DownloadAppRequest, ContentLinkRequest
} from "../server/src/controllers/smsController";

// structures
import { GetAllStructuresResponse } from "../server/src/workflows/structure/getAllStructures";

// themes
import { ThemeRequest } from "../server/src/controllers/themeController";
import { GetThemeResponse } from "../server/src/workflows/themes/getThemes";
import { PostThemeResponse } from "../server/src/workflows/themes/postThemes";
import { PatchThemeResponse } from "../server/src/workflows/themes/patchTheme";

// tts
import { TtsRequest } from "../server/src/controllers/ttsController";

// user
import { GetUserInfoResponse } from "../server/src/controllers/userController";

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

  // images
  PostImageResponse,

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
  PatchNeedResponse,
  UpdatePositionsNeedResponse,

  // notifications
  SendNotificationsRequest,

  // sms
  DownloadAppRequest,
  ContentLinkRequest,

  // structures
  GetAllStructuresResponse,

  // themes
  ThemeRequest,
  GetThemeResponse,
  PostThemeResponse,
  PatchThemeResponse,

  // tts
  TtsRequest,

  // user
  GetUserInfoResponse,

  // widgets
  WidgetRequest,
  GetWidgetResponse,
  PostWidgetResponse,
  PatchWidgetResponse,
};
