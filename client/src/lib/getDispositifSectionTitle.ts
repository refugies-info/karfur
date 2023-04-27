export type titleKeyType = "what" | "why" | "how" | "next" | "abstract";

export const getDispositifSectionTitle = (sectionKey: titleKeyType) => {
  switch (sectionKey) {
    case "what":
      return "Dispositif.sectionWhat"
    case "why":
      return "Dispositif.sectionWhy"
    case "how":
      return "Dispositif.sectionHow"
    case "next":
      return "Dispositif.sectionNext"
    case "abstract":
      return "Dispositif.sectionAbstract"
  }
}
