import { ContentType } from "api-types";

type Texts = {
  addButtonText: string
  buttonText: string
  placeholderTitle: string
  placeholderText: string
}



export const getTexts = (contentType: ContentType, isLastSection: boolean, index: number): Texts => {
  if (contentType === ContentType.DISPOSITIF) {
    // dispositif why
    if (!isLastSection) {
      return {
        addButtonText: "Ajouter un argument",
        buttonText: `Argument ${index + 1}`,
        placeholderTitle: "Titre de l'argument",
        placeholderText: "Ici, apportez tous les détails intéressants et illustrez votre idée.",
      }
    }
    // dispositif how
    return {
      addButtonText: "Ajouter une option",
      buttonText: "Contact et modalités d’inscription",
      placeholderTitle: "Contactez-nous",
      placeholderText: "Ici, précisez comment faire pour accéder au dispositif.",
    }
  }
  // demarche how
  if (!isLastSection) {
    return {
      addButtonText: "Ajouter une étape",
      buttonText: `Titre de l'étape ${index + 1}`,
      placeholderTitle: `Titre de l'étape ${index + 1}`,
      placeholderText: "Ici, apportez tous les détails intéressants et illustrez votre idée.",
    }
  }
  // demarche next
  return {
    addButtonText: "Ajouter une option",
    buttonText: "Titre",
    placeholderTitle: "Titre",
    placeholderText: "Ici, apportez tous les détails intéressants et illustrez votre idée.",
  }
}
