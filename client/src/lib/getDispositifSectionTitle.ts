export type titleKeyType = "what" | "why" | "how" | "next" | "abstract";

// TODO: translate
export const getDispositifSectionTitle = (sectionKey: titleKeyType) => {
  switch (sectionKey) {
    case "what":
      return "C'est quoi ?"
    case "why":
      return "Pourquoi c'est intéressant ?"
    case "how":
      return "Comment faire ?"
    case "next":
      return "Et après ?"
    case "abstract":
      return "Résumé"
  }
}
