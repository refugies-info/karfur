import { ContentType } from "@refugies-info/api-types";
import { contentHelp, mapHelp, nextHelp, titleHelp, titreMarqueHelp, whatHelp } from "./data"

export const getHelp = (activeSection: string | undefined, typeContenu: ContentType) => {
  if (!activeSection) return null;
  if (activeSection === "titreInformatif") return titleHelp;
  if (activeSection === "titreMarque") return titreMarqueHelp;
  if (activeSection === "what") return whatHelp;
  if (activeSection === "map") return mapHelp;
  if (typeContenu === ContentType.DISPOSITIF) {
    if (activeSection.includes("why")) return contentHelp;
    if (activeSection.includes("how")) return nextHelp;
  }
  if (typeContenu === ContentType.DEMARCHE) {
    if (activeSection.includes("how")) return contentHelp;
    if (activeSection.includes("next")) return nextHelp;
  }
  return null
}
