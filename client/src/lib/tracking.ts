import ReactGA from "react-ga4";
import { logger } from "logger";
import { isEmpty } from "lodash";

/**
 * Le code suivant permet de stocker dans un cookie
 * les informations de campagne par laquelle l'utilisateur
 * est arrivé sur le site.
 */
const storeCampaignInfosInCookie = () => {
  // Récupérer l'URL actuelle de la page
  var url = window.location.href;

  // Fonction pour extraire les paramètres UTM de l'URL
  function getUTMParameters(url: string) {
    var utmParams: { [key: string]: string } = {};
    var queryString = url.split("?")[1];

    if (queryString) {
      var params = queryString.split("&");
      for (var i = 0; i < params.length; i++) {
        var param = params[i].split("=");
        if (param[0].indexOf("utm_") === 0) {
          utmParams[param[0]] = param[1];
        }
      }
    }

    return utmParams;
  }

  var utmData = getUTMParameters(url);

  if (!isEmpty(utmData)) {
    // Convertir les paramètres UTM en une chaîne de requête
    var utmQueryString = Object.keys(utmData)
      .map((key) => key + "=" + utmData[key])
      .join("&");

    // Créer un cookie __utmz de remplacement
    document.cookie = "__utmz=" + utmQueryString + "; path=/; expires=0";
  }
}

/**
 * Inits GA with consent option, or update if already initialized
 */
export const initGA = (consent: boolean) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") return;
  const trackingId = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS;

  if (!ReactGA.isInitialized) {
    ReactGA.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: consent ? "granted" : "denied",
    });
    if (trackingId) ReactGA.initialize(trackingId);
  } else {
    ReactGA.gtag("consent", "update", {
      analytics_storage: consent ? "granted" : "denied",
    });
  }
  storeCampaignInfosInCookie();
};


/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category: string, action: string, label: string) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    logger.info("Event", { category, action, label });
    return;
  }
  ReactGA.event({
    category,
    action,
    label,
  });
};

export const setAnalyticsUserId = (id: string) => {
  logger.info("setAnalyticsUserId", { userId: id });
  ReactGA.isInitialized && ReactGA.set({ userId: id });
};
