import axios from "axios";

import setAuthToken from "./setAuthToken";
import Swal from "sweetalert2";
import { logger } from "../logger";
import isInBrowser from "lib/isInBrowser";

const socket = null;
export { socket };


const burl = process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL;

axios.withCredentials = true;

axios.interceptors.request.use(
  (request) => {
    return request;
  },
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

axios.interceptors.response.use(
  (response) => {
    // console.log(response)
    return response;
  },
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
let cancel;
// const source = CancelToken.source();
// const sourceToken = source.token

// export {source};

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token") || undefined,
    "site-secret": process.env.NEXT_PUBLIC_REACT_APP_SITE_SECRET,
  };
}

export default {
  login: (user) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/login", user, { headers });
  },
  signup: (send) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/signup", send, { headers });
  },
  checkUserExists: (send) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/checkUserExists", send, {
      headers,
    });
  },
  set_user_info: (user) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/set_user_info", user, { headers });
  },
  get_users: (params = {}) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/get_users", params, { headers });
  },
  get_user_info: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/get_user_info", query, {
      headers,
    });
  },
  updateUser: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/updateUser", query, {
      headers,
    })
  },
  changePassword: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/changePassword", query, {
      headers,
    })
  },
  reset_password: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/reset_password", query, {
      headers,
    });
  },
  set_new_password: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/set_new_password", query, {
      headers,
    });
  },
  addDispositif: (query) => {
    const headers = getHeaders();
    axios.post(burl + "/dispositifs/addDispositif", query, {
      headers,
    })
  },

  sendAdminImprovementsMail: (query) => {
    const headers = getHeaders();
    axios.post(burl + "/mail/sendAdminImprovementsMail", query, {
      headers,
    })
  },

  sendSubscriptionReminderMail: (query) => {
    const headers = getHeaders();
    axios.post(burl + "/mail/sendSubscriptionReminderMail", query, {
      headers,
    })
  },

  add_dispositif_infocards: (query) => {
    return axios.post(burl + "/dispositifs/add_dispositif_infocards", query, {
      headers,
    });
  },
  get_dispositif: (params = {}) => {
    return axios.post(burl + "/dispositifs/get_dispositif", params, {
      headers,
    });
  },
  count_dispositifs: (query) => {
    return axios.post(burl + "/dispositifs/count_dispositifs", query, {
      headers,
    });
  },
  updateDispositifReactions: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/updateDispositifReactions", query, {
      headers,
    })
  },

  updateDispositifStatus: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/updateDispositifStatus", query, {
      headers,
    })
  },

  updateDispositifTagsOrNeeds: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/updateDispositifTagsOrNeeds", query, {
      headers,
    })
  },

  modifyDispositifMainSponsor: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/modifyDispositifMainSponsor", query, {
      headers,
    })
  },

  updateDispositifAdminComments: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/updateDispositifAdminComments", query, {
      headers,
    })
  },

  createStructure: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/structures/createStructure", query, {
      headers,
    })
  },

  updateStructure: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/structures/updateStructure", query, {
      headers,
    })
  },
  modifyUserRoleInStructure: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/structures/modifyUserRoleInStructure", query, {
      headers,
    })
  },

  getStructureById: (
    id,
    withDisposAssocies,
    localeOfLocalizedDispositifsAssocies,
    withMembres
  ) => {
    const headers = getHeaders();
    return axios.get(burl + "/structures/getStructureById", {
      params: {
        id,
        withDisposAssocies,
        localeOfLocalizedDispositifsAssocies,
        withMembres,
      },
      headers,
    })
  },

  getUserFavoritesInLocale: (locale) => {
    const headers = getHeaders();
    return axios.get(burl + `/user/getUserFavoritesInLocale?locale=${locale}`, {
      headers,
    })
  },
  getNeeds: () =>
    axios.get(burl + "/needs/getNeeds"),

  getDispositifsWithTranslationAvancement: (locale) => {
    const headers = getHeaders();
    return axios.get(
      burl + `/user/getDispositifsWithTranslationAvancement?locale=${locale}`,
      { headers }
    )
  },

  getUserContributions: () => {
    const headers = getHeaders();
    return axios.get(burl + "/user/getUserContributions", { headers })
  },

  updateUserFavorites: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/user/updateUserFavorites", query, { headers })
  },

  getNbDispositifsByRegion: () =>
    axios.get(burl + "/dispositifs/getNbDispositifsByRegion"),

  getFiguresOnUsers: () =>
    axios.get(burl + "/user/getFiguresOnUsers"),

  exportUsers: () => {
    const headers = getHeaders();
    return axios.post(burl + "/user/exportUsers", {}, { headers })
  },
  exportFiches: () => {
    const headers = getHeaders();
    return axios.post(burl + "/user/exportFiches", {}, { headers })
  },

  exportDispositifsGeolocalisation: () => {
    const headers = getHeaders();
    return axios.post(
      burl + "/dispositifs/exportDispositifsGeolocalisation",
      {},
      { headers }
    )
  },
  getActiveStructures: () =>
    axios.get(burl + "/structures/getActiveStructures"),

  getDispositifs: (params) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/getDispositifs", params);
  },

  updateNbVuesOrFavoritesOnContent: (params) => {
    const headers = getHeaders();
    return axios.post(burl + "/dispositifs/updateNbVuesOrFavoritesOnContent", params, {
      headers,
    })
  },

  getAllDispositifs: () => axios.get(burl + "/dispositifs/getAllDispositifs"),
  getAllStructures: () => axios.get(burl + "/structures/getAllStructures"),
  getAllUsers: () => {
    const headers = getHeaders();
    return axios.get(burl + "/user/getAllUsers", { headers })
  },

  add_tradForReview: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/traduction/add_tradForReview", query, {
      headers,
    });
  },
  get_tradForReview: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/traduction/get_tradForReview", query, {
      headers,
    });
  },
  validateTranslations: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/traduction/validateTranslations", query, {
      headers,
    });
  },

  saveNeed: (query) =>{
    const headers = getHeaders();
    return axios.post(burl + "/needs/saveNeed", query, {
      headers,
    })
  },

  createNeed: (query) =>{
    const headers = getHeaders();
    return axios.post(burl + "/needs/createNeed", query, {
      headers,
    })
  },

  delete_trads: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/traduction/delete_trads", query, {
      headers,
    });
  },
  get_progression: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/traduction/get_progression", query, {
      headers,
    });
  },

  update_tradForReview: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/traduction/update_tradForReview", query, {
      headers,
    });
  },

  get_translation: (query = {}) => {
    const headers = getHeaders();
    return axios.post(burl + "/translate/get_translation", query, {
      headers,
    });
  },

  get_langues: (query, sort, populate) => {
    const headers = getHeaders();
    return axios.post(
      burl + "/langues/get_langues",
      { query: query, sort: sort, populate: populate },
      { headers }
    );
  },

  getLanguages: () => axios.get(burl + "/langues/getLanguages"),

  set_image: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/images/set_image", query, { headers });
  },

  set_mail: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/miscellaneous/set_mail", query, { headers });
  },
  send_sms: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/miscellaneous/send_sms", query, { headers });
  },

  get_tts: (query) => {
    const headers = getHeaders();
    return axios.post(burl + "/tts/get_tts", query, {
      headers,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    });
  },
  cancel_tts_subscription: () => cancel && cancel(),

  isAuth: () => {
    if (!isInBrowser()) return false;
    return localStorage.getItem("token") !== null;
  },
  logout: () => {
    setAuthToken(false);
    delete headers["x-access-token"];
    return localStorage.removeItem("token");
  },
};
