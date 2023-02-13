import { GetDispositifResponse } from "api-types";

export const getMetadataTitle = (title: keyof GetDispositifResponse["metadatas"]) => {
  switch (title) {
    case "location":
      return "Localisation";
    case "frenchLevel":
      return "Niveau de français"
    case "important":
      return "Important"
    case "age":
      return "Âge requis"
    case "price":
      return "Prix"
    case "duration":
      return "Durée"
    case "public":
      return "Public cible"
    case "titreSejourRequired":
      return "Titre de séjour"
    case "acteNaissanceRequired":
      return "Acte de naissance"
    case "justificatif":
      return "Justificatif requis"
  }
}

export const getPrice = (price: GetDispositifResponse["metadatas"]["price"] | undefined) => {
  if (!price) return "";
  if (price.value === 0) return "Gratuit";
  return `${price.value}$ ${price.details}`;
}

export const getAge = (age: GetDispositifResponse["metadatas"]["age"] | undefined) => {
  if (!age) return "";
  switch (age.type) {
    case "lessThan":
      return `Moins de ${age.ages[0]} ans`;
    case "moreThan":
      return `Plus de ${age.ages[0]} ans`;
    case "between":
      return `Entre ${age.ages[0]} et ${age.ages[1]} ans`;
  }
}

export const getPublic = (publicType: GetDispositifResponse["metadatas"]["public"] | undefined) => {
  if (!publicType) return "";
  return publicType === "refugee" ? "Réfugiés" : "Tout le monde";
}
