import axios from "axios";

import setAuthToken from "./setAuthToken";
import Swal from "sweetalert2";

const socket = null;
export { socket };

const headers = {
  "Content-Type": "application/json",
  "x-access-token": localStorage.getItem("token") || undefined,
  "site-secret": process.env.REACT_APP_SITE_SECRET,
};

const burl = process.env.REACT_APP_SERVER_URL;

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
      // eslint-disable-next-line no-console
      console.log("Error: ", error.message);
    }
    return Promise.reject(error);
  }
);

const CancelToken = axios.CancelToken;
let cancel;
// const source = CancelToken.source();
// const sourceToken = source.token

// export {source};

export default {
  login: (user) => {
    return axios.post(burl + "/user/login", user, { headers: headers });
  },
  signup: (send) => {
    return axios.post(burl + "/user/signup", send, { headers: headers });
  },
  checkUserExists: (send) => {
    return axios.post(burl + "/user/checkUserExists", send, {
      headers: headers,
    });
  },
  set_user_info: (user) => {
    return axios.post(burl + "/user/set_user_info", user, { headers: headers });
  },
  get_users: (params = {}) => {
    return axios.post(burl + "/user/get_users", params, { headers: headers });
  },
  get_user_info: (query) => {
    return axios.post(burl + "/user/get_user_info", query, {
      headers: headers,
    });
  },

  updateUser: (query) =>
    axios.post(burl + "/user/updateUser", query, {
      headers,
    }),

  changePassword: (query) =>
    axios.post(burl + "/user/changePassword", query, {
      headers,
    }),

  reset_password: (query) => {
    return axios.post(burl + "/user/reset_password", query, {
      headers: headers,
    });
  },
  set_new_password: (query) => {
    return axios.post(burl + "/user/set_new_password", query, {
      headers: headers,
    });
  },

  get_event: (params) => {
    return axios.post(burl + "/events/get_event", params, { headers: headers });
  },

  add_traduction: (query) => {
    return axios.post(burl + "/article/add_traduction", query, {
      headers: headers,
    });
  },

  get_traduction: (query, sort, populate) => {
    return axios.post(
      burl + "/article/get_traduction",
      { query: query, sort: sort, populate: populate },
      { headers: headers }
    );
  },

  remove_traduction: (query) => {
    return axios.post(burl + "/article/remove_traduction", query, {
      headers: headers,
    });
  },

  add_dispositif: (query) => {
    return axios.post(burl + "/dispositifs/add_dispositif", query, {
      headers: headers,
    });
  },
  add_dispositif_infocards: (query) => {
    return axios.post(burl + "/dispositifs/add_dispositif_infocards", query, {
      headers: headers,
    });
  },
  get_dispositif: (params = {}) => {
    return axios.post(burl + "/dispositifs/get_dispositif", params, {
      headers: headers,
    });
  },
  count_dispositifs: (query) => {
    return axios.post(burl + "/dispositifs/count_dispositifs", query, {
      headers: headers,
    });
  },
  update_dispositif: (query) => {
    return axios.post(burl + "/dispositifs/update_dispositif", query, {
      headers: headers,
    });
  },

  updateDispositifReactions: (query) =>
    axios.post(burl + "/dispositifs/updateDispositifReactions", query, {
      headers,
    }),

  get_dispo_progression: (query) => {
    return axios.post(burl + "/dispositifs/get_dispo_progression", query, {
      headers: headers,
    });
  },

  updateDispositifStatus: (query) =>
    axios.post(burl + "/dispositifs/updateDispositifStatus", query, {
      headers,
    }),

  modifyDispositifMainSponsor: (query) =>
    axios.post(burl + "/dispositifs/modifyDispositifMainSponsor", query, {
      headers,
    }),

  updateDispositifAdminComments: (query) =>
    axios.post(burl + "/dispositifs/updateDispositifAdminComments", query, {
      headers,
    }),

  createStructure: (query) =>
    axios.post(burl + "/structures/createStructure", query, {
      headers,
    }),

  updateStructure: (query) =>
    axios.post(burl + "/structures/updateStructure", query, {
      headers,
    }),
  modifyUserRoleInStructure: (query) =>
    axios.post(burl + "/structures/modifyUserRoleInStructure", query, {
      headers,
    }),
  get_structure: (query = {}, sort = {}, populate = "", limit = null) => {
    return axios.post(
      burl + "/structures/get_structure",
      { query: query, sort: sort, populate: populate, limit: limit },
      { headers: headers }
    );
  },

  getStructureById: (
    id,
    withDisposAssocies,
    localeOfLocalizedDispositifsAssocies,
    withMembres
  ) =>
    axios.get(burl + "/structures/getStructureById", {
      params: {
        id,
        withDisposAssocies,
        localeOfLocalizedDispositifsAssocies,
        withMembres,
      },
    }),

  getUserFavoritesInLocale: (locale) =>
    axios.get(burl + `/user/getUserFavoritesInLocale?locale=${locale}`, {
      headers,
    }),

  getUserContributions: () =>
    axios.get(burl + "/user/getUserContributions", { headers }),

  updateUserFavorites: (query) =>
    axios.post(burl + "/user/updateUserFavorites", query, { headers }),

  getNbDispositifsByRegion: () =>
    axios.get(burl + "/dispositifs/getNbDispositifsByRegion"),

  getFiguresOnUsers: () => axios.get(burl + "/user/getFiguresOnUsers"),

  exportUsers: () => axios.post(burl + "/user/exportUsers", {}, { headers }),

  getActiveStructures: () =>
    axios.get(burl + "/structures/getActiveStructures"),

  getDispositifs: (params) => {
    return axios.post(burl + "/dispositifs/getDispositifs", params);
  },

  updateNbVuesOnDispositif: (params) =>
    axios.post(burl + "/dispositifs/updateNbVuesOnDispositif", params, {
      headers,
    }),

  getAllDispositifs: () => axios.get(burl + "/dispositifs/getAllDispositifs"),
  getAllStructures: () => axios.get(burl + "/structures/getAllStructures"),
  getAllUsers: () => axios.get(burl + "/user/getAllUsers"),

  add_tradForReview: (query) => {
    return axios.post(burl + "/traduction/add_tradForReview", query, {
      headers: headers,
    });
  },
  get_tradForReview: (query) => {
    return axios.post(burl + "/traduction/get_tradForReview", query, {
      headers: headers,
    });
  },
  validate_tradForReview: (query) => {
    return axios.post(burl + "/traduction/validate_tradForReview", query, {
      headers: headers,
    });
  },
  delete_trads: (query) => {
    return axios.post(burl + "/traduction/delete_trads", query, {
      headers: headers,
    });
  },
  get_progression: (query) => {
    return axios.post(burl + "/traduction/get_progression", query, {
      headers: headers,
    });
  },
  get_xlm: (query) => {
    return axios.post(burl + "/traduction/get_xlm", query, {
      headers: headers,
    });
  },
  get_laser: (query) => {
    return axios.post(burl + "/traduction/get_laser", query, {
      headers: headers,
    });
  },
  update_tradForReview: (query) => {
    return axios.post(burl + "/traduction/update_tradForReview", query, {
      headers: headers,
    });
  },

  get_translation: (query = {}) => {
    return axios.post(burl + "/translate/get_translation", query, {
      headers: headers,
    });
  },

  get_langues: (query, sort, populate) => {
    return axios.post(
      burl + "/langues/get_langues",
      { query: query, sort: sort, populate: populate },
      { headers: headers }
    );
  },

  getLanguages: () => axios.get(burl + "/langues/getLanguages"),

  get_channel: (query, sort, populate) => {
    return axios.post(
      burl + "/channels/get_channel",
      { query: query, sort: sort, populate: populate },
      { headers: headers }
    );
  },

  get_roles: (query, sort) => {
    return axios.post(
      burl + "/roles/get_role",
      { query: query, sort: sort },
      { headers: headers }
    );
  },

  set_image: (query) => {
    return axios.post(burl + "/images/set_image", query, { headers: headers });
  },
  get_image: (query, sort) => {
    return axios.post(
      burl + "/images/get_image",
      { query: query, sort: sort },
      { headers: headers }
    );
  },

  set_mail: (query) => {
    return axios.post(burl + "/miscellaneous/set_mail", query, {
      headers: headers,
    });
  },
  send_sms: (query) => {
    return axios.post(burl + "/miscellaneous/send_sms", query, {
      headers: headers,
    });
  },

  get_tts: (query) => {
    return axios.post(burl + "/tts/get_tts", query, {
      headers: headers,
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    });
  },
  cancel_tts_subscription: () => cancel && cancel(),

  isAuth: () => {
    return localStorage.getItem("token") !== null;
  },
  logout: () => {
    setAuthToken(false);
    delete headers["x-access-token"];
    return localStorage.removeItem("token");
  },
  create_csv_dispositifs_length: (params = {}) => {
    return axios.post(
      burl + "/dispositifs/create_csv_dispositifs_length",
      params,
      {
        headers: headers,
      }
    );
  },
};
