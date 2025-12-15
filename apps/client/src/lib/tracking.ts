import { isEmpty } from "lodash";
import { logger } from "logger";
import ReactGA from "react-ga4";

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

    // expire utmz cookie after 1 day
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);

    // Créer un cookie __utmz de remplacement
    document.cookie = `__utmz=${utmQueryString}; path=/; expires=${expires.toUTCString()}`;
  }
};

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category: string, action: string, label?: string | undefined) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    logger.info("Event", { category, action, label });
  }
  ReactGA.event({
    category,
    action,
    label: label || undefined,
  });
};

/**
 * Event - Add custom tracking event with structured Data.
 * @param {string} eventName
 * @param {object} eventData
 */
export const customEvent = (eventName: string, eventData: object) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    logger.info("Event", { eventName, eventData });
  }

  ReactGA.gtag("event", eventName, eventData);
};

/**
 * Inits GA with consent option, or update if already initialized
 */
export const initGA = (consent: boolean) => {
  const trackingId =
    process.env.NEXT_PUBLIC_REACT_APP_ENV === "production"
      ? process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS_PROD
      : process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS_STAG || null;

  if (!trackingId) return;

  if (!ReactGA.isInitialized) {
    ReactGA.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: consent ? "granted" : "denied",
    });
    if (trackingId) ReactGA.initialize(trackingId);
    Event("SESSION", "count", "start");
  } else {
    ReactGA.gtag("consent", "update", {
      analytics_storage: consent ? "granted" : "denied",
    });
  }
  storeCampaignInfosInCookie();
};

export const setAnalyticsUserId = (id: string) => {
  logger.info("setAnalyticsUserId", { userId: id });
  ReactGA.isInitialized && ReactGA.set({ userId: id });
};
