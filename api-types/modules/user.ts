import { Id, Picture, SimpleDispositif, UserStructure } from "../generics";

/**
 * @url POST /user/login
 */
export interface LoginRequest {
  username: string;
  password: string;
  code?: string;
  email?: string;
  phone?: string;
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
  locale: string
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
  username: string;
}

/**
 * @url POST /user/password/new
 */
export interface NewPasswordRequest {
  newPassword: string;
  reset_password_token: string;
  code?: string;
  email?: string;
  phone?: string;
}

/**
 * @url PATCH /user/{id}
 */
export interface UpdateUserRequest {
  user: {
    roles?: Id[];
    email?: string;
    phone?: string;
    code?: string;
    username?: string;
    picture?: Picture;
    adminComments?: string;
    selectedLanguages?: Id[];
  },
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
  roles: { _id: string; nom: string; nomPublic: string }[];
  selectedLanguages: string[];
  status: "Actif" | "Exclu"; // FIXME : UserStatus does not work with tsoa
  structures: string[];
  traductionsFaites: string[];
  username: string;
  picture?: Picture;
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
}

/**
 * @url GET /user/actives
 */
export interface GetActiveUsersResponse {
  _id: Id;
  username: string;
  picture: Picture;
  status: string;
  email: string;
}

/**
 * @url GET /user/all
 */
export interface GetAllUsersResponse {
  _id: Id;
  username: string;
  picture?: Picture;
  status?: string;
  created_at?: Date;
  roles?: string[];
  email?: string;
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
