import ReactGA from "react-ga4";
import { logger } from "logger";
import { isEmpty } from "lodash";

/**
 * Inits GA. Must be fired once only
 */
export const initGA = () => {
  // if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "production") {
  const trackingId = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS;
  if (trackingId) ReactGA.initialize(trackingId);
  // }

  /**
   * Le code suivant permet de stocker dans un cookie
   * les informations de campagne par laquelle l'utilisateur
   * est arrivé sur le site.
   */

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
    document.cookie = "__utmz=" + utmQueryString + "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
  }
};

/**
 * Adds a page view in analytics. Not needed in GA4
 */
// export const PageView = () => {
//   const url = window.location.pathname + window.location.search;
//   if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
//     logger.info("PageView", url);
//     return;
//   }
//   ReactGA.pageview(url);
// };

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category: string, action: string, label: string) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    logger.info("Event", { category, action, label });
    // return;
  }
  ReactGA.event({
    category,
    action,
    label,
  });
};
