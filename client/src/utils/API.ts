import axios, { AxiosResponse, Canceler } from "axios";

import setAuthToken from "./setAuthToken";
import Swal from "sweetalert2";
import { logger } from "../logger";
import isInBrowser from "lib/isInBrowser";
import { APIResponse } from "types/interface";
import {
  AddContactRequest,
  AddSuggestionDispositifRequest,
  // AddUserFavorite,
  AddUserFavoriteRequest,
  AddViewsRequest,
  AdminCommentsRequest,
  AdminOptionRequest,
  ContentLinkRequest,
  CountDispositifsRequest,
  CreateDispositifRequest,
  DeleteTranslationsRequest,
  // DeleteUserFavorite,
  DeleteUserFavoriteRequest,
  DispositifStatusRequest,
  DownloadAppRequest,
  GetActiveStructuresResponse,
  GetActiveUsersResponse,
  GetAdminOptionResponse,
  GetAllDispositifsResponse,
  GetAllStructuresResponse,
  GetAllUsersResponse,
  GetCountDispositifsResponse,
  GetDispositifResponse,
  GetDispositifsRequest,
  GetDispositifsResponse,
  GetDispositifsWithTranslationAvancementResponse,
  GetLanguagesResponse,
  GetLogResponse,
  GetNeedResponse,
  GetRegionStatisticsResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  GetStructureResponse,
  GetStructureStatisticsRequest,
  GetStructureStatisticsResponse,
  GetThemeResponse,
  GetUserContributionsResponse,
  GetUserFavoritesRequest,
  GetUserFavoritesResponse,
  GetUserInfoResponse,
  GetUserStatisticsResponse,
  GetWidgetResponse,
  Id,
  ImprovementsRequest,
  LoginRequest,
  LoginResponse,
  MainSponsorRequest,
  NeedRequest,
  NewPasswordRequest,
  NewPasswordResponse,
  PatchStructureRequest,
  PatchStructureRolesRequest,
  PatchWidgetResponse,
  PostAdminOptionResponse,
  PostImageResponse,
  PostStructureRequest,
  PostThemeResponse,
  PostWidgetResponse,
  ReadSuggestionDispositifRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendNotificationsRequest,
  SubscriptionRequest,
  ThemeRequest,
  TranslationStatisticsRequest,
  TranslationStatisticsResponse,
  TtsRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdatePositionsNeedResponse,
  UpdatePositionsRequest,
  UpdateUserRequest,
  // UserFavoritesRequest,
  WidgetRequest,
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
    if (axios.isCancel(error)) {
      logger.error("Error (request cancelled): ", { error: error.message });
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
    return instance.get("/user", { headers });
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
  getUserFavorites: (query: GetUserFavoritesRequest): Promise<APIResponse<GetUserFavoritesResponse>> => {
    const headers = getHeaders();
    return instance.get(`/user/favorites?locale=${query.locale}`, { headers });
  },
  addUserFavorite: (body: AddUserFavoriteRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.put("/user/favorites", body, { headers });
  },
  deleteUserFavorites: (query: DeleteUserFavoriteRequest): Promise<APIResponse> => {
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
  getDispositifsWithTranslationAvancement: (
    locale: string,
  ): Promise<APIResponse<GetDispositifsWithTranslationAvancementResponse>> => {
    const headers = getHeaders();
    return instance.get(`/dispositifs/with-translations-status?locale=${locale}`, { headers });
  },
  getDispositifs: (query: GetDispositifsRequest): Promise<APIResponse<GetDispositifsResponse[]>> => {
    return instance.get("/dispositifs", { params: query });
  },
  getAllDispositifs: (): Promise<APIResponse<GetAllDispositifsResponse[]>> => {
    const headers = getHeaders();
    return instance.get("/dispositifs/all", { headers });
  },
  getNbDispositifsByRegion: (): Promise<APIResponse<GetRegionStatisticsResponse>> => {
    return instance.get("/dispositifs/region-statistics");
  },
  addDispositifViews: (id: string, body: AddViewsRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post(`/dispositifs/${id}/view`, body, { headers });
  },
  getDispositifsStatistics: (query: GetStatisticsRequest): Promise<APIResponse<GetStatisticsResponse>> => {
    const headers = getHeaders();
    return instance.get("/dispositifs/statistics", { params: query, headers });
  },
  addDispositifMerci: (id: string): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.put(`/dispositifs/${id}/merci`, {}, { headers });
  },
  addDispositifSuggestion: (id: string, body: AddSuggestionDispositifRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.put(`/dispositifs/${id}/suggestion`, body, { headers });
  },
  readDispositifSuggestion: (id: string, body: ReadSuggestionDispositifRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/dispositifs/${id}/suggestion`, body, { headers });
  },
  deleteDispositifSuggestion: (id: string, suggestionId: string): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.delete(`/dispositifs/${id}/suggestion/${suggestionId}`, { headers });
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
  createStructure: (body: PostStructureRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/structures", body, { headers });
  },
  updateStructure: (id: Id, body: PatchStructureRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/structures/${id}`, body, { headers });
  },
  updateStructureRoles: (id: Id, body: PatchStructureRolesRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.patch(`/structures/${id}/roles`, body, { headers });
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
  exportDispositifs: (): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/dispositifs/export", {}, { headers });
  },
  exportDispositifsGeolocalisation: (): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/dispositifs/export-geoloc", {}, { headers });
  },

  // Trads

  saveTraduction: (query: { dispositifId: string; timeSpent: number; translated: any /*TODO*/; language: string }) => {
    const headers = getHeaders();
    return instance.post("/traduction", query, {
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

  deleteTrads: (query: DeleteTranslationsRequest) => {
    const headers = getHeaders();
    return instance.delete("/traduction", { params: query, headers });
  },
  get_progression: (query: any = {}) => {
    const headers = getHeaders();
    return instance.get("/traduction/get_progression", { params: query, headers }).then((response) => response.data);
  },

  get_translation: (query = {}) => {
    const headers = getHeaders();
    return instance.post("/traduction/translate", query, {
      headers,
    });
  },
  getTranslationStatistics: (query: TranslationStatisticsRequest): Promise<APIResponse<TranslationStatisticsResponse>> => {
    return instance.get("/traduction/statistics", { params: query });
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
  getTts: (body: TtsRequest): Promise<any> => {
    const headers = getHeaders();
    return instance
      .request({
        method: "POST",
        url: "/tts",
        responseType: "arraybuffer",
        responseEncoding: "iso-8859-1",
        data: body,
        headers,
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      })
      .then((_) => {
        const decoder = new TextDecoder("iso-8859-1");
        const text = decoder.decode(_.data);
        console.log(text);
        return _.data;
      })
      .then((data) => {
        var b = new Blob([data], { type: "audio/wav" });
        var blobUrl = URL.createObjectURL(b);
        return data;
      });
  },
  cancel_tts_subscription: () => cancel && cancel("Cancelled by user"),

  // sms
  smsDownloadApp: (body: DownloadAppRequest): Promise<APIResponse> => {
    return instance.post("/sms/download-app", body);
  },
  smsContentLink: (body: ContentLinkRequest): Promise<APIResponse> => {
    const headers = getHeaders();
    return instance.post("/sms/content-link", body, { headers });
  },
};

export default API;

/*

getTts: (body: TtsRequest): Promise<any> => {
    const headers = getHeaders();
    return fetch(burl + "/tts", { method: "POST", headers, body: JSON.stringify(body) })
      .then((response) => {
        if (response.body) {
          return response.arrayBuffer();
          // var reader = response.body.getReader();
          // return reader.read().then((result) => {
          //   return result.value;
          // });
          // return response.text();
        }
        throw new Error("whaaaatttt");
      })
      .then((buffer) => {
        const decoder = new TextDecoder("iso-8859-1");
        const text = decoder.decode(buffer);
        console.log(text);
        return text;
      })
      .then((data) => {
        // var b = new Blob([data], { type: "audio/wav" });
        // var blobUrl = URL.createObjectURL(b);
        // const audio = new Audio(blobUrl);
        // audio.play().catch((e) => {
        //   console.error("bouya", e);
        // });
        // console.log(text);
        return data;
      });
  },
  */
