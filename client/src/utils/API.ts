import axios, { AxiosResponse, Canceler } from "axios";

import setAuthToken from "./setAuthToken";
import Swal from "sweetalert2";
import { logger } from "../logger";
import isInBrowser from "lib/isInBrowser";
import {
  APIResponse,
  NbDispositifsByRegion,
  TranslationFacets,
  TranslationStatistics,
} from "types/interface";
import {
  Id,
  PostAdminOptionResponse,
  GetAdminOptionResponse,
  GetDispositifResponse,
  AdminOptionRequest,
  PostImageResponse,
  GetLogResponse,
  ImprovementsRequest,
  SubscriptionRequest,
  AddContactRequest,
  GetNeedResponse,
  UpdatePositionsNeedResponse,
  NeedRequest,
  UpdatePositionsRequest,
  GetThemeResponse,
  PostThemeResponse,
  ThemeRequest,
  GetWidgetResponse,
  PostWidgetResponse,
  PatchWidgetResponse,
  WidgetRequest,
  DownloadAppRequest,
  ContentLinkRequest,
  SendNotificationsRequest,
  TtsRequest,
  GetUserInfoResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  GetDispositifsRequest,
  GetDispositifsResponse,
  GetAllStructuresResponse,
  GetAllDispositifsResponse,
  CountDispositifsRequest,
  GetCountDispositifsResponse,
  AdminCommentsRequest,
  GetUserContributionsResponse,
  GetUserFavoritesResponse,
  UserFavoritesRequest,
  GetStructureResponse,
  GetStructureStatisticsResponse,
  GetStructureStatisticsRequest,
  GetLanguagesResponse,
  AddViewsRequest,
  MainSponsorRequest,
  DispositifStatusRequest,
  GetActiveStructuresResponse,
  GetActiveUsersResponse,
  GetAllUsersResponse,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  CreateDispositifRequest,
  AddUserFavorite,
  DeleteUserFavorite,
  GetUserStatisticsResponse,
  UpdatePasswordResponse,
  UpdatePasswordRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  LoginRequest,
  LoginResponse,
  NewPasswordRequest,
  NewPasswordResponse,
  UpdateUserRequest,
} from "api-types";

const burl = process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL;

type Response<T = any> = AxiosResponse<{ text: string; data: T }>;

//@ts-ignore
axios.withCredentials = true;
const instance = axios.create({
  baseURL: burl || "",
});

instance.interceptors.request.use(
  (request) => request,
  (error) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: (error.response.data || {}).text || "",
      footer: "<i>" + error.message + "</i>",
      timer: 1500,
    });

    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status < 500) {
      if (error.response.data.data !== "no-alert") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: (error.response.data || {}).text || "",
          footer: "<i>" + error.message + "</i>",
          timer: 1500,
        });
      }
    } else if (axios.isCancel(error)) {
      logger.error("Error: ", { error: error.message });
    }
    return Promise.reject(error);
  },
);

const CancelToken = axios.CancelToken;
let cancel: Canceler;

const getHeaders = () => {
  const headers: any = {
    "Content-Type": "application/json",
    "site-secret": process.env.NEXT_PUBLIC_REACT_APP_SITE_SECRET || "",
  };

  const token = isInBrowser() ? localStorage.getItem("token") : undefined;
  if (token) headers["x-access-token"] = token;

  return headers;
};

