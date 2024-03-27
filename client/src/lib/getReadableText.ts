import h2p from "html2plaintext";
import { GetNeedResponse, GetThemeResponse, GetDispositifResponse, InfoSection, InfoSections } from "@refugies-info/api-types";
import { TFunction } from "next-i18next";

const getSpaceBeforeCallout = (text: string) => text.replaceAll("</p>", "</p> ")

export const getSectionReadableText = (section: InfoSection | undefined): string => {
  if (!section) return "";
  return `${section.title}. ${h2p(getSpaceBeforeCallout(section.text))}`;
}

export const getSectionsReadableText = (sections: InfoSections | undefined, title: string): string => {
  if (!sections) return "";
  return [
    title,
    ...Object.values(sections).map(s => getSectionReadableText(s))
  ].join(". ");
}
export const getReadableText = (text: string): string => {
  return h2p(getSpaceBeforeCallout(text));
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
  needs: GetNeedResponse[],
  t: TFunction
): string[] => {
  if (!dispositif) return [];
  return [
    dispositif.titreInformatif || "",
    t("Dispositif.sectionWhat"),
    getReadableText(dispositif.what),
    getSectionsReadableText(dispositif.why, t("Dispositif.sectionWhy")),
    getSectionsReadableText(dispositif.how, t("Dispositif.sectionHow")),
    getSectionsReadableText(dispositif.next, t("Dispositif.sectionNext")),
    getLinkedThemesReadableText(theme, secondaryThemes, needs)
  ]
    .filter(t => !!t)
}
