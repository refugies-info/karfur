import axios, { Canceler } from "axios";
import { getAuthToken, removeAuthToken } from "utils/authToken";
import Swal from "sweetalert2";
import { logger } from "../logger";
import isInBrowser from "lib/isInBrowser";
import { APIResponse } from "types/interface";
import {
  AddContactRequest,
  AddSuggestionDispositifRequest,
  AddUserFavoriteRequest,
  AddViewsRequest,
  AdminCommentsRequest,
  AdminOptionRequest,
  ContentLinkRequest,
  CountDispositifsRequest,
  CreateDispositifRequest,
  DeleteTranslationsRequest,
  DeleteUserFavoriteRequest,
  DispositifStatusRequest,
  DispositifThemeNeedsRequest,
  DownloadAppRequest,
  GetActiveStructuresResponse,
  GetActiveUsersResponse,
  GetAdminOptionResponse,
  GetAllDispositifsResponse,
  GetAllStructuresResponse,
  GetAllUsersResponse,
  GetCountDispositifsResponse,
  GetDefaultTraductionResponse,
  GetDispositifResponse,
  GetDispositifsHasTextChanges,
  GetDispositifsRequest,
  GetDispositifsResponse,
  GetDispositifsWithTranslationAvancementResponse,
  GetLanguagesResponse,
  GetLogResponse,
  GetNeedResponse,
  GetProgressionRequest,
  GetProgressionResponse,
  GetRegionStatisticsResponse,
  GetStatisticsRequest,
  GetStatisticsResponse,
  GetStructureResponse,
  GetStructureStatisticsRequest,
  GetStructureStatisticsResponse,
  GetThemeResponse,
  GetTraductionsForReviewResponse,
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
  CheckCodeRequest,
  MainSponsorRequest,
  NeedRequest,
  NewPasswordRequest,
  NewPasswordResponse,
  PatchStructureRequest,
  PatchStructureRolesRequest,
  PatchThemeResponse,
  PatchWidgetResponse,
  PostAdminOptionResponse,
  PostDispositifsResponse,
  PostImageResponse,
  PostStructureRequest,
  PostThemeResponse,
  PostWidgetResponse,
  PublishDispositifRequest,
  ReadSuggestionDispositifRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SaveTranslationRequest,
  SaveTranslationResponse,
  SendNotificationsRequest,
  StructureReceiveDispositifRequest,
  SubscriptionRequest,
  ThemeRequest,
  TranslateRequest,
  TranslationStatisticsRequest,
  TranslationStatisticsResponse,
  TtsRequest,
  UpdateDispositifPropertiesRequest,
  UpdateDispositifRequest,
  UpdateDispositifResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
  UpdatePositionsNeedResponse,
  UpdatePositionsRequest,
  UpdateUserRequest,
  WidgetRequest,
  PublishTranslationRequest,
  CheckUserExistsResponse,
  SendCodeRequest
} from "@refugies-info/api-types";

const burl = process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL;

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

type RequestOptions = {
  token?: string
}

const getHeaders = (jwtToken?: string) => {
  const headers: any = {
    "Content-Type": "application/json",
    "site-secret": process.env.NEXT_PUBLIC_REACT_APP_SITE_SECRET || "",
  };

  const token = isInBrowser() ? getAuthToken() : jwtToken;
  if (token) headers["x-access-token"] = token;
  return headers;
};

