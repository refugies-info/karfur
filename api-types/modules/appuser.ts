import { Languages } from "../generics";

/**
 * @url POST /appuser
 */
export interface AppUserRequest {
  city?: string;
  department?: string | null;
  selectedLanguage?: Languages;
  age?: string;
  frenchLevel?: string;
  expoPushToken?: string;
}

/**
 * @url POST /appuser/notification_settings
 */
export interface NotificationSettingsRequest {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes?: {
    [key: string]: boolean;
  };
}

/**
 * @url POST /appuser
 */
export interface PostAppUserResponse {
  uid: string;
  city?: string;
  department?: string;
  selectedLanguage?: string;
  age?: string;
  frenchLevel?: string;
  expoPushToken?: string;
  notificationsSettings?: {
    global: boolean;
    local: boolean;
    demarches: boolean;
    themes: {
      [key: string]: boolean;
    };
  };
}

/**
 * @url GET /appuser/notification_settings
 */
export interface GetNotificationsSettingsResponse {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: {
    [key: string]: boolean;
  };
}

/**
 * @url POST /appuser/notification_settings
 */
export interface PostNotificationsSettingsResponse {
  global: boolean;
  local: boolean;
  demarches: boolean;
  themes: {
    [key: string]: boolean;
  };
}
