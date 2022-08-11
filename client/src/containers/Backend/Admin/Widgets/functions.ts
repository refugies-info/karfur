import { Widget } from "types/interface";
import { getBaseUrl } from "lib/getBaseUrl";

export const generateIframe = (widget: Widget) => {
  const locationParam = widget.location?.city && widget.location?.department ?
    `city=${widget.location.city}&dep=${widget.location.department}`
    : "";
  const typeContenuParam = widget.typeContenu.length === 1 ? // works only with 2 types of content
    `filter=${widget.typeContenu[0]}`
    : "";
  const langueParam = widget.languages && widget.languages.length > 0 ?
    `langue=${widget.languages[0]}`
    : "";
  const tagParam = widget.themes ?
    `tag=${widget.themes.map(t => t.name.fr).join(",")}`
    : "";
  const urlParams = [locationParam, typeContenuParam, langueParam, tagParam]
    .filter(t => t !== "")
    .join("&");
  const analyticsParam = `&utm_source=widget&utm_medium=Iframe&utm_campaign=${encodeURI(widget.name)}`
  const iframe = `<iframe width="930" height="600" src="${getBaseUrl()}fr/embed?${encodeURI(urlParams)}${analyticsParam}" title="${widget.name}" frameborder="0"></iframe>`;

  return `<!-- Début de widget Réfugiés.info -->${iframe}<!-- Fin du widget Réfugiés.info -->`;
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
}