const API = {
  // Auth
  login: (body: LoginRequest): Promise<LoginResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<LoginResponse>>("/user/login", body, { headers }).then(response => response.data.data)
  },
  checkCode: (body: CheckCodeRequest): Promise<LoginResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<LoginResponse>>("/user/check-code", body, { headers }).then(response => response.data.data)
  },
  sendCode: (body: SendCodeRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/user/send-code", body, { headers }).then(() => null)
  },
  checkUserExists: (email: string): Promise<CheckUserExistsResponse> => {
    return instance.get<any, APIResponse<CheckUserExistsResponse>>(`/user/exists?email=${email}`).then(response => response.data.data)
  },
  updatePassword: (id: Id, body: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
    const headers = getHeaders();
    return instance.patch<any, APIResponse<UpdatePasswordResponse>>(`/user/${id}/password`, body, { headers }).then(response => response.data.data)
  },
  resetPassword: (body: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    return instance.post<any, APIResponse<ResetPasswordResponse>>("/user/password/reset", body).then(response => response.data.data)
  },
  checkResetToken: (token: String): Promise<null> => {
    return instance.get<any, null>(`/user/password/reset?token=${token}`).then(() => null);
  },
  setNewPassword: (body: NewPasswordRequest): Promise<NewPasswordResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<NewPasswordResponse>>("/user/password/new", body, { headers }).then(response => response.data.data)
  },
  isAuth: () => {
    if (!isInBrowser()) return false;
    return getAuthToken() !== undefined;
  },
  logout: () => {
    return removeAuthToken();
  },

  // User
  getUser: (options?: RequestOptions): Promise<GetUserInfoResponse> => {
    const headers = getHeaders(options?.token);
    return instance.get<any, APIResponse<GetUserInfoResponse>>("/user", { headers }).then(response => response.data.data)
  },
  updateUser: (id: Id, body: UpdateUserRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/user/${id}`, body, { headers }).then(() => null);
  },
  deleteUser: (query: Id): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/user/${query}`, { headers }).then(() => null);
  },
  getUserContributions: (): Promise<GetUserContributionsResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetUserContributionsResponse>>("/dispositifs/user-contributions", { headers }).then(response => response.data.data)
  },
  getUserFavorites: (query: GetUserFavoritesRequest): Promise<GetUserFavoritesResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetUserFavoritesResponse>>(`/user/favorites?locale=${query.locale}`, { headers }).then(response => response.data.data)
  },
  addUserFavorite: (body: AddUserFavoriteRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.put<any, null>("/user/favorites", body, { headers }).then(() => null);
  },
  deleteUserFavorites: (query: DeleteUserFavoriteRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>("/user/favorites", { params: query, headers }).then(() => null);
  },

  // Users
  getUsersStatistics: (): Promise<GetUserStatisticsResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetUserStatisticsResponse>>("/user/statistics", { headers }).then(response => response.data.data)
  },
  getActiveUsers: (): Promise<GetActiveUsersResponse[]> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetActiveUsersResponse[]>>("/user/actives", { headers }).then(response => response.data.data)
  },
  getAllUsers: (): Promise<GetAllUsersResponse[]> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetAllUsersResponse[]>>("/user/all", { headers }).then(response => response.data.data)
  },

  // Dispositif
  getDispositif: (id: string, locale: string, options?: RequestOptions): Promise<GetDispositifResponse> => {
    const headers = getHeaders(options?.token);
    return instance.get<any, APIResponse<GetDispositifResponse>>(`/dispositifs/${id}?locale=${locale}`, { headers }).then(response => response.data.data)
  },
  countDispositifs: (query: CountDispositifsRequest): Promise<GetCountDispositifsResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetCountDispositifsResponse>>("/dispositifs/count", { params: query, headers }).then(response => response.data.data)
  },
  deleteDispositif: (id: Id): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/dispositifs/${id}`, { headers }).then(() => null);
  },
  updateDispositifStatus: (id: Id, body: DispositifStatusRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/status`, body, { headers }).then(() => null);
  },
  structureReceiveDispositifStatus: (id: Id, body: StructureReceiveDispositifRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/structure-receive`, body, { headers }).then(() => null);
  },
  updateDispositifThemesOrNeeds: (id: Id, body: DispositifThemeNeedsRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/themes-needs`, body, { headers }).then(() => null);
  },
  updateDispositifMainSponsor: (id: string, body: MainSponsorRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/main-sponsor`, body, { headers }).then(() => null);
  },
  updateDispositifAdminComments: (id: string, body: AdminCommentsRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/admin-comments`, body, { headers }).then(() => null);
  },
  getDispositifsWithTranslationAvancement: (
    locale: string,
  ): Promise<GetDispositifsWithTranslationAvancementResponse[]> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetDispositifsWithTranslationAvancementResponse[]>>(`/dispositifs/with-translations-status?locale=${locale}`, { headers }).then(response => response.data.data)
  },
  getDispositifs: (query: GetDispositifsRequest): Promise<GetDispositifsResponse[]> => {
    return instance.get<any, APIResponse<GetDispositifsResponse[]>>("/dispositifs", { params: query }).then(response => response.data.data)
  },
  getAllDispositifs: (): Promise<GetAllDispositifsResponse[]> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetAllDispositifsResponse[]>>("/dispositifs/all", { headers }).then(response => response.data.data)
  },
  getNbDispositifsByRegion: (): Promise<GetRegionStatisticsResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetRegionStatisticsResponse>>("/dispositifs/region-statistics", { headers }).then(response => response.data.data)
  },
  addDispositifViews: (id: string, body: AddViewsRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>(`/dispositifs/${id}/views`, body, { headers }).then(() => null);
  },
  getDispositifHasTextChanges: (id: string): Promise<GetDispositifsHasTextChanges> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetDispositifsHasTextChanges>>(`/dispositifs/${id}/has-text-changes`, { headers }).then(response => response.data.data)
  },
  getDispositifsStatistics: (query: GetStatisticsRequest): Promise<GetStatisticsResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetStatisticsResponse>>("/dispositifs/statistics", { params: query, headers }).then(response => response.data.data)
  },
  addDispositifMerci: (id: string): Promise<null> => {
    const headers = getHeaders();
    return instance.put<any, null>(`/dispositifs/${id}/merci`, {}, { headers }).then(() => null);
  },
  deleteDispositifMerci: (id: string): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/dispositifs/${id}/merci`, { headers }).then(() => null);
  },
  addDispositifSuggestion: (id: string, body: AddSuggestionDispositifRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.put<any, null>(`/dispositifs/${id}/suggestion`, body, { headers }).then(() => null);
  },
  readDispositifSuggestion: (id: string, body: ReadSuggestionDispositifRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/suggestion`, body, { headers }).then(() => null);
  },
  deleteDispositifSuggestion: (id: string, suggestionId: string): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/dispositifs/${id}/suggestion/${suggestionId}`, { headers }).then(() => null);
  },
  updateDispositifProperties: (id: Id, body: UpdateDispositifPropertiesRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/properties`, body, { headers }).then(() => null);
  },
  updateDispositif: (id: Id, body: UpdateDispositifRequest): Promise<UpdateDispositifResponse> => {
    const headers = getHeaders();
    return instance.patch<any, APIResponse<UpdateDispositifResponse>>(`/dispositifs/${id}`, body, { headers }).then(response => response.data.data)
  },
  publishDispositif: (id: Id, body: PublishDispositifRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/dispositifs/${id}/publish`, body, { headers }).then(() => null);
  },
  createDispositif: (body: CreateDispositifRequest): Promise<PostDispositifsResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<PostDispositifsResponse>>("/dispositifs", body, { headers }).then(response => response.data.data)
  },

  // Mail
  sendAdminImprovementsMail: (body: ImprovementsRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/mail/sendAdminImprovementsMail", body, { headers }).then(() => null);
  },
  sendSubscriptionReminderMail: (body: SubscriptionRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/mail/sendSubscriptionReminderMail", body, { headers }).then(() => null);
  },
  contacts: (body: AddContactRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/mail/contacts", body, { headers }).then(() => null);
  },

  // Structure
  createStructure: (body: PostStructureRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/structures", body, { headers }).then(() => null);
  },
  updateStructure: (id: Id, body: PatchStructureRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/structures/${id}`, body, { headers }).then(() => null);
  },
  updateStructureRoles: (id: Id, body: PatchStructureRolesRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/structures/${id}/roles`, body, { headers }).then(() => null);
  },
  getStructureById: (id: string, locale: string, options?: RequestOptions): Promise<GetStructureResponse> => {
    const headers = getHeaders(options?.token);
    return instance.get<any, APIResponse<GetStructureResponse>>(`/structures/${id}?locale=${locale}`, { headers }).then(response => response.data.data)
  },
  getActiveStructures: (): Promise<GetActiveStructuresResponse[]> => {
    return instance.get<any, APIResponse<GetActiveStructuresResponse[]>>("/structures/getActiveStructures").then(response => response.data.data)
  },
  getAllStructures: (): Promise<GetAllStructuresResponse[]> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetAllStructuresResponse[]>>("/structures/all", { headers }).then(response => response.data.data)
  },
  getStructuresStatistics: (
    query: GetStructureStatisticsRequest,
  ): Promise<GetStructureStatisticsResponse> => {
    return instance.get<any, APIResponse<GetStructureStatisticsResponse>>("/structures/statistics", { params: query }).then(response => response.data.data)
  },

  // Needs
  getNeeds: (): Promise<GetNeedResponse> => {
    return instance.get<any, APIResponse<GetNeedResponse>>("/needs").then(response => response.data.data)
  },
  postNeeds: (body: NeedRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/needs", body, { headers }).then(() => null);
  },
  patchNeed: (id: Id, body: Partial<NeedRequest>): Promise<null> => {
    const headers = getHeaders();
    return instance.patch<any, null>(`/needs/${id}`, body, { headers }).then(() => null);
  },
  orderNeeds: (body: UpdatePositionsRequest): Promise<UpdatePositionsNeedResponse[]> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<UpdatePositionsNeedResponse[]>>("/needs/positions", body, { headers }).then(response => response.data.data)
  },
  deleteNeed: (query: Id): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/needs/${query}`, { headers }).then(() => null);
  },

  // Themes
  getThemes: (): Promise<GetThemeResponse[]> => {
    return instance.get<any, APIResponse<GetThemeResponse[]>>("/themes").then(response => response.data.data)
  },
  postThemes: (body: ThemeRequest): Promise<PostThemeResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<PostThemeResponse>>("/themes", body, { headers }).then(response => response.data.data)
  },
  patchTheme: (id: Id, body: Partial<ThemeRequest>): Promise<PatchThemeResponse> => {
    const headers = getHeaders();
    return instance.patch<any, APIResponse<PatchThemeResponse>>(`/themes/${id}`, body, { headers }).then(response => response.data.data);
  },
  deleteTheme: (query: Id): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/themes/${query}`, { headers }).then(() => null);
  },

  // Widgets
  getWidgets: (): Promise<GetWidgetResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetWidgetResponse>>("/widgets", { headers }).then(response => response.data.data)
  },
  postWidgets: (body: WidgetRequest): Promise<PostWidgetResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<PostWidgetResponse>>("/widgets", body, { headers }).then(response => response.data.data)
  },
  patchWidget: (id: Id, body: Partial<WidgetRequest>): Promise<PatchWidgetResponse> => {
    const headers = getHeaders();
    return instance.patch<any, APIResponse<PatchWidgetResponse>>(`/widgets/${id}`, body, { headers }).then(response => response.data.data)
  },
  deleteWidget: (query: Id): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>(`/widgets/${query}`, { headers }).then(() => null);
  },

  // Export
  exportUsers: (): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/user/export", {}, { headers }).then(() => null);
  },
  exportDispositifs: (): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/dispositifs/export", {}, { headers }).then(() => null);
  },
  exportDispositifsGeolocalisation: (): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/dispositifs/export-geoloc", {}, { headers }).then(() => null);
  },

  // Trads
  saveTraduction: (query: SaveTranslationRequest): Promise<SaveTranslationResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<SaveTranslationResponse>>("/traduction", query, { headers }).then(response => response.data.data)
  },
  publishTraduction: (query: PublishTranslationRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/traduction/publish", query, { headers }).then(() => null);
  },

  getTraductionsForReview: ({ dispositif, language }: { dispositif: string; language: string }, options?: RequestOptions): Promise<GetTraductionsForReviewResponse> => {
    const headers = getHeaders(options?.token);
    return instance.get<any, APIResponse<GetTraductionsForReviewResponse>>(`/traduction/for_review?dispositif=${dispositif}&language=${language}`, { headers }).then(response => response.data.data)
  },
  getDefaultTraductionForDispositif: ({ dispositif }: { dispositif: string }, options?: RequestOptions): Promise<GetDefaultTraductionResponse> => {
    const headers = getHeaders(options?.token);
    return instance.get<any, APIResponse<GetDefaultTraductionResponse>>(`/traduction?dispositif=${dispositif}`, { headers }).then(response => response.data.data)
  },

  deleteTrads: (query: DeleteTranslationsRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.delete<any, null>("/traduction", { params: query, headers }).then(() => null);
  },
  get_progression: (query: GetProgressionRequest): Promise<GetProgressionResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetProgressionResponse>>("/traduction/get_progression", { params: query, headers }).then(response => response.data.data)
  },

  get_translation: (query: TranslateRequest): Promise<string> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<string>>("/traduction/translate", query, { headers }).then(response => response.data.data)
  },
  getTranslationStatistics: (query: TranslationStatisticsRequest): Promise<TranslationStatisticsResponse> => {
    return instance.get<any, APIResponse<any>>("/traduction/statistics", { params: query }).then(response => response.data.data)
  },

  // langues
  getLanguages: (): Promise<GetLanguagesResponse> => {
    return instance.get<any, APIResponse<GetLanguagesResponse>>("/langues").then(response => response.data.data)
  },

  // Misc
  postImage: (query: any): Promise<PostImageResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<PostImageResponse>>("/images", query, { headers }).then(response => response.data.data)
  },
  // Logs
  logs: (id: Id): Promise<GetLogResponse[]> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetLogResponse[]>>(`/logs?id=${id}`, { headers }).then(response => response.data.data)
  },

  // Notifications
  sendNotification: (body: SendNotificationsRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/notifications/send", body, { headers }).then(() => null);
  },

  // AdminOptions
  getAdminOption: (key: string): Promise<GetAdminOptionResponse> => {
    const headers = getHeaders();
    return instance.get<any, APIResponse<GetAdminOptionResponse>>(`/options/${key}`, { headers }).then(response => response.data.data)
  },
  setAdminOption: (key: string, body: AdminOptionRequest): Promise<PostAdminOptionResponse> => {
    const headers = getHeaders();
    return instance.post<any, APIResponse<PostAdminOptionResponse>>(`/options/${key}`, body, { headers }).then(response => response.data.data)
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
        return _.data;
      });
  },
  cancel_tts_subscription: () => cancel && cancel("Cancelled by user"),

  // sms
  smsDownloadApp: (body: DownloadAppRequest): Promise<null> => {
    return instance.post<any, null>("/sms/download-app", body).then(() => null);
  },
  smsContentLink: (body: ContentLinkRequest): Promise<null> => {
    const headers = getHeaders();
    return instance.post<any, null>("/sms/content-link", body, { headers }).then(() => null);
  },
};

export default API;
