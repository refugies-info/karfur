import { Id, Picture, RoleName, SimpleDispositif, UserStatus, UserStructure } from "../generics";

interface AuthPassword {
  email: string;
  password: string;
}
interface AuthGoogle {
  authCode: string;
}
interface AuthMicrosoft {
  authCode: string | null; // null means we ask for the auth url
}

/**
 * @url POST /user/login
 */
export interface LoginRequest {
  authPassword?: AuthPassword;
  authGoogle?: AuthGoogle;
  authMicrosoft?: AuthMicrosoft;
  role?: RoleName.CONTRIB | RoleName.TRAD; // in case we need to create a new account with sso
}

/**
 * @url GET /user/exists
 */
export interface CheckUserExistsResponse {
  verificationCode: boolean;
}

/**
 * @url POST /user/check-code
 */
export interface CheckCodeRequest {
  code: string;
  email: string;
}

/**
 * @url POST /user/send-code
 */
export interface SendCodeRequest {
  email: string;
}

/**
 * @url POST /user/register
 */
export interface RegisterRequest {
  email: string;
  password: string;
  subscribeNewsletter?: boolean;
  firstName?: string;
  role?: RoleName.CONTRIB | RoleName.TRAD;
}

/**
 * @url POST /user/selected_languages
 */
export interface SelectedLanguagesRequest {
  selectedLanguages: Id[];
}

/**
 * @url GET /user/favorites
 */
export interface GetUserFavoritesRequest {
  locale: string;
}

/**
 * @url PUT /user/{id}/favorites
 */
export interface AddUserFavoriteRequest {
  dispositifId: string;
}

/**
 * @url DELETE /user/favorites
 */
export interface DeleteUserFavoriteRequest {
  dispositifId?: string;
  all?: boolean;
}

/**
 * @url PATCH /user/{id}/password
 */
export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * @url POST /user/password/reset
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * @url POST /user/password/new
 */
export interface NewPasswordRequest {
  newPassword: string;
  reset_password_token: string;
  code?: string;
}

/**
 * @url PATCH /user/{id}
 */
export interface UpdateUserRequest {
  user: {
    roles?: RoleName[];
    email?: string;
    phone?: string;
    code?: string;
    username?: string;
    firstName?: string;
    picture?: Picture;
    adminComments?: string;
    selectedLanguages?: string[];
    partner?: string;
    departments?: string[];
  };
  action: "modify-with-roles" | "modify-my-details";
}

/**
 * @url GET /user
 */
export interface GetUserInfoResponse {
  _id: Id;
  contributions: string[];
  email: string;
  phone: string;
  roles: { _id: string; nom: RoleName; nomPublic: string }[];
  selectedLanguages: string[];
  status: UserStatus;
  structures: string[];
  username?: string;
  firstName?: string;
  picture?: Picture;
  partner?: string;
  departments?: string[];
  favorites?: {
    dispositifId: Id;
    created_at: Date;
  }[];
}

/**
 * @url POST /user/login
 */
export interface LoginResponse {
  token: string;
  userCreated?: boolean;
}

/**
 * @url GET /user/actives
 */
export interface GetActiveUsersResponse {
  _id: Id;
  username?: string;
  picture: Picture;
  status: UserStatus;
  email: string;
}

/**
 * @url GET /user/all
 */
export interface GetAllUsersResponse {
  _id: Id;
  username?: string;
  picture?: Picture;
  status?: UserStatus;
  created_at?: Date;
  roles?: string[];
  email: string;
  phone?: string;
  selectedLanguages?: { langueCode: string; langueFr: string }[];
  structures?: UserStructure[];
  nbStructures: number;
  nbContributions: number;
  adminComments?: string;
}

/**
 * @url GET /user/statistics
 */
export interface GetUserStatisticsResponse {
  nbContributors: number;
  nbTraductors: number;
  nbExperts: number;
}

/**
 * @url POST /user/password/reset
 */
export interface ResetPasswordResponse {
  email: string;
}

/**
 * @url POST /user/password/new
 */
export interface NewPasswordResponse {
  token: string;
}

/**
 * @url GET /user/favorites
 */
export type GetUserFavoritesResponse = SimpleDispositif;

/**
 * @url PATCH /user/{id}/password
 */
export interface UpdatePasswordResponse {
  token: string;
}
