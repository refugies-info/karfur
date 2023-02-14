import qs from "query-string";
import { getBaseUrl } from "lib/getBaseUrl";
import type { UrlSearchQuery } from "pages/recherche";
import { GetWidgetResponse } from "api-types";

export const generateIframe = (widget: GetWidgetResponse) => {
  const query: UrlSearchQuery = { type: "all" };
  if (widget.department) query.departments = [widget.department];
  if (widget.typeContenu.length === 1) { // works only with 2 types of content
    query.type = widget.typeContenu[0];
  }
  if (widget.languages && widget.languages.length > 0) {
    query.language = widget.languages[0];
  }
  if (widget.themes) {
    query.themes = widget.themes
  }
  const queryString = qs.stringify(query, { arrayFormat: "comma" });

  const analyticsParam = `&utm_source=widget&utm_medium=Iframe&utm_campaign=${encodeURI(widget.name)}`
  const iframe = `<iframe width="930" height="600" src="${getBaseUrl()}fr/embed?${encodeURI(queryString)}${analyticsParam}" title="${widget.name}" frameborder="0"></iframe>`;

  return `<!-- Début de widget Réfugiés.info -->${iframe}<!-- Fin du widget Réfugiés.info -->`;
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}
