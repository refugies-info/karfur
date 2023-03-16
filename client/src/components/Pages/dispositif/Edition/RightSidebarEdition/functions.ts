import { contentHelp, titleHelp, whatHelp } from "./data"

export const getHelp = (activeSection: string | undefined) => {
  if (!activeSection) return null;
  if (activeSection === "titreInformatif") return titleHelp;
  if (activeSection === "what") return whatHelp;
  if (activeSection.includes("why") || activeSection.includes("how") || activeSection.includes("next")) return contentHelp;
  return null
}
