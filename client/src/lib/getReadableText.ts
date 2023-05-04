import h2p from "html2plaintext";
import { GetNeedResponse, GetThemeResponse, GetDispositifResponse, InfoSection, InfoSections } from "api-types";

export const getSectionReadableText = (section: InfoSection | undefined): string => {
  if (!section) return "";
  return `${section.title}. ${h2p(section.text)}`;
}
export const getSectionsReadableText = (sections: InfoSections | undefined): string => {
  if (!sections) return "";
  return Object.values(sections).map(s => getSectionReadableText(s)).join(". ");
}
export const getReadableText = (text: string): string => {
  return h2p(text);
}

export const getLinkedThemesReadableText = (
  theme: GetThemeResponse | null,
  secondaryThemes: GetThemeResponse[],
  needs: GetNeedResponse[]
) => {
  return [
    theme?.short?.fr || "",
    ...secondaryThemes.map(t => t.short?.fr),
    ...needs.map(n => n.fr.text),
  ]
    .filter(t => !!t)
    .join(". ");
}

export const getAllPageReadableText = (
  dispositif: GetDispositifResponse | null,
  theme: GetThemeResponse | null,
  secondaryThemes: GetThemeResponse[],
  needs: GetNeedResponse[]
): string => {
  if (!dispositif) return "";
  return [
    dispositif.titreInformatif || "",
    getReadableText(dispositif.what),
    getSectionsReadableText(dispositif.why),
    getSectionsReadableText(dispositif.how),
    getSectionsReadableText(dispositif.next),
    getLinkedThemesReadableText(theme, secondaryThemes, needs)
  ]
    .filter(t => !!t)
    .join(". ")
}