const API = {
  // Auth
  login: (body: LoginRequest): Promise<APIResponse<LoginResponse>> => {
    const headers = getHeaders();
    return instance.post("/user/login", body, { headers });
  },
  checkUserExists: (username: string): Promise<APIResponse> => {
    return instance.get(`/user/exists?username=${username}`);
  },
  updatePassword: (id: Id, body: UpdatePasswordRequest): Promise<APIResponse<UpdatePasswordResponse>> => {
    const headers = getHeaders();
    return instance.patch(`/user/${id}/password`, body, { headers });
  },
  resetPassword: (body: ResetPasswordRequest): Promise<APIResponse<ResetPasswordResponse>> => {
    return instance.post("/user/password/reset", body);
  },
  checkResetToken: (token: String): Promise<APIResponse> => {
    return instance.get(`/user/password/reset?token=${token}`);
  },
  setNewPassword: (body: NewPasswordRequest): Promise<APIResponse<NewPasswordResponse>> => {
    const headers = getHeaders();
    return instance.post("/user/password/new", body, { headers });
  },
  isAuth: () => {
    if (!isInBrowser()) return false;
    return localStorage.getItem("token") !== null;
  },
  logout: () => {
    setAuthToken("");
    return localStorage.removeItem("token");
  },

  // User
  getUser: (): Promise<APIResponse<GetUserInfoResponse>> => {
    const headers = getHeaders();
    return instance.get("/user/get_user_info", { headers });
  },
  updateUser: (id: Id, body: UpdateUserRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/user/${id}`, body, { headers });
  },
  deleteUser: (query: Id): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.delete(`/user/${query}`, { headers });
  },
  getUserContributions: (): Promise<APIResponse<GetUserContributionsResponse>> => {
    const headers = getHeaders();
    return instance.get("/dispositifs/user-contributions", { headers });
  },
  getUserFavorites: (query: UserFavoritesRequest): Promise<APIResponse<GetUserFavoritesResponse>> => {
    const headers = getHeaders();
    return instance.get(`/user/favorites?locale=${query.locale}`, { headers });
  },
  addUserFavorite: (body: AddUserFavorite): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.put("/user/favorites", body, { headers });
  },
  deleteUserFavorites: (query: DeleteUserFavorite): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.delete("/user/favorites", { params: query, headers });
  },

  // Users
  getUsersStatistics: (): Promise<APIResponse<GetUserStatisticsResponse>> => {
    const headers = getHeaders();
    return instance.get("/user/statistics", { headers });
  },
  getActiveUsers: (): Promise<APIResponse<GetActiveUsersResponse[]>> => {
    const headers = getHeaders();
    return instance.get("/user/actives", { headers });
  },
  getAllUsers: (): Promise<APIResponse<GetAllUsersResponse[]>> => {
    const headers = getHeaders();
    return instance.get("/user/all", { headers });
  },

  // Dispositif
  getDispositif: (id: string, locale: string): Promise<APIResponse<GetDispositifResponse>> => {
    const headers = getHeaders();
    return instance.get(`/dispositifs/${id}?locale=${locale}`, { headers });
  },
  countDispositifs: (query: CountDispositifsRequest): Promise<APIResponse<GetCountDispositifsResponse>> => {
    const headers = getHeaders();
    return instance.get("/dispositifs/count", { params: query, headers });
  },
  updateDispositifReactions: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateDispositifReactions", query, {
      headers,
    });
  },
  updateDispositifStatus: (id: Id, body: DispositifStatusRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/dispositifs/${id}/status`, body, { headers });
  },
  updateDispositifTagsOrNeeds: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateDispositifTagsOrNeeds", query, {
      headers,
    });
  },
  updateDispositifMainSponsor: (id: string, body: MainSponsorRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/dispositifs/${id}/main-sponsor`, body, { headers });
  },
  updateDispositifAdminComments: (id: string, body: AdminCommentsRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/dispositifs/${id}/admin-comments`, body, { headers });
  },
  getDispositifsWithTranslationAvancement: (locale: string) => {
    const headers = getHeaders();
    return instance.get(`/dispositifs/getDispositifsWithTranslationAvancement?locale=${locale}`, { headers });
  },
  getDispositifs: (query: GetDispositifsRequest): Promise<APIResponse<GetDispositifsResponse[]>> => {
    return instance.get("/dispositifs", { params: query });
  },
  getAllDispositifs: (): Promise<APIResponse<GetAllDispositifsResponse[]>> => {
    const headers = getHeaders();
    return instance.get("/dispositifs/all", { headers });
  },
  getNbDispositifsByRegion: (): Promise<Response<NbDispositifsByRegion>> => {
    return instance.get("/dispositifs/getNbDispositifsByRegion");
  },
  addDispositifViews: (id: string, body: AddViewsRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post(`/dispositifs/${id}/view`, body, { headers });
  },
  getDispositifsStatistics: (query: GetStatisticsRequest): Promise<APIResponse<GetStatisticsResponse>> => {
    const headers = getHeaders();
    return instance.get("/dispositifs/statistics", { params: query, headers });
  },
  updateDispositifProperties: (id: Id, body: UpdateDispositifPropertiesRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/dispositifs/${id}/properties`, body, { headers });
  },
  updateDispositif: (id: Id, body: UpdateDispositifRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/dispositifs/${id}`, body, { headers });
  },
  createDispositif: (body: CreateDispositifRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/dispositifs", body, { headers });
  },

  // Mail
  sendAdminImprovementsMail: (body: ImprovementsRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/mail/sendAdminImprovementsMail", body, {
      headers,
    });
  },
  sendSubscriptionReminderMail: (body: SubscriptionRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/mail/sendSubscriptionReminderMail", body, {
      headers,
    });
  },
  contacts: (body: AddContactRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/mail/contacts", body, { headers });
  },

  // Structure
  createStructure: (query: any) => {
    const headers = getHeaders();
    return instance.post("/structures/createStructure", query, {
      headers,
    });
  },
  updateStructure: (query: any) => {
    const headers = getHeaders();
    return instance.post("/structures/updateStructure", query, {
      headers,
    });
  },
  modifyUserRoleInStructure: (query: any) => {
    const headers = getHeaders();
    return instance.post("/structures/modifyUserRoleInStructure", query, {
      headers,
    });
  },
  getStructureById: (id: string, locale: string): Promise<APIResponse<GetStructureResponse>> => {
    const headers = getHeaders();
    return instance.get(`/structures/${id}?locale=${locale}`, { headers });
  },
  getActiveStructures: (): Promise<APIResponse<GetActiveStructuresResponse[]>> => {
    return instance.get("/structures/getActiveStructures");
  },
  getAllStructures: (): Promise<APIResponse<GetAllStructuresResponse[]>> => {
    const headers = getHeaders();
    return instance.get("/structures/all", { headers });
  },
  getStructuresStatistics: (
    query: GetStructureStatisticsRequest,
  ): Promise<APIResponse<GetStructureStatisticsResponse>> => {
    return instance.get("/structures/statistics", { params: query });
  },

  // Needs
  getNeeds: (): Promise<APIResponse<GetNeedResponse>> => {
    return instance.get("/needs");
  },
  postNeeds: (body: NeedRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/needs", body, { headers });
  },
  patchNeed: (id: Id, body: Partial<NeedRequest>): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/needs/${id}`, body, { headers });
  },
  orderNeeds: (body: UpdatePositionsRequest): Promise<APIResponse<UpdatePositionsNeedResponse[]>> => {
    const headers = getHeaders();
    return instance.post("/needs/positions", body, { headers });
  },
  deleteNeed: (query: Id): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.delete(`/needs/${query}`, { headers });
  },

  // Themes
  getThemes: (): Promise<APIResponse<GetThemeResponse[]>> => {
    return instance.get("/themes");
  },
  postThemes: (body: ThemeRequest): Promise<APIResponse<PostThemeResponse>> => {
    const headers = getHeaders();
    return instance.post("/themes", body, { headers });
  },
  patchTheme: (id: Id, body: Partial<ThemeRequest>) => {
    const headers = getHeaders();
    return instance.patch(`/themes/${id}`, body, { headers });
  },
  deleteTheme: (query: Id): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.delete(`/themes/${query}`, { headers });
  },

  // Widgets
  getWidgets: (): Promise<APIResponse<GetWidgetResponse>> => {
    const headers = getHeaders();
    return instance.get("/widgets", { headers });
  },
  postWidgets: (body: WidgetRequest): Promise<APIResponse<PostWidgetResponse>> => {
    const headers = getHeaders();
    return instance.post("/widgets", body, { headers });
  },
  patchWidget: (id: Id, body: Partial<WidgetRequest>): Promise<APIResponse<PatchWidgetResponse>> => {
    const headers = getHeaders();
    return instance.patch(`/widgets/${id}`, body, { headers });
  },
  deleteWidget: (query: Id): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.delete(`/widgets/${query}`, { headers });
  },

  // Export
  exportUsers: (): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/user/export", {}, { headers });
  },
  exportFiches: () => {
    const headers = getHeaders();
    return instance.post("/dispositifs/exportFiches", {}, { headers });
  },
  exportDispositifsGeolocalisation: () => {
    const headers = getHeaders();
    return instance.post("/dispositifs/exportDispositifsGeolocalisation", {}, { headers });
  },

  // Trads

  saveTraduction: (query: { dispositifId: string; timeSpent: number; translated: any /*TODO*/; language: string }) => {
    const headers = getHeaders();
    return instance.post("/traduction", query, {
      headers,
    });
  },

  add_tradForReview: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/add_tradForReview", query, {
      headers,
    });
  },
  getTraductionsForReview: ({ dispositif, language }: { dispositif: string; language: string }) => {
    const headers = getHeaders();
    return instance.get(`/traduction/for_review?dispositif=${dispositif}&language=${language}`, {
      headers,
    });
  },
  getDefaultTraductionForDispositif: ({ dispositif }: { dispositif: string }) => {
    const headers = getHeaders();
    return instance.get(`/traduction?dispositif=${dispositif}`, {
      headers,
    });
  },
  get_tradForReview: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/get_tradForReview", query, {
      headers,
    });
  },
  validateTranslations: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/validateTranslations", query, {
      headers,
    });
  },
  delete_trads: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/delete_trads", query, {
      headers,
    });
  },
  get_progression: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/get_progression", query, {
      headers,
    });
  },
  update_tradForReview: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/update_tradForReview", query, {
      headers,
    });
  },
  get_translation: (query = {}) => {
    const headers = getHeaders();
    return instance.post("/traduction/translate", query, {
      headers,
    });
  },
  getTranslationStatistics: (facets?: TranslationFacets[]): Promise<Response<TranslationStatistics>> => {
    return instance.get("/traduction/statistics", { params: { facets } });
  },

  // langues
  getLanguages: (): Promise<APIResponse<GetLanguagesResponse>> => {
    return instance.get("/langues");
  },

  // Misc
  postImage: (query: any): Promise<APIResponse<PostImageResponse>> => {
    const headers = getHeaders();
    return instance.post("/images", query, { headers });
  },
  // Logs
  logs: (id: Id): Promise<APIResponse<GetLogResponse[]>> => {
    const headers = getHeaders();
    return instance.get(`/logs?id=${id}`, { headers });
  },

  // Notifications
  sendNotification: (body: SendNotificationsRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/notifications/send", body, { headers });
  },

  // AdminOptions
  getAdminOption: (key: string): Promise<APIResponse<GetAdminOptionResponse>> => {
    const headers = getHeaders();
    return instance.get(`/options/${key}`, { headers });
  },
  setAdminOption: (key: string, body: AdminOptionRequest): Promise<APIResponse<PostAdminOptionResponse>> => {
    const headers = getHeaders();
    return instance.post(`/options/${key}`, body, { headers });
  },

  // tts
  getTts: (body: TtsRequest): Promise<APIResponse<any>> => {
    const headers = getHeaders();
    return instance.post("/tts", body, {
      headers,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    });
  },
  cancel_tts_subscription: () => cancel && cancel(),

  // sms
  smsDownloadApp: (body: DownloadAppRequest): Promise<APIResponse> => {
    return instance.post("/sms/download-app", body)
  },
  smsContentLink: (body: ContentLinkRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/sms/content-link", body, { headers });
  },
};

export default API;
