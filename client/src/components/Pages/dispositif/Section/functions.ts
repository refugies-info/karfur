export const getSectionTitle = (sectionKey: string) => {
  switch (sectionKey) {
    case "what":
      return "C'est quoi ?"
    case "why":
      return "Pourquoi c'est intéressant ?"
    case "how":
      return "Comment faire ?"
    case "next":
      return "Et après ?"
    default:
      return "";
  }
}
