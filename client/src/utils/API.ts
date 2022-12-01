import axios, { AxiosRequestHeaders, AxiosResponse, Canceler } from "axios";

import setAuthToken from "./setAuthToken";
import Swal from "sweetalert2";
import { logger } from "../logger";
import isInBrowser from "lib/isInBrowser";
import { AdminOption, DispositifStatistics, IDispositif, NbDispositifsByRegion, Need, StructuresStatistics, Theme, User, Widget } from "types/interface";
import { ObjectId } from "mongodb";

const burl = process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL;

type Response<T = any> = AxiosResponse<{ text: string, data: T }>

//@ts-ignore
axios.withCredentials = true;
const instance = axios.create({
  baseURL: burl || "",
});

instance.interceptors.request.use(
  request => request,
  (error) => {
    Swal.fire({
      type: "error",
      title: "Oops...",
      text: (error.response.data || {}).text || "",
      footer: "<i>" + error.message + "</i>",
      timer: 1500,
    });

    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response && error.response.status < 500) {
      if (error.response.data.data !== "no-alert") {
        Swal.fire({
          type: "error",
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
  }
);

const CancelToken = axios.CancelToken;
let cancel: Canceler;

const getHeaders = () => {
  const headers: AxiosRequestHeaders = {
    "Content-Type": "application/json",
    "site-secret": process.env.NEXT_PUBLIC_REACT_APP_SITE_SECRET || "",
  };

  const token = isInBrowser() ? localStorage.getItem("token") : undefined;
  if (token) headers["x-access-token"] = token;

  return headers;
}

const API = {
  // Auth
  login: (user: {
    username: string
    password: string
    email: string
    code?: string
    phone?: string
  }) => {
    const headers = getHeaders();
    return instance.post("/user/login", user, { headers });
  },
  checkUserExists: (query: {
    username: string
  }) => {
    const headers = getHeaders();
    return instance.post("/user/checkUserExists", query, {
      headers,
    });
  },
  changePassword: (query: {
    userId: string | ObjectId
    currentPassword: string
    newPassword: string
  }) => {
    const headers = getHeaders();
    return instance.post("/user/changePassword", query, {
      headers,
    })
  },
  reset_password: (query: {
    username: string
  }) => {
    const headers = getHeaders();
    return instance.post("/user/reset_password", query, {
      headers,
    });
  },
  set_new_password: (query: {
    newPassword: string
    reset_password_token: string
  }) => {
    const headers = getHeaders();
    return instance.post("/user/set_new_password", query, {
      headers,
    });
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
  set_user_info: (user: Partial<User>) => {
    const headers = getHeaders();
    return instance.post("/user/set_user_info", user, { headers });
  },
  get_user_info: () => {
    const headers = getHeaders();
    return instance.post("/user/get_user_info", {}, {
      headers,
    });
  },
  updateUser: (query: any) => {
    const headers = getHeaders();
    return instance.post("/user/updateUser", query, {
      headers,
    })
  },
  deleteUser: (query: ObjectId) => {
    const headers = getHeaders();
    return instance.delete(`/user/${query}`, { headers })
  },
  getUserFavoritesInLocale: (locale: string) => {
    const headers = getHeaders();
    return instance.get(`/user/getUserFavoritesInLocale?locale=${locale}`, {
      headers,
    })
  },
  getUserContributions: () => {
    const headers = getHeaders();
    return instance.get("/dispositifs/getUserContributions", { headers })
  },
  updateUserFavorites: (query: {
    dispositifId: ObjectId | null
    type: string
  }) => {
    const headers = getHeaders();
    return instance.post("/user/updateUserFavorites", query, { headers })
  },

  // Users
  getFiguresOnUsers: () => {
    return instance.get("/user/getFiguresOnUsers")
  },
  get_users: (params = {}) => {
    const headers = getHeaders();
    return instance.post("/user/get_users", params, { headers });
  },
  getAllUsers: () => {
    const headers = getHeaders();
    return instance.get("/user/getAllUsers", { headers })
  },

  // Dispositif
  addDispositif: (query: Partial<IDispositif>) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/addDispositif", query, {
      headers,
    })
  },
  add_dispositif_infocards: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/add_dispositif_infocards", query, {
      headers,
    });
  },
  get_dispositif: (params = {}) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/get_dispositif", params, {
      headers,
    });
  },
  count_dispositifs: (query: any): Promise<AxiosResponse<number>> => {
    const headers = getHeaders();
    return instance.post("/dispositifs/count_dispositifs", query, {
      headers,
    });
  },
  updateDispositifReactions: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateDispositifReactions", query, {
      headers,
    })
  },
  updateDispositifStatus: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateDispositifStatus", query, {
      headers,
    })
  },
  updateDispositifTagsOrNeeds: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateDispositifTagsOrNeeds", query, {
      headers,
    })
  },
  modifyDispositifMainSponsor: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/modifyDispositifMainSponsor", query, {
      headers,
    })
  },
  updateDispositifAdminComments: (query: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateDispositifAdminComments", query, {
      headers,
    })
  },
  getDispositifsWithTranslationAvancement: (locale: string) => {
    const headers = getHeaders();
    return instance.get(
      `/dispositifs/getDispositifsWithTranslationAvancement?locale=${locale}`,
      { headers }
    )
  },
  getDispositifs: (params: any) => {
    return instance.post("/dispositifs/getDispositifs", params);
  },
  getAllDispositifs: () => instance.get("/dispositifs/getAllDispositifs"),
  getNbDispositifsByRegion: (): Promise<Response<NbDispositifsByRegion>> => {
    return instance.get("/dispositifs/getNbDispositifsByRegion")
  },
  updateNbVuesOrFavoritesOnContent: (params: any) => {
    const headers = getHeaders();
    return instance.post("/dispositifs/updateNbVuesOrFavoritesOnContent", params, {
      headers,
    })
  },
  getDispositifsStatistics: (): Promise<Response<DispositifStatistics>> => {
    return instance.get("/dispositifs/statistics");
  },

  // Mail
  sendAdminImprovementsMail: (query: any) => {
    const headers = getHeaders();
    return instance.post("/mail/sendAdminImprovementsMail", query, {
      headers,
    })
  },
  sendSubscriptionReminderMail: (query: any) => {
    const headers = getHeaders();
    return instance.post("/mail/sendSubscriptionReminderMail", query, {
      headers,
    })
  },

  // Structure
  createStructure: (query: any) => {
    const headers = getHeaders();
    return instance.post("/structures/createStructure", query, {
      headers,
    })
  },
  updateStructure: (query: any) => {
    const headers = getHeaders();
    return instance.post("/structures/updateStructure", query, {
      headers,
    })
  },
  modifyUserRoleInStructure: (query: any) => {
    const headers = getHeaders();
    return instance.post("/structures/modifyUserRoleInStructure", query, {
      headers,
    })
  },
  getStructureById: (
    id: string,
    withDisposAssocies: boolean,
    localeOfLocalizedDispositifsAssocies: string,
    withMembres: boolean
  ) => {
    const headers = getHeaders();
    return instance.get("/structures/getStructureById", {
      params: {
        id,
        withDisposAssocies,
        localeOfLocalizedDispositifsAssocies,
        withMembres,
      },
      headers,
    })
  },
  getActiveStructures: () => {
    return instance.get("/structures/getActiveStructures")
  },
  getAllStructures: () => instance.get("/structures/getAllStructures"),
  getStructuresStatistics: (): Promise<Response<StructuresStatistics>> => {
    return instance.get("/structures/statistics");
  },

  // Needs
  getNeeds: () => {
    return instance.get("/needs")
  },
  postNeeds: (query: Partial<Need>) => {
    const headers = getHeaders();
    return instance.post("/needs", query, {
      headers,
    })
  },
  patchNeed: (query: Partial<Need>) => {
    const headers = getHeaders();
    const newNeed = { ...query };
    delete newNeed._id;
    return instance.patch(`/needs/${query._id}`, newNeed, {
      headers,
    })
  },
  orderNeeds: (query: ObjectId[]) => {
    const headers = getHeaders();
    return instance.post("/needs/positions",
      { orderedNeedIds: query },
      { headers }
    )
  },
  deleteNeed: (query: ObjectId) => {
    const headers = getHeaders();
    return instance.delete(`/needs/${query}`, { headers })
  },

  // Themes
  getThemes: () => {
    return instance.get("/themes")
  },
  postThemes: (query: Partial<Theme>) => {
    const headers = getHeaders();
    return instance.post("/themes", query, {
      headers,
    })
  },
  patchTheme: (query: Partial<Theme>) => {
    const headers = getHeaders();
    const newTheme = { ...query };
    delete newTheme._id;
    return instance.patch(`/themes/${query._id}`, newTheme, {
      headers,
    })
  },
  deleteTheme: (query: ObjectId) => {
    const headers = getHeaders();
    return instance.delete(`/themes/${query}`, { headers })
  },

  // Widgets
  getWidgets: () => {
    const headers = getHeaders();
    return instance.get("/widgets", { headers });
  },
  postWidgets: (query: Partial<Widget>) => {
    const headers = getHeaders();
    return instance.post("/widgets", query, {
      headers,
    })
  },
  patchWidget: (query: Partial<Widget>) => {
    const headers = getHeaders();
    return instance.patch(`/widgets/${query._id}`, query, {
      headers,
    })
  },
  deleteWidget: (query: ObjectId) => {
    const headers = getHeaders();
    return instance.delete(`/widgets/${query}`, { headers })
  },

  // Export
  exportUsers: () => {
    const headers = getHeaders();
    return instance.post("/user/exportUsers", {}, { headers })
  },
  exportFiches: () => {
    const headers = getHeaders();
    return instance.post("/dispositifs/exportFiches", {}, { headers })
  },
  exportDispositifsGeolocalisation: () => {
    const headers = getHeaders();
    return instance.post(
      "/dispositifs/exportDispositifsGeolocalisation",
      {},
      { headers }
    )
  },

  // Trads
  add_tradForReview: (query: any) => {
    const headers = getHeaders();
    return instance.post("/traduction/add_tradForReview", query, {
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
    return instance.post("/translate/get_translation", query, {
      headers,
    });
  },

  // Langues
  get_langues: (query: any, sort: string, populate: string) => {
    const headers = getHeaders();
    return instance.post(
      "/langues/get_langues",
      { query: query, sort: sort, populate: populate },
      { headers }
    );
  },
  getLanguages: () => instance.get("/langues/getLanguages"),

  // Misc
  set_image: (query: any) => {
    const headers = getHeaders();
    return instance.post("/images/set_image", query, { headers });
  },
  set_mail: (query: {
    mail: string
  }) => {
    const headers = getHeaders();
    return instance.post("/miscellaneous/set_mail", query, { headers });
  },
  send_sms: (query: {
    number: number
    typeContenu: string
    url: string
    title: string
  }) => {
    const headers = getHeaders();
    return instance.post("/miscellaneous/send_sms", query, { headers });
  },

  // Logs
  logs: (objectId: ObjectId) => {
    const headers = getHeaders();
    return instance.get(`/logs?id=${objectId}`, { headers });
  },

  // Notifications
  sendNotification: (demarcheId: string | ObjectId): Promise<Response<AdminOption>> => {
    const headers = getHeaders();
    return instance.post("/notifications/send", { demarcheId }, { headers });
  },

  // AdminOptions
  getAdminOption: (key: string): Promise<Response<AdminOption>> => {
    const headers = getHeaders();
    return instance.get(`/options/${key}`, { headers });
  },
  setAdminOption: (key: string, value: any): Promise<Response<AdminOption>> => {
    const headers = getHeaders();
    return instance.post(`/options/${key}`, { value }, { headers });
  },

  // tts
  get_tts: (query: {
    text: string
    locale: string
  }) => {
    const headers = getHeaders();
    return instance.post("/tts/get_tts", query, {
      headers,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    });
  },
  cancel_tts_subscription: () => cancel && cancel(),
};

export default API;
